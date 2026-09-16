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

  const [isAdmin, setIsAdmin] = useState(
    window.location.pathname === '/admin' || window.location.hash === '#/admin' || window.location.hash === '#admin'
  );

  useEffect(() => {
    const handleRouteChange = () => {
      setIsAdmin(
        window.location.pathname === '/admin' || window.location.hash === '#/admin' || window.location.hash === '#admin'
      );
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
        {isAdmin ? (
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

