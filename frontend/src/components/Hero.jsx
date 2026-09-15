import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

export default function Hero({ profile }) {
  if (!profile) return null;

  return (
    <section id="home" style={{ paddingTop: '7.5rem', paddingBottom: '4.5rem', position: 'relative' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3.5rem', alignItems: 'center' }} className="hero-grid">
          
          {/* Left Text Column - Minimal & Clean */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Small Greeting */}
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', fontWeight: 500 }}>
              Hi, I'm
            </p>

            {/* Main Title Heading */}
            <h1
              style={{
                fontSize: 'clamp(2rem, 4.2vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '0.6rem',
                letterSpacing: '-0.02em',
              }}
            >
              <span className="text-gradient">{profile.name}</span>
            </h1>

            {/* Subheading Title */}
            <h2
              style={{
                fontSize: 'clamp(1.25rem, 2.4vw, 1.65rem)',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                marginBottom: '1.25rem',
                lineHeight: 1.35,
              }}
            >
              App Developer & Full-Stack Engineer
            </h2>

            {/* Bio Summary (Exact User Specified Paragraph) */}
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                maxWidth: '620px',
                marginBottom: '1.75rem',
              }}
            >
              Full-stack developer and Computer Engineering graduate skilled in Python, Django, React, and Flutter, with experience building cross-platform apps and AI-powered solutions.
            </p>

            {/* Tech Stack Pills List */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2.25rem' }}>
              {[
                { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
                { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
                { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
                { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
                { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
              ].map((tech) => (
                <div
                  key={tech.name}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 0.95rem',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                  }}
                >
                  <img src={tech.icon} width="15" height="15" alt={tech.name} style={{ opacity: 0.9 }} />
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>

            {/* Minimal Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <a href="#projects" className="btn btn-primary">
                Explore Projects <ArrowRight size={18} />
              </a>
              <a href="#contact" className="btn btn-secondary">
                Get In Touch
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                title="GitHub Profile"
                style={{ padding: '0.8rem' }}
              >
                <GithubIcon size={20} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                title="LinkedIn Profile"
                style={{ padding: '0.8rem' }}
              >
                <LinkedinIcon size={20} />
              </a>
            </div>
          </motion.div>

          {/* Circular Profile Avatar Section with Dotted Orbital Ring & Floating Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          >
            <div
              style={{
                position: 'relative',
                width: 'clamp(270px, 31vw, 350px)',
                aspectRatio: '1 / 1',
                borderRadius: '50%',
              }}
            >
              {/* Dotted Radial Ring Pattern around Circle */}
              <svg
                style={{
                  position: 'absolute',
                  inset: '-35px',
                  width: 'calc(100% + 70px)',
                  height: 'calc(100% + 70px)',
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
                viewBox="0 0 400 400"
              >
                <circle
                  cx="200"
                  cy="200"
                  r="182"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="2"
                  strokeDasharray="4 8"
                  fill="none"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="192"
                  stroke="rgba(239, 68, 68, 0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="2 12"
                  fill="none"
                />
              </svg>

              {/* Outer Circular Glowing Aura */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(248, 113, 113, 0.08) 60%, transparent 80%)',
                  filter: 'blur(25px)',
                  zIndex: 0,
                }}
              />

              {/* Main Circular Profile Image Frame */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  position: 'relative',
                  zIndex: 1,
                  padding: '4px',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.6) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(239, 68, 68, 0.3) 100%)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(239, 68, 68, 0.2)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'var(--bg-secondary)',
                    position: 'relative',
                  }}
                >
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      display: 'block',
                    }}
                  />
                </div>
              </div>

            </div>

            {/* Detail Badges Row below Profile Image */}
            <div
              style={{
                marginTop: '1.75rem',
                marginBottom: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.55rem',
                justifyContent: 'center',
                maxWidth: '420px',
              }}
            >
              <div
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  background: 'rgba(15, 15, 18, 0.92)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" width="16" height="16" alt="Flutter" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>Flutter Dev</span>
              </div>

              <div
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  background: 'rgba(15, 15, 18, 0.92)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="16" height="16" alt="Python" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>Python & AI</span>
              </div>

              <div
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  background: 'rgba(15, 15, 18, 0.92)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>⭐</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>1+ Years Exp</span>
              </div>

              <div
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  background: 'rgba(15, 15, 18, 0.92)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>🚀</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>6+ Projects</span>
              </div>
            </div>

            {/* Status Pill below Detail Badges */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.45rem 1.15rem',
                  borderRadius: '9999px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.22)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    boxShadow: '0 0 10px #ef4444',
                  }}
                />
                AVAILABLE FOR WORK
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .hero-grid { grid-template-columns: 1.15fr 0.85fr !important; }
        }
      `}</style>
    </section>
  );
}

