import sqlite3
import json
import os
import hashlib
import hmac
from typing import Dict, List, Any

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "portfolio.db")
SECRET_SALT = "roshan_portfolio_secure_salt_2026"

def hash_password(password: str) -> str:
    """Hash password securely using PBKDF2 with SHA-256."""
    return hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        SECRET_SALT.encode('utf-8'),
        100000
    ).hex()

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify raw password against stored PBKDF2 hash."""
    return hmac.compare_digest(hash_password(password), hashed_password)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize SQLite database schema and seed initial data if empty."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Profile Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        name TEXT,
        title TEXT,
        location TEXT,
        phone TEXT,
        email TEXT,
        github TEXT,
        linkedin TEXT,
        avatar_url TEXT,
        summary TEXT
    );
    """)

    # 2. Projects Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT,
        category TEXT,
        summary TEXT,
        description TEXT,
        image_url TEXT,
        technologies TEXT,
        featured INTEGER,
        live_url TEXT,
        icon TEXT,
        accent_color TEXT
    );
    """)

    # 3. Experience Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS experience (
        id TEXT PRIMARY KEY,
        role TEXT,
        company TEXT,
        period TEXT,
        location TEXT,
        is_current INTEGER,
        description TEXT,
        highlights TEXT,
        technologies TEXT
    );
    """)

    # 4. Skills Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS skills (
        name TEXT PRIMARY KEY,
        level INTEGER,
        category TEXT,
        icon_url TEXT
    );
    """)

    # 5. Contact Messages Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        subject TEXT,
        message TEXT,
        received_at REAL
    );
    """)

    # 6. Admin Credentials Table (Encrypted / Hashed Passwords)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS admin (
        username TEXT PRIMARY KEY,
        password_hash TEXT,
        recovery_email TEXT
    );
    """)

    conn.commit()

    # Seed data from data.py if database tables are empty
    seed_initial_data(conn)
    conn.close()

def seed_initial_data(conn):
    cursor = conn.cursor()
    
    # Import seed fallback data
    try:
        from backend.data import PROFILE, EXPERIENCE, PROJECTS, SKILLS
    except ModuleNotFoundError:
        from data import PROFILE, EXPERIENCE, PROJECTS, SKILLS

    # Seed Profile
    cursor.execute("SELECT COUNT(*) FROM profile;")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO profile (id, name, title, location, phone, email, github, linkedin, avatar_url, summary)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            PROFILE.get("name"),
            PROFILE.get("title"),
            PROFILE.get("location"),
            PROFILE.get("phone"),
            PROFILE.get("email"),
            PROFILE.get("github"),
            PROFILE.get("linkedin"),
            PROFILE.get("avatar_url"),
            PROFILE.get("summary")
        ))

    # Seed Projects
    cursor.execute("SELECT COUNT(*) FROM projects;")
    if cursor.fetchone()[0] == 0:
        for p in PROJECTS:
            cursor.execute("""
            INSERT OR REPLACE INTO projects (id, title, category, summary, description, image_url, technologies, featured, live_url, icon, accent_color)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                p["id"],
                p["title"],
                p["category"],
                p["summary"],
                p["description"],
                p["image_url"],
                json.dumps(p.get("technologies", [])),
                1 if p.get("featured", True) else 0,
                p.get("live_url", ""),
                p.get("icon", "Code"),
                p.get("accent_color", "#ef4444")
            ))

    # Seed Experience
    cursor.execute("SELECT COUNT(*) FROM experience;")
    if cursor.fetchone()[0] == 0:
        for e in EXPERIENCE:
            cursor.execute("""
            INSERT OR REPLACE INTO experience (id, role, company, period, location, is_current, description, highlights, technologies)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                e["id"],
                e["role"],
                e["company"],
                e["period"],
                e["location"],
                1 if e.get("is_current") else 0,
                e.get("description", ""),
                json.dumps(e.get("highlights", [])),
                json.dumps(e.get("technologies", []))
            ))

    # Seed Skills
    cursor.execute("SELECT COUNT(*) FROM skills;")
    if cursor.fetchone()[0] == 0:
        tech_skills = SKILLS.get("technical", [])
        for s in tech_skills:
            cursor.execute("""
            INSERT OR REPLACE INTO skills (name, level, category, icon_url)
            VALUES (?, ?, ?, ?);
            """, (
                s["name"],
                s.get("level", 85),
                s.get("category", "Technical"),
                s.get("icon_url", "")
            ))

    # Seed Admin User with hashed password
    cursor.execute("SELECT COUNT(*) FROM admin;")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO admin (username, password_hash, recovery_email)
        VALUES (?, ?, ?);
        """, ("Roshan", hash_password("Roshan @2304"), "roshanganesh30@gmail.com"))

    conn.commit()

# --- ADMIN AUTHENTICATION HELPERS ---

def db_get_admin() -> Dict[str, Any]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM admin LIMIT 1;").fetchone()
    conn.close()
    return dict(row) if row else {}

def db_verify_admin_login(username: str, raw_password: str) -> bool:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM admin WHERE LOWER(username) = LOWER(?);", (username.strip(),)).fetchone()
    conn.close()
    if row and verify_password(raw_password.strip(), row["password_hash"]):
        return True
    return False

def db_update_admin_password(new_password: str) -> bool:
    conn = get_db_connection()
    new_hash = hash_password(new_password.strip())
    conn.execute("UPDATE admin SET password_hash = ? WHERE username = 'Roshan';", (new_hash,))
    conn.commit()
    conn.close()
    return True

# --- DATABASE QUERY & MUTATION HELPERS ---

def db_get_profile() -> Dict[str, Any]:
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM profile WHERE id = 1;").fetchone()
    conn.close()
    if row:
        data = dict(row)
        data["stats"] = [
            {"label": "Years Experience", "value": "1+"},
            {"label": "Projects Built", "value": "6+"},
            {"label": "Core Technologies", "value": "16+"},
            {"label": "Certifications", "value": "2"}
        ]
        return data
    return {}

def db_update_profile(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    fields = []
    values = []
    for k, v in data.items():
        if k in ["name", "title", "location", "phone", "email", "github", "linkedin", "avatar_url", "summary"]:
            fields.append(f"{k} = ?")
            values.append(v)
    if fields:
        values.append(1)
        conn.execute(f"UPDATE profile SET {', '.join(fields)} WHERE id = ?;", values)
        conn.commit()
    conn.close()
    return db_get_profile()

def db_get_projects(category: str = None) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    if category and category != "All":
        rows = conn.execute("SELECT * FROM projects WHERE LOWER(category) = LOWER(?);", (category,)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM projects;").fetchall()
    conn.close()
    
    result = []
    for r in rows:
        d = dict(r)
        d["technologies"] = json.loads(d["technologies"]) if d["technologies"] else []
        d["featured"] = bool(d["featured"])
        result.append(d)
    return result

def db_save_project(p: Dict[str, Any]) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    conn.execute("""
    INSERT OR REPLACE INTO projects (id, title, category, summary, description, image_url, technologies, featured, live_url, icon, accent_color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        p["id"],
        p["title"],
        p["category"],
        p["summary"],
        p["description"],
        p["image_url"],
        json.dumps(p.get("technologies", [])),
        1 if p.get("featured", True) else 0,
        p.get("live_url", ""),
        p.get("icon", "Code"),
        p.get("accent_color", "#ef4444")
    ))
    conn.commit()
    conn.close()
    return db_get_projects()

def db_delete_project(project_id: str):
    conn = get_db_connection()
    conn.execute("DELETE FROM projects WHERE id = ?;", (project_id,))
    conn.commit()
    conn.close()

def db_get_experience() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM experience;").fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d["highlights"] = json.loads(d["highlights"]) if d["highlights"] else []
        d["technologies"] = json.loads(d["technologies"]) if d["technologies"] else []
        d["is_current"] = bool(d["is_current"])
        result.append(d)
    return result

def db_save_experience(e: Dict[str, Any]) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    conn.execute("""
    INSERT OR REPLACE INTO experience (id, role, company, period, location, is_current, description, highlights, technologies)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        e["id"],
        e["role"],
        e["company"],
        e["period"],
        e["location"],
        1 if e.get("is_current") else 0,
        e.get("description", ""),
        json.dumps(e.get("highlights", [])),
        json.dumps(e.get("technologies", []))
    ))
    conn.commit()
    conn.close()
    return db_get_experience()

def db_delete_experience(exp_id: str):
    conn = get_db_connection()
    conn.execute("DELETE FROM experience WHERE id = ?;", (exp_id,))
    conn.commit()
    conn.close()

def db_get_skills() -> Dict[str, Any]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM skills;").fetchall()
    conn.close()
    skills = [dict(r) for r in rows]
    return {"technical": skills}

def db_save_skill(s: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    conn.execute("""
    INSERT OR REPLACE INTO skills (name, level, category, icon_url)
    VALUES (?, ?, ?, ?);
    """, (
        s["name"],
        s.get("level", 85),
        s.get("category", "Technical"),
        s.get("icon_url", "")
    ))
    conn.commit()
    conn.close()
    return db_get_skills()

def db_delete_skill(skill_name: str):
    conn = get_db_connection()
    conn.execute("DELETE FROM skills WHERE LOWER(name) = LOWER(?);", (skill_name,))
    conn.commit()
    conn.close()

def db_add_contact_message(msg: Dict[str, Any]):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO contact_messages (name, email, subject, message, received_at)
    VALUES (?, ?, ?, ?, ?);
    """, (
        msg["name"],
        msg["email"],
        msg["subject"],
        msg["message"],
        msg["received_at"]
    ))
    conn.commit()
    conn.close()

def db_get_contact_messages() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM contact_messages ORDER BY received_at DESC;").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_delete_contact_message(msg_id: int):
    conn = get_db_connection()
    conn.execute("DELETE FROM contact_messages WHERE id = ?;", (msg_id,))
    conn.commit()
    conn.close()
