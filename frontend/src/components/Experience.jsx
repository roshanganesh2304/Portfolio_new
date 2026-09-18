import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';
import { DEFAULT_EXPERIENCE } from '../services/api';

export default function Experience({ experience }) {
  const expList = (experience && experience.length > 0) ? experience : DEFAULT_EXPERIENCE;

  return (
    <section id="experience" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">

        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Career History</span>
          <h2 className="section-title">Professional Experience</h2>
          <p className="subtitle">
            Hands-on software development experience building production mobile apps and scalable backend APIs.
          </p>
        </div>

        {/* Timeline Container */}
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          
          {/* Vertical Line */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              bottom: '20px',
              left: '28px',
              width: '2px',
              background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary), transparent)',
            }}
          />

          {expList.map((exp, idx) => (
            <motion.div
              key={exp.id || idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative' }}
            >
              {/* Timeline Icon Node */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  border: '2px solid var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)',
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                  flexShrink: 0,
                  zIndex: 2,
                }}
              >
                <Briefcase size={22} />
              </div>

              {/* Experience Details Card */}
              <div className="glass-card" style={{ padding: '2.25rem', flexGrow: 1 }}>
                
                {/* Header Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.4rem' }}>{exp.role}</h3>
                      {exp.is_current && (
                        <span
                          style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          PRESENT
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>
                      {exp.company}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={15} color="#6366f1" /> {exp.period}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={15} color="#06b6d4" /> {exp.location}
                    </div>
                  </div>
                </div>

                {/* Highlights List */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.9rem', margin: '1.5rem 0' }}>
                  {exp.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      <ChevronRight size={18} color="#6366f1" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '1rem', borderTop: 'var(--glass-border)' }}>
                  {exp.technologies.map(tech => (
                    <span
                      key={tech}
                      style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        fontWeight: 500,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
