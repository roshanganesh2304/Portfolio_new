import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Server, Cpu, Layers, Award, Terminal, Code } from 'lucide-react';
import { DEFAULT_PROFILE } from '../services/api';

export default function About({ profile }) {
  const statsList = (profile?.stats && profile.stats.length > 0) ? profile.stats : DEFAULT_PROFILE.stats;

  const pillars = [
    {
      icon: <Smartphone size={24} color="#6366f1" />,
      title: "Cross-Platform Mobile",
      description: "Building responsive, beautiful native-feel mobile applications for iOS & Android using Flutter, Dart, and scalable architecture."
    },
    {
      icon: <Server size={24} color="#06b6d4" />,
      title: "Backend & RESTful APIs",
      description: "Developing robust backend services, microservices, and database systems with Python, Django, Django REST Framework, and Node.js."
    },
    {
      icon: <Cpu size={24} color="#10b981" />,
      title: "AI & Smart Web Solutions",
      description: "Integrating intelligent features like emotion recognition AI for student mental health chatbots and data-driven web applications."
    },
    {
      icon: <Layers size={24} color="#8b5cf6" />,
      title: "Cloud & Firebase",
      description: "Implementing real-time data handling, authentication, Cloud Firestore, and storage solutions for high availability."
    }
  ];

  return (
    <section id="about" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">About Me</span>
          <h2 className="section-title">Driven by Engineering Excellence</h2>
          <p className="subtitle">
            Computer engineering graduate and Jr App Developer with a passion for building clean, user-centric software across mobile and web platforms.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {statsList.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card"
              style={{ padding: '2rem', textAlign: 'center' }}
            >
              <div className="text-gradient" style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500, marginTop: '0.5rem' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pillars Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card"
              style={{ padding: '2rem' }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                {pillar.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{pillar.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
