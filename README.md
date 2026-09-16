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

## Admin Panel Access (`/admin`) & 404 Route Configuration

> [!NOTE]
> For production security, accessing `/admin` displays a **404 Page Not Found** screen by default, and the `/admin` portal component is commented out in `frontend/src/App.jsx`.

### Default Security Behavior:
- Navigating to `/admin`, `/#/admin`, or `/#admin` displays a styled **404 Page Not Found** screen.

### How to Re-Enable the Admin Panel (`/admin`):
To enable the Admin Panel and switch off the 404 screen in `frontend/src/App.jsx`:

1. Open `frontend/src/App.jsx`.
2. Disable the 404 detector and activate the `isAdmin` route detector:
```javascript
// Change from:
const [is404, setIs404] = useState(
  window.location.pathname.toLowerCase().startsWith('/admin') ||
  window.location.hash.toLowerCase().includes('admin')
);
const [isAdmin, setIsAdmin] = useState(false);

// To:
const [is404, setIs404] = useState(false);
const [isAdmin, setIsAdmin] = useState(
  window.location.pathname.toLowerCase().startsWith('/admin') ||
  window.location.hash.toLowerCase().includes('admin')
);
```

3. In `handleRouteChange` inside `App.jsx`, update the active route setter:
```javascript
// Change from:
setIs404(pathMatches || hashMatches);
// setIsAdmin(pathMatches || hashMatches);

// To:
setIs404(false);
setIsAdmin(pathMatches || hashMatches);
```

4. In the JSX return statement of `App.jsx`, update the conditional view:
```javascript
// Change from:
{is404 ? (
  /* 404 PAGE */
) : false && isAdmin ? (
  <AdminPanel onBackToSite={handleBackToSite} />
)

// To:
{isAdmin ? (
  <AdminPanel onBackToSite={handleBackToSite} />
)
```

5. Save `App.jsx` and navigate to `http://localhost:5173/admin` or `https://roshan-ganesh.vercel.app/#admin`.

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
