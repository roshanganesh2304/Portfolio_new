import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Award, CheckCircle2 } from 'lucide-react';
import { DEFAULT_SKILLS } from '../services/api';

export default function Skills({ skills }) {
  const technicalSkills = (skills?.technical && skills.technical.length > 0) ? skills.technical : DEFAULT_SKILLS.technical;
  const softSkills = (skills?.soft && skills.soft.length > 0) ? skills.soft : DEFAULT_SKILLS.soft;

  return (
    <section id="skills" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Technical Matrix</span>
          <h2 className="section-title">Skills & Capabilities</h2>
          <p className="subtitle">
            Comprehensive tech stack spanning cross-platform mobile development, backend engineering, databases, and modern web frameworks.
          </p>
        </div>

        {/* Technical Skills Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {technicalSkills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="glass-card"
              style={{ padding: '1.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  
                  {/* Brand Icon SVG */}
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: 'var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                    }}
                  >
                    {skill.icon_url ? (
                      <img
                        src={skill.icon_url}
                        alt={skill.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Code2 size={20} color="#6366f1" />
                    )}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{skill.name}</h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{skill.category}</div>
                  </div>
                </div>

                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'monospace' }}>
                  {skill.level}%
                </span>
              </div>

              {/* Progress Bar Container */}
              <div
                style={{
                  width: '100%',
                  height: '7px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.15 + idx * 0.04 }}
                  style={{
                    height: '100%',
                    borderRadius: '9999px',
                    background: 'var(--accent-gradient)',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Soft Skills Section */}
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-secondary)' }}>
            <Award size={24} />
            <h3 style={{ fontSize: '1.4rem' }}>Professional Soft Skills</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Proven ability to excel in collaborative engineering environments, solve complex algorithmic challenges, and adapt rapidly.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            {softSkills.map((soft, idx) => (
              <motion.div
                key={soft}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '9999px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <CheckCircle2 size={16} color="#10b981" />
                {soft}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
