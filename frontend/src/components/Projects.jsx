import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Projects({ projects }) {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const scrollRef = useRef(null);

  // Lock background body & html scroll completely when modal is active
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedProject]);

  if (!projects || projects.length === 0) return null;

  const categories = ['All', 'Mobile App', 'Full-Stack Web', 'AI & Python'];

  const filteredProjects = activeTab === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase().includes(activeTab.toLowerCase()));

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header with Carousel Navigation Arrows */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <span className="section-tag">Featured Work</span>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Portfolio Projects</h2>
            <p className="subtitle" style={{ maxWidth: '580px' }}>
              Swipe or use navigation controls to explore cross-platform mobile apps, AI video assistants, and web platforms.
            </p>
          </div>

          {/* Carousel Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleScrollLeft}
              aria-label="Scroll left"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'var(--glass-border)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25 ease',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleScrollRight}
              aria-label="Scroll right"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 20px -4px rgba(239, 68, 68, 0.4)',
                transition: 'all 0.25s ease',
              }}
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setActiveTab(category);
                if (scrollRef.current) scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
              }}
              style={{
                padding: '0.55rem 1.35rem',
                borderRadius: '9999px',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: activeTab === category ? '1px solid var(--accent-primary)' : 'var(--glass-border)',
                background: activeTab === category ? 'var(--accent-gradient)' : 'var(--bg-card)',
                color: activeTab === category ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: activeTab === category ? '0 8px 20px -4px rgba(239, 68, 68, 0.4)' : 'none',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Horizontal Carousel Track */}
        <div
          ref={scrollRef}
          className="projects-carousel-track"
          style={{
            display: 'flex',
            gap: '1.75rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            paddingBottom: '1.5rem',
            paddingTop: '0.5rem',
          }}
        >
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="glass-card"
              style={{
                flex: '0 0 clamp(310px, 82vw, 360px)',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0',
                overflow: 'hidden',
                cursor: 'pointer',
                border: `1px solid ${project.accent_color ? project.accent_color + '44' : 'var(--border-color)'}`,
              }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Top Project Preview Image Card - Full Image View */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '420px',
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg, #090b10 0%, #12141d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                }}
              >
                <img
                  src={project.image_url}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    borderRadius: '0.85rem',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                
                {/* Gradient Subtle Shadow Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 60%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Top Category Badge */}
                <span
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    background: 'rgba(15, 15, 18, 0.88)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: project.accent_color || 'var(--accent-secondary)',
                    zIndex: 2,
                  }}
                >
                  {project.category}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.4rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.3rem', fontWeight: 700 }}>
                    {project.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: project.accent_color || 'var(--accent-primary)', marginBottom: '0.75rem' }}>
                    {project.summary}
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.2rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tech Stack Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.15rem' }}>
                    {project.technologies.slice(0, 4).map(tech => (
                      <span
                        key={tech}
                        style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.76rem',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Action Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.85rem', borderTop: 'var(--glass-border)' }}>
                    <span style={{ fontSize: '0.88rem', color: project.accent_color || 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Inspect Preview <ArrowRight size={15} />
                    </span>
                  </div>
                </div>

              </div>

            </motion.div>
          ))}
        </div>

        {/* Project Detail Modal rendered via React Portal at document body root */}
        {createPortal(
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100vw',
                  height: '100vh',
                  zIndex: 999999,
                  background: 'rgba(5, 8, 15, 0.92)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem 1rem',
                  overflowY: 'auto',
                }}
                onClick={() => setSelectedProject(null)}
              >
                <motion.div
                  initial={{ scale: 0.94, y: 25 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 25 }}
                  style={{
                    maxWidth: '740px',
                    width: '100%',
                    maxHeight: '88vh',
                    overflowY: 'auto',
                    padding: '0',
                    position: 'relative',
                    background: '#0e1526',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.9)',
                    margin: 'auto',
                    color: 'var(--text-primary)',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedProject(null)}
                    aria-label="Close modal"
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 30,
                    }}
                  >
                    <X size={20} />
                  </button>

                  {/* Full Resolution Modal Image Header */}
                  <div style={{ width: '100%', maxHeight: '380px', overflow: 'hidden', background: '#05080f', display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={selectedProject.image_url}
                      alt={selectedProject.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                    />
                  </div>

                  <div style={{ padding: '2rem' }}>
                    {/* Modal Title & Category */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.65rem', marginBottom: '0.2rem' }}>{selectedProject.title}</h3>
                        <div style={{ fontSize: '0.85rem', color: selectedProject.accent_color || 'var(--accent-secondary)', fontWeight: 600 }}>
                          {selectedProject.category}
                        </div>
                      </div>

                      <span
                        style={{
                          padding: '0.35rem 0.85rem',
                          borderRadius: '9999px',
                          background: 'rgba(99, 102, 241, 0.15)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--accent-primary)',
                        }}
                      >
                        Featured Project
                      </span>
                    </div>

                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                      {selectedProject.summary}
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                      {selectedProject.description}
                    </p>

                    {/* Key Features */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                        Key Architecture & Features
                      </h4>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          <Check size={16} color="#10b981" /> High performance RESTful API integration
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          <Check size={16} color="#10b981" /> Clean modular application architecture
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          <Check size={16} color="#10b981" /> Secure authentication & state management
                        </li>
                      </ul>
                    </div>

                    {/* Tech Badges */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Technologies Used</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedProject.technologies.map(t => (
                          <span
                            key={t}
                            style={{
                              padding: '0.35rem 0.85rem',
                              borderRadius: '8px',
                              background: 'rgba(99, 102, 241, 0.12)',
                              border: '1px solid rgba(99, 102, 241, 0.25)',
                              fontSize: '0.85rem',
                              color: 'var(--accent-primary)',
                              fontWeight: 600,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      </div>
    </section>
  );
}
