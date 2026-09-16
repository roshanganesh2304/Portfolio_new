import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { submitContactForm } from '../services/api';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

export default function Contact({ profile }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
    message: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null, message: '' });

    try {
      // 1. Save to SQLite database via FastAPI backend
      const response = await submitContactForm(formData);

      // 2. Trigger instant EmailJS notification if environment keys are configured
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        try {
          await emailjs.send(
            serviceId,
            templateId,
            {
              from_name: formData.name,
              from_email: formData.email,
              subject: formData.subject,
              message: formData.message,
              to_name: profile.name || 'Roshan Ganesh I',
            },
            publicKey
          );
          console.log('[EmailJS] Notification email sent successfully!');
        } catch (emailErr) {
          console.warn('[EmailJS] Failed to send email alert:', emailErr);
        }
      }

      setStatus({
        submitting: false,
        success: true,
        error: null,
        message: response.message || 'Message sent successfully!',
      });

      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        submitting: false,
        success: false,
        error: err.message || 'Something went wrong. Please try again.',
        message: '',
      });
    }
  };

  if (!profile) return null;

  return (
    <section id="contact" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">Let's Build Something Great Together</h2>
          <p className="subtitle">
            Have a project in mind, a job opportunity, or want to connect? Send me a message and I'll respond promptly.
          </p>
        </div>

        {/* Form + Sidebar Grid */}
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' }}>

          
          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card"
            style={{ padding: '2.5rem' }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Contact Details</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Feel free to reach out via email, phone, or connect on LinkedIn and GitHub.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={20} color="#6366f1" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Email</div>
                  <a href={`mailto:${profile.email}`} style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none' }}>
                    {profile.email}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(6, 182, 212, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={20} color="#06b6d4" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Phone</div>
                  <a href={`tel:${profile.phone}`} style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none' }}>
                    {profile.phone}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={20} color="#10b981" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Location</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {profile.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div style={{ paddingTop: '1.5rem', borderTop: 'var(--glass-border)' }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '1rem' }}>CONNECT ON SOCIALS</div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  <GithubIcon size={18} /> GitHub
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  <LinkedinIcon size={18} /> LinkedIn
                </a>
              </div>
            </div>

          </motion.div>

          {/* Interactive Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card"
            style={{ padding: '2.5rem' }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Send a Message</h3>

            {status.success && (
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <CheckCircle2 size={20} />
                <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{status.message}</span>
              </div>
            )}

            {status.error && (
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <AlertCircle size={20} />
                <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{status.error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Alex Johnson"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: 'var(--glass-border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Your Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="alex@example.com"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: 'var(--glass-border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Mobile App Project / Job Opportunity"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: 'var(--glass-border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Describe your project requirement or inquiry..."
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: 'var(--glass-border)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'all 0.2s ease',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={status.submitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', marginTop: '0.5rem' }}
              >
                {status.submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </form>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
