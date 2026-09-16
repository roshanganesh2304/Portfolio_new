import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import {
  fetchProfile,
  fetchExperience,
  fetchProjects,
  fetchSkills,
  fetchEducation,
} from './services/api';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState(null);
  const [education, setEducation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active 404 detector for /admin or #admin (Displays 404 page when accessed; see README.md for admin portal instructions)
  const [is404, setIs404] = useState(
    window.location.pathname.toLowerCase().startsWith('/admin') ||
    window.location.hash.toLowerCase().includes('admin')
  );

  /* Commented out Admin Section (See README.md to re-enable Admin Panel):
  const [isAdmin, setIsAdmin] = useState(
    window.location.pathname.toLowerCase().startsWith('/admin') ||
    window.location.hash.toLowerCase().includes('admin')
  );
  */
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      const pathMatches = window.location.pathname.toLowerCase().startsWith('/admin');
      const hashMatches = window.location.hash.toLowerCase().includes('admin');
      setIs404(pathMatches || hashMatches);
      // setIsAdmin(pathMatches || hashMatches); // Commented out admin trigger
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profData, expData, projData, skillData, eduData] = await Promise.all([
          fetchProfile(),
          fetchExperience(),
          fetchProjects(),
          fetchSkills(),
          fetchEducation(),
        ]);

        setProfile(profData);
        if (profData?.avatar_url) {
          const faviconLink = document.querySelector("link[rel*='icon']");
          if (faviconLink) {
            faviconLink.href = profData.avatar_url.includes('roshan-profile.png') 
              ? '/images/roshan-profile-round.png' 
              : profData.avatar_url;
            faviconLink.type = 'image/png';
          }
        }
        setExperience(expData);
        setProjects(projData);
        setSkills(skillData);
        setEducation(eduData);
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBackToSite = () => {
    window.history.pushState({}, '', '/');
    window.location.hash = '#home';
    setIs404(false);
    setIsAdmin(false);
  };

  return (
    <ThemeProvider>
      {/* Background Orbs */}
      <div className="bg-glow-container">
        <div className="glow-orb-1" />
        <div className="glow-orb-2" />
        <div className="glow-orb-3" />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {is404 ? (
          /* ACTIVE 404 NOT FOUND PAGE FOR /admin (See README.md to re-enable Admin Panel) */
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem',
              textAlign: 'center',
            }}
          >
            <div
              className="glass-card"
              style={{
                maxWidth: '480px',
                width: '100%',
                padding: '3rem 2rem',
                borderRadius: '1.5rem',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              }}
            >
              <div
                style={{
                  fontSize: '5.5rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  background: 'var(--accent-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.75rem',
                  fontFamily: 'monospace',
                }}
              >
                404
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Page Not Found</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                The requested URL <code style={{ color: 'var(--accent-primary)', background: 'rgba(239,68,68,0.12)', padding: '2px 8px', borderRadius: '4px' }}>/admin</code> could not be found or has been moved.
              </p>
              <button
                onClick={handleBackToSite}
                className="btn btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
              >
                Return to Portfolio Home
              </button>
            </div>
          </div>
        ) : false && isAdmin ? (
          /* COMMENTED OUT ADMIN PANEL ROUTE (See README.md to re-enable) */
          <AdminPanel onBackToSite={handleBackToSite} />
        ) : (
          <>
            <Navbar />
            {loading ? (
              <div
                style={{
                  minHeight: '80vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '3px solid rgba(239, 68, 68, 0.2)',
                    borderTopColor: 'var(--accent-primary)',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading Portfolio...</div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <main>
                <Hero profile={profile} />
                <About profile={profile} />
                <Experience experience={experience} />
                <Projects projects={projects} />
                <Skills skills={skills} />
                <Education educationData={education} />
                <Contact profile={profile} />
              </main>
            )}
            <Footer profile={profile} />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

