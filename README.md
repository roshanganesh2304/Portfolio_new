# Roshan Ganesh I - Personal Portfolio Website

A modern, responsive personal portfolio website built with React, FastAPI, SQLite3, and an interactive Admin Panel.

## Features
- **Public Portfolio**: Profile overview, project showcase, experience timeline, technical skills matrix with SVG icons, certifications, and interactive contact form.
- **Admin Panel (`/admin`)**: Single-screen password-authenticated admin dashboard for updating profile details, managing projects, editing experience, drag-and-drop skill reordering/editing/resetting, and reviewing contact messages.
- **SQLite3 Database**: Persistent SQLite database storing profile, projects, experience, skills, and contact submissions.
- **Image & Icon Uploads**: Device image picker for project preview thumbnails and skill icons.
- **Email Integration**: Direct email reply link generation for contact form submissions.

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Vanilla CSS
- **Backend**: Python, FastAPI, Uvicorn, SQLite3, `python-multipart`

---

## Admin Panel Access (`/admin`)

> [!NOTE]
> For production security, the `/admin` portal route is **commented out by default** in `frontend/src/App.jsx`.

### How to Re-Enable the `/admin` Route:
To access the Admin Panel at `/admin` or `/#/admin` in local development or production:

1. Open `frontend/src/App.jsx`.
2. Locate the `isAdmin` state declaration and uncomment the route listener:
```javascript
// Change from:
const [isAdmin, setIsAdmin] = useState(false);

// To:
const [isAdmin, setIsAdmin] = useState(
  window.location.pathname === '/admin' || window.location.hash === '#/admin' || window.location.hash === '#admin'
);
```
3. In the JSX render block of `App.jsx`, update the conditional renderer:
```javascript
// Change from:
{false && isAdmin ? (

// To:
{isAdmin ? (
```
4. Save `App.jsx` and navigate to `http://localhost:5173/admin` or `https://roshan-ganesh.vercel.app/#admin`.

### Default Admin Credentials:
- **Username**: `Roshan`
- **Password**: `Roshan @2304`
- **Recovery Email**: `roshanganesh30@gmail.com`

---

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

### 3. Production Build
```bash
cd frontend
npm run build
```
