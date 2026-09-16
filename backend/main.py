import os
import time
from typing import List, Optional
from fastapi import FastAPI, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

try:
    from backend.database import (
        init_db,
        db_get_profile,
        db_update_profile,
        db_get_projects,
        db_save_project,
        db_delete_project,
        db_get_experience,
        db_save_experience,
        db_delete_experience,
        db_get_skills,
        db_save_skill,
        db_delete_skill,
        db_reorder_skills,
        db_add_contact_message,
        db_get_contact_messages,
        db_delete_contact_message,
        db_get_admin,
        db_verify_admin_login,
        db_update_admin_password,
        db_get_certifications,
        db_save_certification,
        db_delete_certification,
        db_save_soft_skill,
        db_delete_soft_skill
    )
except ModuleNotFoundError:
    from database import (
        init_db,
        db_get_profile,
        db_update_profile,
        db_get_projects,
        db_save_project,
        db_delete_project,
        db_get_experience,
        db_save_experience,
        db_delete_experience,
        db_get_skills,
        db_save_skill,
        db_delete_skill,
        db_reorder_skills,
        db_add_contact_message,
        db_get_contact_messages,
        db_delete_contact_message,
        db_get_admin,
        db_verify_admin_login,
        db_update_admin_password,
        db_get_certifications,
        db_save_certification,
        db_delete_certification,
        db_save_soft_skill,
        db_delete_soft_skill
    )

app = FastAPI(
    title="Roshan Ganesh I - Portfolio API",
    description="Backend API powering Roshan Ganesh I's Personal Portfolio Website with SQLite3 Database",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount public images directory so uploaded files are served immediately
IMAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "public", "images")
os.makedirs(IMAGES_DIR, exist_ok=True)
app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")

@app.on_event("startup")
def startup_event():
    """Initialize SQLite database and seed initial data if needed."""
    init_db()

class ContactFormRequest(BaseModel):
    name: Optional[str] = Field(default="Anonymous")
    email: Optional[str] = Field(default="")
    subject: Optional[str] = Field(default="No Subject")
    message: Optional[str] = Field(default="")

class ContactResponse(BaseModel):
    success: bool
    message: str
    timestamp: float

@app.get("/")
def read_root():
    prof = db_get_profile()
    return {
        "status": "online",
        "developer": prof.get("name", "Roshan Ganesh I"),
        "role": prof.get("title", "App Developer"),
        "database": "SQLite3",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database": "sqlite3", "timestamp": time.time()}

@app.get("/api/profile")
def get_profile():
    return db_get_profile()

@app.get("/api/experience")
def get_experience():
    return db_get_experience()

@app.get("/api/projects")
def get_projects(category: Optional[str] = None):
    return db_get_projects(category=category)

@app.get("/api/skills")
def get_skills():
    return db_get_skills()

@app.get("/api/education")
def get_education():
    try:
        from backend.data import EDUCATION
    except ModuleNotFoundError:
        from data import EDUCATION
    return {
        "education": EDUCATION,
        "certifications": db_get_certifications()
    }

@app.get("/api/certifications")
def get_certifications():
    return db_get_certifications()

@app.post("/api/contact", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_form(payload: ContactFormRequest):
    name = (payload.name or "Anonymous").strip()
    email = (payload.email or "no-email@provided.com").strip()
    subject = (payload.subject or "No Subject").strip()
    message = (payload.message or "(No message content)").strip()

    now = time.time()
    submission = {
        "name": name,
        "email": email,
        "subject": subject if subject else "No Subject",
        "message": message if message else "(No message content)",
        "received_at": now
    }
    db_add_contact_message(submission)
    print(f"[CONTACT FORM SUBMISSION] From: {name} ({email}) - {subject}")
    
    return ContactResponse(
        success=True,
        message=f"Thank you, {name}! Your message has been received successfully. Roshan will get back to you shortly.",
        timestamp=now
    )

@app.get("/api/contact/messages")
def get_contact_messages():
    """Endpoint for viewing received messages stored in SQLite."""
    msgs = db_get_contact_messages()
    return {
        "total": len(msgs),
        "messages": msgs
    }

@app.delete("/api/contact/messages/{msg_id}")
def delete_contact_message(msg_id: int):
    db_delete_contact_message(msg_id)
    msgs = db_get_contact_messages()
    return {"status": "deleted", "total": len(msgs)}

# --- ADMIN PANEL ENDPOINTS & AUTHENTICATION ---

class AdminLoginRequest(BaseModel):
    username: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str
    new_password: Optional[str] = None

@app.post("/api/admin/login")
def admin_login(credentials: AdminLoginRequest):
    if db_verify_admin_login(credentials.username, credentials.password):
        return {
            "success": True,
            "message": "Authentication successful",
            "token": "admin-session-token-roshan-2026"
        }
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username or password. Please check your credentials."
    )

@app.post("/api/admin/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    admin_info = db_get_admin()
    rec_email = admin_info.get("recovery_email", "roshanganesh30@gmail.com")
    
    if req.email.strip().lower() == rec_email.lower():
        if req.new_password and len(req.new_password) >= 4:
            db_update_admin_password(req.new_password.strip())
            return {
                "success": True,
                "message": "Password reset successfully in SQLite database! You can now log in with your new password."
            }
        return {
            "success": True,
            "message": f"Verification successful! Registered admin username is: '{admin_info.get('username', 'Roshan')}' (Password is securely hashed with PBKDF2 in portfolio.db)."
        }
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Email does not match registered admin account (roshanganesh30@gmail.com)."
    )

# File Upload Endpoint for Device Image & Icon uploads
@app.post("/api/admin/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload image or icon file from user device and store in frontend/public/images/."""
    try:
        # Sanitize filename
        orig_filename = file.filename.replace(" ", "_")
        filename = f"{int(time.time())}_{orig_filename}"
        file_path = os.path.join(IMAGES_DIR, filename)
        
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
            
        url_path = f"/images/{filename}"
        return {
            "status": "success",
            "filename": filename,
            "url": url_path
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    summary: Optional[str] = None
    years_experience: Optional[str] = None

@app.put("/api/admin/profile")
def update_admin_profile(payload: ProfileUpdateRequest):
    data = payload.dict(exclude_unset=True)
    updated = db_update_profile(data)
    return {"status": "success", "profile": updated}

class ProjectModel(BaseModel):
    id: Optional[str] = None
    title: str
    category: str
    summary: str
    description: str
    image_url: str
    technologies: List[str]
    featured: bool = True
    live_url: Optional[str] = ""
    icon: Optional[str] = "Code"
    accent_color: Optional[str] = "#ef4444"

@app.post("/api/admin/projects")
def add_or_update_project(project: ProjectModel):
    proj_dict = project.dict()
    if not proj_dict.get("id"):
        proj_dict["id"] = proj_dict["title"].lower().replace(" ", "-")
    
    projects = db_save_project(proj_dict)
    return {"status": "success", "projects": projects}

@app.delete("/api/admin/projects/{project_id}")
def delete_project(project_id: str):
    db_delete_project(project_id)
    projects = db_get_projects()
    return {"status": "deleted", "projects": projects}

class ExperienceModel(BaseModel):
    id: Optional[str] = None
    role: str
    company: str
    period: Optional[str] = ""
    location: Optional[str] = ""
    is_current: bool = False
    description: Optional[str] = ""
    highlights: List[str] = []
    technologies: List[str] = []

@app.post("/api/admin/experience")
def add_or_update_experience(exp: ExperienceModel):
    exp_dict = exp.dict()
    if not exp_dict.get("id"):
        exp_dict["id"] = exp_dict["company"].lower().replace(" ", "-")
    
    exps = db_save_experience(exp_dict)
    return {"status": "success", "experience": exps}

@app.delete("/api/admin/experience/{exp_id}")
def delete_experience(exp_id: str):
    db_delete_experience(exp_id)
    exps = db_get_experience()
    return {"status": "deleted", "experience": exps}

class SkillModel(BaseModel):
    name: str
    level: int = 85
    category: str = "Technical"
    icon_url: Optional[str] = ""

@app.post("/api/admin/skills")
def add_or_update_skill(skill: SkillModel):
    skill_dict = skill.dict()
    skills = db_save_skill(skill_dict)
    return {"status": "success", "skills": skills}

@app.delete("/api/admin/skills/{skill_name}")
def delete_skill(skill_name: str):
    skills = db_delete_skill(skill_name)
    return {"status": "deleted", "skills": skills}

class ReorderSkillsRequest(BaseModel):
    ordered_names: List[str]

@app.post("/api/admin/skills/reorder")
def reorder_skills(payload: ReorderSkillsRequest):
    skills = db_reorder_skills(payload.ordered_names)
    return {"status": "success", "skills": skills}

class SoftSkillModel(BaseModel):
    name: str

@app.post("/api/admin/soft-skills")
def add_soft_skill(payload: SoftSkillModel):
    skills = db_save_soft_skill(payload.name)
    return {"status": "success", "skills": skills}

@app.delete("/api/admin/soft-skills/{name}")
def delete_soft_skill(name: str):
    skills = db_delete_soft_skill(name)
    return {"status": "deleted", "skills": skills}

class CertificationModel(BaseModel):
    id: Optional[str] = None
    title: str
    organization: str
    location: Optional[str] = ""
    description: Optional[str] = ""
    issue_date: Optional[str] = ""
    credential_url: Optional[str] = ""

@app.post("/api/admin/certifications")
def add_or_update_certification(cert: CertificationModel):
    cert_dict = cert.dict()
    if not cert_dict.get("id"):
        cert_dict["id"] = cert_dict["title"].lower().replace(" ", "-") + "-" + str(int(time.time()))
    certs = db_save_certification(cert_dict)
    return {"status": "success", "certifications": certs}

@app.delete("/api/admin/certifications/{cert_id}")
def delete_certification(cert_id: str):
    certs = db_delete_certification(cert_id)
    return {"status": "deleted", "certifications": certs}


