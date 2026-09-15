// API Service to communicate with Python FastAPI Backend

const API_BASE = '/api';

export const fetchProfile = async () => {
  try {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return await res.json();
  } catch (err) {
    console.warn('API Error (Profile), falling back to cached profile:', err);
    return {
      name: "Roshan Ganesh I",
      title: "App Developer & Full-Stack Engineer",
      location: "Karaparamba, Kozhikode 673010, Kerala",
      phone: "+91 83308 86626",
      email: "roshanganesh30@gmail.com",
      linkedin: "https://linkedin.com/in/roshan-ganesh-i",
      github: "https://github.com/roshanganesh2304",
      summary: "Full-stack developer and computer engineering graduate specializing in Python, Django, React, and Flutter. Proven experience in building cross-platform mobile apps and AI-driven web solutions.",
      stats: [
        { label: "Years Experience", value: "1+" },
        { label: "Projects Built", value: "6+" },
        { label: "Core Technologies", value: "16+" },
        { label: "Certifications", value: "2" }
      ]
    };
  }
};

export const fetchExperience = async () => {
  try {
    const res = await fetch(`${API_BASE}/experience`);
    if (!res.ok) throw new Error('Failed to fetch experience');
    return await res.json();
  } catch (err) {
    console.warn('API Error (Experience):', err);
    return [];
  }
};

export const fetchProjects = async (category = 'All') => {
  try {
    const url = category && category !== 'All' 
      ? `${API_BASE}/projects?category=${encodeURIComponent(category)}`
      : `${API_BASE}/projects`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return await res.json();
  } catch (err) {
    console.warn('API Error (Projects):', err);
    return [];
  }
};

export const fetchSkills = async () => {
  try {
    const res = await fetch(`${API_BASE}/skills`);
    if (!res.ok) throw new Error('Failed to fetch skills');
    return await res.json();
  } catch (err) {
    console.warn('API Error (Skills):', err);
    return { technical: [], soft: [] };
  }
};

export const fetchEducation = async () => {
  try {
    const res = await fetch(`${API_BASE}/education`);
    if (!res.ok) throw new Error('Failed to fetch education');
    return await res.json();
  } catch (err) {
    console.warn('API Error (Education):', err);
    return { education: [], certifications: [] };
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

