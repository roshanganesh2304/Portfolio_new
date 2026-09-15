import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Briefcase,
  FolderPlus,
  Wrench,
  Mail,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  Lock,
  KeyRound,
  LogOut,
  HelpCircle,
  Eye,
  EyeOff,
  Upload,
  Reply
} from 'lucide-react';
import {
  fetchProfile,
  fetchExperience,
  fetchProjects,
  fetchSkills,
  updateAdminProfile,
  saveAdminProject,
  deleteAdminProject,
  saveAdminExperience,
  deleteAdminExperience,
  saveAdminSkill,
  deleteAdminSkill,
  fetchContactMessages,
  deleteContactMessage,
  adminLogin,
  adminForgotPassword,
  uploadAdminFile
} from '../services/api';

export default function AdminPanel({ onBackToSite }) {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('admin_authenticated') === 'true'
  );
  const [loginUsername, setLoginUsername] = useState('Roshan');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Forgot password states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState(null);
  const [recoverySubmitting, setRecoverySubmitting] = useState(false);

  // Dashboard states
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    title: '',
    location: '',
    phone: '',
    email: '',
    github: '',
    linkedin: '',
    summary: ''
  });

  const [projectsList, setProjectsList] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    category: 'Mobile App',
    summary: '',
    description: '',
    image_url: '/images/bookmymandap.png',
    technologies: '',
    live_url: '',
    accent_color: '#ef4444'
  });

  const [experienceList, setExperienceList] = useState([]);
  const [expForm, setExpForm] = useState({
    id: '',
    role: '',
    company: '',
    period: '',
    location: '',
    description: '',
    highlights: '',
    technologies: ''
  });

  const [skillsData, setSkillsData] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: 85, category: 'Technical', icon_url: '' });
  const [messages, setMessages] = useState([]);

  // File upload loading states
  const [uploadingProjectImg, setUploadingProjectImg] = useState(false);
  const [uploadingSkillIcon, setUploadingSkillIcon] = useState(false);

  // File upload handlers
  const handleProjectFileSelect = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploadingProjectImg(true);
    try {
      const res = await uploadAdminFile(file);
      if (res.url) {
        setProjectForm(prev => ({ ...prev, image_url: res.url }));
        showToast('Project image uploaded from device!');
      }
    } catch (err) {
      showToast('Image upload failed: ' + err.message);
    } finally {
      setUploadingProjectImg(false);
    }
  };

  const handleSkillIconSelect = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploadingSkillIcon(true);
    try {
      const res = await uploadAdminFile(file);
      if (res.url) {
        setNewSkill(prev => ({ ...prev, icon_url: res.url }));
        showToast('Skill icon uploaded successfully!');
      }
    } catch (err) {
      showToast('Icon upload failed: ' + err.message);
    } finally {
      setUploadingSkillIcon(false);
    }
  };

  // Toast notifier
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSubmitting(true);
    try {
      const res = await adminLogin({ username: loginUsername, password: loginPassword });
      if (res.success) {
        sessionStorage.setItem('admin_authenticated', 'true');
        setIsAuthenticated(true);
        showToast('Welcome back, Roshan!');
        loadAllData();
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid username or password.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setLoginPassword('');
    showToast('Logged out of Admin Panel.');
  };

  // Forgot Password handler
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setRecoveryStatus(null);
    setRecoverySubmitting(true);
    try {
      const res = await adminForgotPassword({
        email: recoveryEmail,
        new_password: newPasswordInput || undefined
      });
      setRecoveryStatus({ type: 'success', message: res.message });
      if (newPasswordInput) {
        setLoginPassword(newPasswordInput);
      }
    } catch (err) {
      setRecoveryStatus({ type: 'error', message: err.message });
    } finally {
      setRecoverySubmitting(false);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prof, exp, proj, skill, msgs] = await Promise.all([
        fetchProfile(),
        fetchExperience(),
        fetchProjects(),
        fetchSkills(),
        fetchContactMessages().catch(() => ({ total: 0, messages: [] }))
      ]);

      if (prof) setProfileForm(prof);
      if (exp) setExperienceList(exp);
      if (proj) setProjectsList(proj);
      if (skill && skill.technical) setSkillsData(skill.technical);
      if (msgs && msgs.messages) setMessages(msgs.messages);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // Handlers
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAdminProfile(profileForm);
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...projectForm,
        technologies: typeof projectForm.technologies === 'string'
          ? projectForm.technologies.split(',').map(s => s.trim()).filter(Boolean)
          : projectForm.technologies
      };
      const res = await saveAdminProject(payload);
      if (res.projects) setProjectsList(res.projects);
      setEditingProject(null);
      setProjectForm({
        id: '',
        title: '',
        category: 'Mobile App',
        summary: '',
        description: '',
        image_url: '/images/bookmymandap.png',
        technologies: '',
        live_url: '',
        accent_color: '#ef4444'
      });
      showToast('Project saved successfully!');
    } catch (err) {
      showToast('Failed to save project: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      const res = await deleteAdminProject(id);
      if (res.project) {
        setProjectsList(prev => prev.filter(p => p.id !== id));
        showToast('Project deleted');
      }
    } catch (err) {
      showToast('Delete failed: ' + err.message);
    }
  };

  const handleSaveExperience = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...expForm,
        highlights: typeof expForm.highlights === 'string'
          ? expForm.highlights.split('\n').filter(Boolean)
          : expForm.highlights,
        technologies: typeof expForm.technologies === 'string'
          ? expForm.technologies.split(',').map(s => s.trim()).filter(Boolean)
          : expForm.technologies
      };
      const res = await saveAdminExperience(payload);
      if (res.experience) setExperienceList(res.experience);
      setEditingExp(null);
      setExpForm({ id: '', role: '', company: '', period: '', location: '', description: '', highlights: '', technologies: '' });
      showToast('Experience updated successfully!');
    } catch (err) {
      showToast('Failed to save experience: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm('Delete this role?')) return;
    try {
      await deleteAdminExperience(id);
      setExperienceList(prev => prev.filter(e => e.id !== id));
      showToast('Experience deleted');
    } catch (err) {
      showToast('Delete failed: ' + err.message);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name) return;
    try {
      const res = await saveAdminSkill(newSkill);
      if (res.skills && res.skills.technical) setSkillsData(res.skills.technical);
      setNewSkill({ name: '', level: 85, category: 'Technical' });
      showToast('Skill added');
    } catch (err) {
      showToast('Add skill failed: ' + err.message);
    }
  };

  const handleDeleteSkill = async (name) => {
    try {
      const res = await deleteAdminSkill(name);
      if (res.skills && res.skills.technical) setSkillsData(res.skills.technical);
      showToast('Skill deleted');
    } catch (err) {
      showToast('Delete skill failed: ' + err.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteContactMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      showToast('Message deleted');
    } catch (err) {
      showToast('Delete message failed: ' + err.message);
    }
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card"
          style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
              <Lock size={26} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>Admin Portal Login</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Enter administrator credentials to access the portfolio editor.
            </p>
          </div>

          {loginError && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: 500 }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.4rem' }}>Username</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Username (Roshan)"
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  style={inputStyle}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', marginBottom: '1rem' }}
            >
              <KeyRound size={18} /> {loginSubmitting ? 'Authenticating...' : 'Log In to Admin Panel'}
            </button>
          </form>

          <button
            onClick={onBackToSite}
            style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem' }}
          >
            <ArrowLeft size={16} /> Return to Live Portfolio
          </button>

          {/* Forgot Password Modal */}
          {showForgotPasswordModal && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(5, 5, 8, 0.88)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '2rem', borderRadius: '1.25rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>Password Recovery</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                  Enter admin registered email address to verify identity and recover password.
                </p>

                {recoveryStatus && (
                  <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: recoveryStatus.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${recoveryStatus.type === 'success' ? '#10b981' : '#ef4444'}`, color: recoveryStatus.type === 'success' ? '#34d399' : '#f87171', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: 500 }}>
                    {recoveryStatus.message}
                  </div>
                )}

                <form onSubmit={handleForgotPasswordSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.3rem' }}>Admin Email Address</label>
                    <input
                      type="email"
                      placeholder="roshanganesh30@gmail.com"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.3rem' }}>New Password (Optional)</label>
                    <input
                      type="text"
                      placeholder="Enter new password or leave blank"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" disabled={recoverySubmitting} className="btn btn-primary" style={{ flex: 1 }}>
                      {recoverySubmitting ? 'Verifying...' : 'Verify & Recover'}
                    </button>
                    <button type="button" onClick={() => setShowForgotPasswordModal(false)} className="btn btn-secondary">
                      Close
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '2rem 1rem' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 99999,
            background: 'var(--accent-gradient)',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Single Screen Header */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem 2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <User size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                Portfolio Admin Panel
              </h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
                Logged in as Roshan • System Live
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={loadAllData}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '9999px',
                border: 'var(--glass-border)',
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <RefreshCw size={15} /> Refresh Data
            </button>

            <button
              onClick={onBackToSite}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '9999px',
                background: 'var(--accent-gradient)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                boxShadow: '0 8px 20px -4px rgba(239, 68, 68, 0.4)',
              }}
            >
              <ArrowLeft size={16} /> Live Site
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '9999px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
          }}
        >
          {[
            { id: 'profile', label: 'Profile & Info', icon: User },
            { id: 'projects', label: `Projects (${projectsList.length})`, icon: FolderPlus },
            { id: 'experience', label: `Experience (${experienceList.length})`, icon: Briefcase },
            { id: 'skills', label: `Skills (${skillsData.length})`, icon: Wrench },
            { id: 'messages', label: `Messages (${messages.length})`, icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '9999px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--accent-primary)' : 'var(--glass-border)',
                  background: isActive ? 'var(--accent-gradient)' : 'var(--bg-card)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Loading dashboard state...
          </div>
        ) : (
          <div>
            
            {/* 1. PROFILE TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={20} color="#ef4444" /> Personal Profile Details
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Job Title / Designation</label>
                    <input
                      type="text"
                      value={profileForm.title || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Location</label>
                    <input
                      type="text"
                      value={profileForm.location || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>GitHub Profile URL</label>
                    <input
                      type="text"
                      value={profileForm.github || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={profileForm.linkedin || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Bio / Summary</label>
                  <textarea
                    rows={4}
                    value={profileForm.summary || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary">
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            )}

            {/* 2. PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div>
                {/* Project Form Container */}
                <form onSubmit={handleSaveProject} className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} color="#ef4444" /> {projectForm.id ? 'Edit Project' : 'Add New Project'}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Project Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Ones And 2s"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        style={inputStyle}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Category</label>
                      <select
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="Mobile App">Mobile App</option>
                        <option value="Full-Stack Web">Full-Stack Web</option>
                        <option value="AI & Python">AI & Python</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Short Subtitle</label>
                      <input
                        type="text"
                        placeholder="e.g. Helicopter Bidding Platform"
                        value={projectForm.summary}
                        onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Project Image (URL or Upload from Device)</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="/images/ones-and-2s.png"
                          value={projectForm.image_url}
                          onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                          style={{ ...inputStyle, flex: 1 }}
                          required
                        />
                        <label
                          htmlFor="project-image-file-input"
                          style={{
                            padding: '0.65rem 0.9rem',
                            borderRadius: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Upload size={14} />
                          {uploadingProjectImg ? 'Uploading...' : 'Choose Device Image'}
                        </label>
                        <input
                          id="project-image-file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleProjectFileSelect}
                          style={{ display: 'none' }}
                        />
                      </div>
                      {projectForm.image_url && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <img
                            src={projectForm.image_url}
                            alt="Project Preview"
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Live Image Preview</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Tech Stack (Comma Separated)</label>
                      <input
                        type="text"
                        placeholder="Flutter, Dart, Python, Django"
                        value={Array.isArray(projectForm.technologies) ? projectForm.technologies.join(', ') : projectForm.technologies}
                        onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Accent Color (Hex)</label>
                      <input
                        type="text"
                        placeholder="#ef4444"
                        value={projectForm.accent_color}
                        onChange={(e) => setProjectForm({ ...projectForm, accent_color: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Description</label>
                    <textarea
                      rows={3}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" disabled={saving} className="btn btn-primary">
                      <Save size={16} /> {projectForm.id ? 'Update Project' : 'Add Project'}
                    </button>
                    {projectForm.id && (
                      <button
                        type="button"
                        onClick={() => {
                          setProjectForm({ id: '', title: '', category: 'Mobile App', summary: '', description: '', image_url: '/images/bookmymandap.png', technologies: '', live_url: '', accent_color: '#ef4444' });
                          setEditingProject(null);
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>

                {/* Projects List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {projectsList.map((p) => (
                    <div
                      key={p.id}
                      className="glass-card"
                      style={{
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={p.image_url}
                          alt={p.title}
                          style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{p.title}</div>
                          <div style={{ fontSize: '0.82rem', color: p.accent_color || 'var(--accent-primary)', fontWeight: 600 }}>
                            {p.category} — {p.summary}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            setProjectForm(p);
                            setEditingProject(p.id);
                            window.scrollTo({ top: 180, behavior: 'smooth' });
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. EXPERIENCE TAB */}
            {activeTab === 'experience' && (
              <div>
                <form onSubmit={handleSaveExperience} className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} color="#ef4444" /> {expForm.id ? 'Edit Experience' : 'Add Experience Role'}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Role Title</label>
                      <input
                        type="text"
                        placeholder="e.g. APP DEVELOPER"
                        value={expForm.role}
                        onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                        style={inputStyle}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Company Name</label>
                      <input
                        type="text"
                        placeholder="e.g. LIMENZY TECHNOLOGIES"
                        value={expForm.company}
                        onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                        style={inputStyle}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Period / Date Range</label>
                      <input
                        type="text"
                        placeholder="12/2024 – Present"
                        value={expForm.period}
                        onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Location</label>
                      <input
                        type="text"
                        placeholder="Kozhikode, India"
                        value={expForm.location}
                        onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>Key Highlights (One per line)</label>
                    <textarea
                      rows={3}
                      value={Array.isArray(expForm.highlights) ? expForm.highlights.join('\n') : expForm.highlights}
                      onChange={(e) => setExpForm({ ...expForm, highlights: e.target.value })}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" disabled={saving} className="btn btn-primary">
                    <Save size={16} /> Save Experience
                  </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {experienceList.map((e) => (
                    <div key={e.id} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{e.role} @ {e.company}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{e.period} • {e.location}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setExpForm(e)} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>Edit</button>
                        <button onClick={() => handleDeleteExperience(e.id)} style={{ padding: '0.45rem 0.85rem', borderRadius: '9999px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SKILLS TAB */}
            {activeTab === 'skills' && (
              <div>
                <form onSubmit={handleAddSkill} className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 600 }}>Skill Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Flutter, FastAPI"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div style={{ width: '120px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 600 }}>Proficiency (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 85 })}
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 600 }}>
                      Skill Icon (Optional Upload)
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Icon URL or leave blank"
                        value={newSkill.icon_url || ''}
                        onChange={(e) => setNewSkill({ ...newSkill, icon_url: e.target.value })}
                        style={{ ...inputStyle, flex: 1 }}
                      />
                      <label
                        htmlFor="skill-icon-file-input"
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '0.75rem',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Upload size={13} />
                        {uploadingSkillIcon ? 'Uploading...' : 'Icon File'}
                      </label>
                      <input
                        id="skill-icon-file-input"
                        type="file"
                        accept="image/*,.svg"
                        onChange={handleSkillIconSelect}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
                    <Plus size={16} /> Add Skill
                  </button>
                </form>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                  {skillsData.map((s) => (
                    <div key={s.name} className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {s.icon_url && <img src={s.icon_url} width="18" height="18" alt={s.name} />}
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700 }}>{s.level}%</span>
                        <button onClick={() => handleDeleteSkill(s.name)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. MESSAGES INBOX TAB */}
            {activeTab === 'messages' && (
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={20} color="#ef4444" /> Received Contact Form Submissions ({messages.length})
                </h3>

                {messages.length === 0 ? (
                  <div style={{ textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>
                    No contact submissions received yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          padding: '1.25rem',
                          borderRadius: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: 'var(--glass-border)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '1rem' }}>{m.name} ({m.email})</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {new Date(m.received_at * 1000).toLocaleString()}
                            </span>
                            <a
                              href={`mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent('Re: ' + (m.subject || 'Your Message'))}&body=${encodeURIComponent(`Hi ${m.name},\n\nThank you for reaching out via my portfolio!\n\n> ${m.message ? m.message.replace(/\n/g, '\n> ') : ''}\n\nBest regards,\nRoshan Ganesh I`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: '0.35rem 0.8rem',
                                borderRadius: '9999px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                color: '#34d399',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <Reply size={13} /> Reply via Email
                            </a>
                            <button
                              onClick={() => handleDeleteMessage(m.id)}
                              style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: '9999px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#ef4444',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>
                          Subject: {m.subject}
                        </div>
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                          {m.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.65rem 1rem',
  borderRadius: '0.75rem',
  background: 'rgba(255, 255, 255, 0.04)',
  border: 'var(--glass-border)',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'inherit',
};
