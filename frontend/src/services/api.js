const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE = `${BACKEND_URL}/api`;

export const DEFAULT_PROFILE = {
  name: "Roshan Ganesh I",
  title: "App Developer & Full-Stack Engineer",
  location: "Karaparamba, Kozhikode 673010, Kerala, India",
  phone: "+91 83308 86626",
  email: "roshanganesh30@gmail.com",
  linkedin: "https://linkedin.com/in/roshan-ganesh-i",
  github: "https://github.com/roshanganesh2304",
  avatar_url: "/images/roshan-profile.png",
  summary: "Full-stack developer and Computer Engineering graduate skilled in Python, Django, React, and Flutter, with experience building cross-platform apps and AI-powered solutions.",
  stats: [
    { label: "Years Experience", value: "1+" },
    { label: "Projects Built", value: "6+" },
    { label: "Core Technologies", value: "16+" },
    { label: "Certifications", value: "2" }
  ]
};

export const DEFAULT_EXPERIENCE = [
  {
    id: "limenzy",
    role: "APP DEVELOPER",
    company: "LIMENZY TECHNOLOGIES",
    period: "12/2024 – Present",
    location: "Kozhikode, India",
    is_current: true,
    description: "Designing and building high-performance cross-platform mobile applications and APIs.",
    highlights: [
      "Developed cross-platform mobile applications using Flutter, implementing responsive UI/UX designs and maintaining clean, scalable code architecture.",
      "Integrated RESTful APIs for real-time data handling, including JSON parsing, asynchronous operations, and efficient error management.",
      "Implemented Firebase services such as Authentication, Cloud Firestore/Realtime Database, and Storage for secure user management and cloud-based data handling."
    ],
    technologies: ["Flutter", "Dart", "Firebase", "RESTful APIs", "GetX", "Provider", "BLoC", "Riverpod"]
  }
];

export const DEFAULT_PROJECTS = [
  {
    id: "video-transcript-chatbot",
    title: "Multilingual Video AI Chatbot",
    category: "AI & Python",
    summary: "RAG AI Video Transcript Assistant (Website)",
    description: "A full-stack web application built with Python FastAPI, Qwen 2.5 LLM, Ollama, RAG (Retrieval-Augmented Generation) Architecture, and SRT translation parser that enables real-time AI conversation with video content, timestamp analysis, and automatic subtitle translation.",
    image_url: "/images/video-transcript-chatbot.jpg",
    technologies: ["Python", "FastAPI", "Qwen 2.5 AI", "Ollama", "RAG Engine", "SRT Parser", "JavaScript"],
    featured: true,
    live_url: "https://github.com/roshanganesh2304",
    icon: "Video",
    accent_color: "#8b5cf6"
  },
  {
    id: "bookmymandap",
    title: "BOOKMYMANDAP",
    category: "Mobile App",
    summary: "Auditorium & Event Venue Booking Platform",
    description: "A streamlined booking platform for reserving auditoriums and event venues with real-time availability, schedule management, and seamless booking workflow.",
    image_url: "/images/bookmymandap.png",
    technologies: ["Flutter", "Dart", "Python", "Django REST Framework", "MySQL"],
    featured: true,
    live_url: "https://github.com/roshanganesh2304/bookmymandap",
    icon: "CalendarCheck",
    accent_color: "#8b5cf6"
  },
  {
    id: "ones-and-2s",
    title: "ONES AND 2S",
    category: "Mobile App",
    summary: "Helicopter Serial & Slot Marketplace",
    description: "Premier transparent marketplace for trading Hill HX50 and HC50 helicopter serial numbers and build slots with verified seller profiles and secure tracking.",
    image_url: "/images/ones-and-2s.png",
    technologies: ["Flutter", "Dart", "Python", "Django", "REST API"],
    featured: true,
    live_url: "https://github.com/roshanganesh2304",
    icon: "Plane",
    accent_color: "#f97316"
  },
  {
    id: "lend-it-ca",
    title: "LEND-IT.CA",
    category: "Mobile App",
    summary: "Peer-to-Peer Rental Marketplace (Canada)",
    description: "Canada's premier peer-to-peer marketplace for renting everyday items like tools, electronics, and equipment from trusted locals and businesses nearby.",
    image_url: "/images/lend-it.png",
    technologies: ["Flutter", "Dart", "Node.js", "Python", "Firebase"],
    featured: true,
    live_url: "https://github.com/roshanganesh2304",
    icon: "Repeat",
    accent_color: "#10b981"
  },
  {
    id: "sergeant-calculator",
    title: "SERGEANT CALCULATOR",
    category: "Mobile App",
    summary: "Concrete Cylinder & Volume Calculator",
    description: "Cross-platform engineering mobile application for calculating concrete cylinder volume, diameter, depth metrics, and material requirements with high precision.",
    image_url: "/images/sergeant-calculator.png",
    technologies: ["Flutter", "Dart", "Clean Architecture", "REST API", "State Management"],
    featured: true,
    live_url: "https://play.google.com/store/apps/details?id=com.sergeant.calculator",
    icon: "Calculator",
    accent_color: "#f97316"
  },
  {
    id: "eduwizz-prometric",
    title: "EDUWIZZ PROMETRIC",
    category: "Mobile App",
    summary: "Medical & Healthcare Exam Prep Platform",
    description: "Comprehensive e-learning and exam preparation app for pharmacists and healthcare professionals featuring video subscriptions, expert educators, and live leaderboard tracking.",
    image_url: "/images/eduwizz-prometric.png",
    technologies: ["Flutter", "Dart", "Firebase", "RESTful APIs", "State Management"],
    featured: true,
    live_url: "https://play.google.com/store/apps/details?id=com.eduwizzonline.prometric",
    icon: "GraduationCap",
    accent_color: "#a855f7"
  },
  {
    id: "mental-health-chatbot",
    title: "Student Mental Health Chatbot",
    category: "AI & Python",
    summary: "Emotion-Recognizing AI Assistant (Website)",
    description: "An AI-driven full-stack chatbot built with Python and SQL that leverages emotion recognition algorithms to support students facing academic stress and mental health challenges.",
    image_url: "/images/mental-health-chatbot.jpg",
    technologies: ["Python", "AI / Emotion Recognition", "SQL", "Flask/Django", "React"],
    featured: true,
    live_url: "https://github.com/roshanganesh2304",
    icon: "BrainCircuit",
    accent_color: "#3b82f6"
  },
  {
    id: "django-automobile-ecommerce",
    title: "Automobile Gadgets Ecommerce",
    category: "Full-Stack Web",
    summary: "All-in-one Vehicle Spares & Service Hub",
    description: "An all-in-one Django-based platform for purchasing vehicles spares, accessing industry news, and scheduling service centre maintenance seamlessly.",
    image_url: "/images/automobile-ecommerce.jpg",
    technologies: ["Python", "Django", "Bootstrap", "SQLite3", "JavaScript"],
    featured: false,
    live_url: "https://github.com/roshanganesh2304",
    icon: "Car",
    accent_color: "#06b6d4"
  }
];

export const DEFAULT_SKILLS = {
  technical: [
    { name: "Flutter", level: 92, category: "Mobile & Cross-Platform", icon_url: "/images/icons/flutter.svg" },
    { name: "Dart", level: 90, category: "Mobile & Cross-Platform", icon_url: "/images/icons/dart.svg" },
    { name: "Riverpod", level: 88, category: "State Management", icon_url: "/images/icons/riverpod.svg" },
    { name: "BLoC", level: 90, category: "State Management", icon_url: "/images/icons/bloc.svg" },
    { name: "Xcode", level: 85, category: "Mobile & Tools", icon_url: "/images/icons/xcode.svg" },
    { name: "Clean Architecture", level: 90, category: "Architecture & Patterns", icon_url: "/images/icons/clean-architecture.svg" },
    { name: "Firebase", level: 88, category: "Cloud & DB", icon_url: "/images/icons/firebase.svg" },
    { name: "REST APIs", level: 92, category: "Backend & Integration", icon_url: "/images/icons/rest-api.svg" },
    { name: "Play Store", level: 88, category: "Deployment & Publishing", icon_url: "/images/icons/play-store.svg" },
    { name: "App Store", level: 88, category: "Deployment & Publishing", icon_url: "/images/icons/app-store.png" },
    { name: "Git", level: 92, category: "Tools & Version Control", icon_url: "/images/icons/git.svg" },
    { name: "Node.js", level: 80, category: "Backend & Integration", icon_url: "/images/icons/nodejs.svg" },
    { name: "React", level: 88, category: "Frontend Web", icon_url: "/images/icons/react.svg" },
    { name: "MongoDB", level: 82, category: "Cloud & DB", icon_url: "/images/icons/mongodb.svg" },
    { name: "Google Maps", level: 88, category: "APIs & Services", icon_url: "/images/icons/google-maps.svg" },
    { name: "Google Cloud", level: 80, category: "Cloud & Services", icon_url: "/images/icons/google-cloud.svg" },
    { name: "Product Design", level: 85, category: "UI/UX & Design", icon_url: "/images/icons/product-design.svg" },
    { name: "Payment Integration", level: 88, category: "Services & APIs", icon_url: "/images/icons/payment-integration.svg" },
    { name: "Postman", level: 90, category: "Tools & Testing", icon_url: "/images/icons/postman.svg" },
    { name: "System Design", level: 80, category: "Architecture & Patterns", icon_url: "/images/icons/system-design.svg" },
    { name: "Python", level: 94, category: "Backend & AI", icon_url: "/images/icons/python.svg" },
    { name: "Django / DRF", level: 90, category: "Backend & AI", icon_url: "/images/icons/django.svg" },
    { name: "FastAPI", level: 88, category: "Backend & AI", icon_url: "/images/icons/fastapi.svg" },
    { name: "JavaScript", level: 90, category: "Frontend Web", icon_url: "/images/icons/javascript.svg" },
    { name: "HTML5", level: 95, category: "Frontend Web", icon_url: "/images/icons/html5.svg" },
    { name: "CSS3", level: 92, category: "Frontend Web", icon_url: "/images/icons/css3.svg" },
    { name: "Bootstrap", level: 85, category: "Frontend Web", icon_url: "/images/icons/bootstrap.svg" },
    { name: "MySQL", level: 86, category: "Cloud & DB", icon_url: "/images/icons/mysql.svg" },
    { name: "SQLite", level: 85, category: "Cloud & DB", icon_url: "/images/icons/sqlite.svg" },
    { name: "C++", level: 78, category: "Core & Systems", icon_url: "/images/icons/cplusplus.svg" },
    { name: "C", level: 75, category: "Core & Systems", icon_url: "/images/icons/c.svg" },
    { name: "MS Office", level: 85, category: "Tools & Productivity", icon_url: "/images/icons/ms-office.svg" }
  ],
  soft: [
    "Teamwork and Collaboration",
    "Critical Thinking",
    "Problem Solving",
    "Flexibility",
    "Adaptability"
  ]
};

export const DEFAULT_EDUCATION = {
  education: [
    {
      id: "bca",
      degree: "BACHELOR OF COMPUTER APPLICATIONS (BCA)",
      institution: "INDIRA GANDHI NATIONAL OPEN UNIVERSITY (IGNOU)",
      period: "2025 – Present",
      location: "India",
      status: "In Progress",
      details: "Focusing on advanced computer science principles, software engineering, databases, and application development."
    },
    {
      id: "diploma",
      degree: "DIPLOMA IN COMPUTER ENGINEERING",
      institution: "HHM JDT Islam Polytechnic College",
      period: "2020 – 2023",
      location: "Kozhikode, Kerala",
      status: "Completed",
      details: "Comprehensive groundwork in computer fundamentals, programming, system architecture, software engineering, and networking."
    }
  ],
  certifications: [
    {
      id: "nactet-python",
      title: "Python-Web Development Certification",
      organization: "Nactet at Luminar Technolab",
      location: "Calicut, Kerala",
      description: "Professional training in Python, Django web framework, database integration, RESTful API design, and full-stack web development."
    },
    {
      id: "vitez-python",
      title: "Python Basics Training",
      organization: "VITEZ Lab",
      location: "Calicut, Kerala",
      description: "Foundation training covering core Python programming, data structures, object-oriented concepts, and algorithmic problem-solving."
    }
  ]
};

// Helper function to fetch with a timeout (allows time for sleeping free-tier backends to spin up while checking content-type)
const fetchWithTimeout = async (url, options = {}, timeoutMs = 12000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error(`Endpoint returned HTML instead of JSON. (Check VITE_API_BASE_URL)`);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

export const fetchProfile = async () => {
  try {
    const data = await fetchWithTimeout(`${API_BASE}/profile`);
    return data && data.name ? data : DEFAULT_PROFILE;
  } catch (err) {
    console.warn('API Error (Profile), falling back to cached profile:', err);
    return DEFAULT_PROFILE;
  }
};

export const fetchExperience = async () => {
  try {
    const data = await fetchWithTimeout(`${API_BASE}/experience`);
    return Array.isArray(data) && data.length > 0 ? data : DEFAULT_EXPERIENCE;
  } catch (err) {
    console.warn('API Error (Experience), using cached fallback:', err);
    return DEFAULT_EXPERIENCE;
  }
};

export const fetchProjects = async (category = 'All') => {
  try {
    const url = category && category !== 'All' 
      ? `${API_BASE}/projects?category=${encodeURIComponent(category)}`
      : `${API_BASE}/projects`;
    const data = await fetchWithTimeout(url);
    return Array.isArray(data) && data.length > 0 ? data : DEFAULT_PROJECTS;
  } catch (err) {
    console.warn('API Error (Projects), using cached fallback:', err);
    return DEFAULT_PROJECTS;
  }
};

export const fetchSkills = async () => {
  try {
    const data = await fetchWithTimeout(`${API_BASE}/skills`);
    return (data && (data.technical?.length || data.soft?.length)) ? data : DEFAULT_SKILLS;
  } catch (err) {
    console.warn('API Error (Skills), using default skills fallback:', err);
    return DEFAULT_SKILLS;
  }
};

export const fetchEducation = async () => {
  try {
    const data = await fetchWithTimeout(`${API_BASE}/education`);
    return (data && (data.education?.length || data.certifications?.length)) ? data : DEFAULT_EDUCATION;
  } catch (err) {
    console.warn('API Error (Education), using cached fallback:', err);
    return DEFAULT_EDUCATION;
  }
};

export const submitContactForm = async (formData) => {
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to send message');
    return data;
  } catch (err) {
    console.error('Submit contact form error:', err);
    throw err;
  }
};

// --- ADMIN API SERVICES ---

export const adminLogin = async (credentials) => {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Invalid login credentials');
  return data;
};

export const adminForgotPassword = async (req) => {
  const res = await fetch(`${API_BASE}/admin/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Password recovery failed');
  return data;
};

export const updateAdminProfile = async (profileData) => {
  const res = await fetch(`${API_BASE}/admin/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return await res.json();
};

export const saveAdminProject = async (projectData) => {
  const res = await fetch(`${API_BASE}/admin/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (!res.ok) throw new Error('Failed to save project');
  return await res.json();
};

export const deleteAdminProject = async (projectId) => {
  const res = await fetch(`${API_BASE}/admin/projects/${encodeURIComponent(projectId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete project');
  return await res.json();
};

export const saveAdminExperience = async (expData) => {
  const res = await fetch(`${API_BASE}/admin/experience`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expData),
  });
  if (!res.ok) throw new Error('Failed to save experience');
  return await res.json();
};

export const deleteAdminExperience = async (expId) => {
  const res = await fetch(`${API_BASE}/admin/experience/${encodeURIComponent(expId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete experience');
  return await res.json();
};

export const saveAdminSkill = async (skillData) => {
  const res = await fetch(`${API_BASE}/admin/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skillData),
  });
  if (!res.ok) throw new Error('Failed to save skill');
  return await res.json();
};

export const deleteAdminSkill = async (skillName) => {
  const res = await fetch(`${API_BASE}/admin/skills/${encodeURIComponent(skillName)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete skill');
  return await res.json();
};

export const reorderAdminSkills = async (orderedNames) => {
  const res = await fetch(`${API_BASE}/admin/skills/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ordered_names: orderedNames }),
  });
  if (!res.ok) throw new Error('Failed to reorder skills');
  return await res.json();
};

export const resetAdminSkills = async () => {
  const res = await fetch(`${API_BASE}/admin/skills/reset`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reset skills');
  return await res.json();
};

export const saveAdminSoftSkill = async (name) => {
  const res = await fetch(`${API_BASE}/admin/soft-skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to save soft skill');
  return await res.json();
};

export const deleteAdminSoftSkill = async (name) => {
  const res = await fetch(`${API_BASE}/admin/soft-skills/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete soft skill');
  return await res.json();
};

export const uploadAdminFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to upload file');
  return data;
};

export const fetchContactMessages = async () => {
  const res = await fetch(`${API_BASE}/contact/messages`);
  if (!res.ok) throw new Error('Failed to fetch contact messages');
  return await res.json();
};

export const deleteContactMessage = async (msgId) => {
  const res = await fetch(`${API_BASE}/contact/messages/${encodeURIComponent(msgId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete message');
  return await res.json();
};

export const fetchCertifications = async () => {
  const res = await fetch(`${API_BASE}/certifications`);
  if (!res.ok) return [];
  return await res.json();
};

export const saveAdminCertification = async (certData) => {
  const res = await fetch(`${API_BASE}/admin/certifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(certData),
  });
  if (!res.ok) throw new Error('Failed to save certification');
  return await res.json();
};

export const deleteAdminCertification = async (certId) => {
  const res = await fetch(`${API_BASE}/admin/certifications/${encodeURIComponent(certId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete certification');
  return await res.json();
};

