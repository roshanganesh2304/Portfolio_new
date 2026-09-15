# Roshan Ganesh I - Personal Portfolio Website

A modern, responsive personal portfolio website built with React, FastAPI, SQLite3, and an interactive Admin Panel.

## Features
- **Public Portfolio**: Profile overview, project showcase, experience timeline, skills, and interactive contact form.
- **Admin Panel**: Single-screen password-authenticated admin dashboard for updating profile details, managing projects, editing experience, and managing contact messages.
- **SQLite3 Database**: Persistent SQLite database storing profile, projects, experience, skills, and contact submissions.
- **Image & Icon Uploads**: Device image picker for project preview thumbnails and skill icons.
- **Email Integration**: Direct email reply link generation for contact form submissions.

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Vanilla CSS
- **Backend**: Python, FastAPI, Uvicorn, SQLite3, `python-multipart`

## Getting Started

### 1. Backend Setup
```bash
# Navigate to project root
cd portfolio

# Install Python dependencies (if needed)
pip install fastapi uvicorn python-multipart

# Start FastAPI server
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
