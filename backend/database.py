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
        summary TEXT,
        years_experience TEXT
    );
    """)

    # Migration for existing DBs missing years_experience
    try:
        cursor.execute("ALTER TABLE profile ADD COLUMN years_experience TEXT;")
    except sqlite3.OperationalError:
        pass

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
        icon_url TEXT,
        order_index INTEGER DEFAULT 0
    );
    """)

    try:
        cursor.execute("ALTER TABLE skills ADD COLUMN order_index INTEGER DEFAULT 0;")
    except sqlite3.OperationalError:
        pass

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

    # 7. Certifications Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS certifications (
        id TEXT PRIMARY KEY,
        title TEXT,
        organization TEXT,
        location TEXT,
        description TEXT,
        issue_date TEXT,
        credential_url TEXT
    );
    """)

    # 8. Soft Skills Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS soft_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
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
        from backend.data import PROFILE, EXPERIENCE, PROJECTS, SKILLS, CERTIFICATIONS
    except ModuleNotFoundError:
        from data import PROFILE, EXPERIENCE, PROJECTS, SKILLS, CERTIFICATIONS

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

    # Seed / Sync Skills
    tech_skills = SKILLS.get("technical", [])
    for idx, s in enumerate(tech_skills):
        cursor.execute("""
        INSERT INTO skills (name, level, category, icon_url, order_index)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(name) DO UPDATE SET
            level=excluded.level,
            category=excluded.category,
            icon_url=excluded.icon_url;
        """, (
            s["name"],
            s.get("level", 85),
            s.get("category", "Technical"),
            s.get("icon_url", ""),
            idx + 1
        ))

    # Seed / Sync Soft Skills
    cursor.execute("SELECT COUNT(*) FROM soft_skills;")
    if cursor.fetchone()[0] == 0:
        soft_skills = SKILLS.get("soft", [])
        for s in soft_skills:
            cursor.execute("INSERT OR IGNORE INTO soft_skills (name) VALUES (?);", (s,))

    # Seed Certifications
    cursor.execute("SELECT COUNT(*) FROM certifications;")
    if cursor.fetchone()[0] == 0:
        for c in CERTIFICATIONS:
            cursor.execute("""
            INSERT OR REPLACE INTO certifications (id, title, organization, location, description, issue_date, credential_url)
            VALUES (?, ?, ?, ?, ?, ?, ?);
            """, (
                c["id"],
                c["title"],
                c["organization"],
                c.get("location", ""),
                c.get("description", ""),
                c.get("issue_date", ""),
                c.get("credential_url", "")
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
    cert_count = conn.execute("SELECT COUNT(*) FROM certifications;").fetchone()[0]
    conn.close()
    if row:
        data = dict(row)
        years_exp = data.get("years_experience")
        if not years_exp:
            years_exp = "1+"  # Default / automated fallback
        data["years_experience"] = years_exp
        data["stats"] = [
            {"label": "Years Experience", "value": years_exp},
            {"label": "Projects Built", "value": "6+"},
            {"label": "Core Technologies", "value": "16+"},
            {"label": "Certifications", "value": str(cert_count)}
        ]
        return data
    return {}

def db_update_profile(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    fields = []
    values = []
    for k, v in data.items():
        if k in ["name", "title", "location", "phone", "email", "github", "linkedin", "avatar_url", "summary", "years_experience"]:
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

    if not category or category == "All":
        def cat_priority(p):
            c = (p.get("category") or "").lower()
            if "mobile" in c or "app" in c:
                return 1
            if "ai" in c or "python" in c:
                return 2
            if "web" in c or "full-stack" in c or "fullstack" in c:
                return 3
            return 4
        result.sort(key=cat_priority)

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
    tech_rows = conn.execute("SELECT * FROM skills ORDER BY order_index ASC, rowid ASC;").fetchall()
    soft_rows = conn.execute("SELECT * FROM soft_skills;").fetchall()
    conn.close()
    technical = [dict(r) for r in tech_rows]
    soft = [r["name"] for r in soft_rows]
    return {"technical": technical, "soft": soft}

def db_save_skill(s: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    if "order_index" not in s or s["order_index"] is None:
        max_order = conn.execute("SELECT MAX(order_index) FROM skills;").fetchone()[0]
        order_idx = (max_order or 0) + 1
    else:
        order_idx = s["order_index"]

    conn.execute("""
    INSERT INTO skills (name, level, category, icon_url, order_index)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET
        level=excluded.level,
        category=excluded.category,
        icon_url=excluded.icon_url,
        order_index=COALESCE(excluded.order_index, skills.order_index);
    """, (
        s["name"],
        s.get("level", 85),
        s.get("category", "Technical"),
        s.get("icon_url", ""),
        order_idx
    ))
    conn.commit()
    conn.close()
    return db_get_skills()

def db_reorder_skills(ordered_names: List[str]) -> Dict[str, Any]:
    conn = get_db_connection()
    for idx, name in enumerate(ordered_names):
        conn.execute("UPDATE skills SET order_index = ? WHERE LOWER(name) = LOWER(?);", (idx + 1, name.strip()))
    conn.commit()
    conn.close()
    return db_get_skills()

def db_delete_skill(skill_name: str):
    conn = get_db_connection()
    conn.execute("DELETE FROM skills WHERE LOWER(name) = LOWER(?);", (skill_name,))
    conn.commit()
    conn.close()
    return db_get_skills()

def db_save_soft_skill(name: str) -> Dict[str, Any]:
    conn = get_db_connection()
    conn.execute("INSERT OR IGNORE INTO soft_skills (name) VALUES (?);", (name.strip(),))
    conn.commit()
    conn.close()
    return db_get_skills()

def db_delete_soft_skill(name: str) -> Dict[str, Any]:
    conn = get_db_connection()
    conn.execute("DELETE FROM soft_skills WHERE LOWER(name) = LOWER(?);", (name.strip(),))
    conn.commit()
    conn.close()
    return db_get_skills()

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

# --- CERTIFICATIONS HELPERS ---

def db_get_certifications() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM certifications ORDER BY issue_date DESC, rowid DESC;").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_save_certification(c: Dict[str, Any]) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    conn.execute("""
    INSERT OR REPLACE INTO certifications (id, title, organization, location, description, issue_date, credential_url)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    """, (
        c["id"],
        c["title"],
        c.get("organization", ""),
        c.get("location", ""),
        c.get("description", ""),
        c.get("issue_date", ""),
        c.get("credential_url", "")
    ))
    conn.commit()
    conn.close()
    return db_get_certifications()

def db_delete_certification(cert_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    conn.execute("DELETE FROM certifications WHERE id = ?;", (cert_id,))
    conn.commit()
    conn.close()
    return db_get_certifications()
