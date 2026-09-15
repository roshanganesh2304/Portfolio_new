import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar, MapPin, CheckCircle, ExternalLink } from 'lucide-react';

export default function Education({ educationData }) {
  if (!educationData) return null;

  const education = educationData.education || [];
  const certifications = educationData.certifications || [];

  return (
    <section id="education" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">

        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Academic & Training</span>
          <h2 className="section-title">Education & Certifications</h2>
          <p className="subtitle">
            Solid computer engineering foundation combined with specialized professional web development certifications.
          </p>
        </div>

        {/* Dual Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          
          {/* Education Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GraduationCap size={24} color="#6366f1" />
              </div>
              <h3 style={{ fontSize: '1.6rem' }}>Education</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {education.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass-card"
                  style={{ padding: '2rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{item.degree}</h4>
                    <span
                      style={{
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        background: item.status === 'In Progress' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: item.status === 'In Progress' ? '#06b6d4' : '#10b981',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '1.02rem', fontWeight: 600, color: 'var(--accent-secondary)', marginBottom: '0.75rem' }}>
                    {item.institution}
                  </div>

                  <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} color="#6366f1" /> {item.period}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} color="#06b6d4" /> {item.location}
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {item.details}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={24} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.6rem' }}>Certifications</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {certifications.map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass-card"
                  style={{ padding: '2rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <CheckCircle size={18} color="#10b981" />
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{cert.title}</h4>
                  </div>

                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                    {cert.organization}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <MapPin size={14} color="#06b6d4" /> {cert.location}
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {cert.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
