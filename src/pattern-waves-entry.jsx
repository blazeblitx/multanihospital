import React from 'react';
import { createRoot } from 'react-dom/client';
import PatternWaves from './PatternWaves.jsx';
import ReflectiveCard from './ReflectiveCard.jsx';
import { mountVideoGallery } from './video-gallery-entry.jsx';

const mount = document.getElementById('hero-pattern-waves');

if (mount) {
  createRoot(mount).render(
    <PatternWaves
      className="hero-pattern-waves-canvas"
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      preset="silk"
      color="#4a7884"
      backgroundColor="transparent"
      fade="edges"
      interactive
      cursorSize={50}
      cursorStrength={0.6}
      pattern="line"
      spacing={7}
      light={-7}
      shine={0.3}
      speed={0.25}
      scale={0.55}
      direction={5}
      opacity={0.45}
      fadeSize={0.1}
    />
  );
}

const appointmentFormRoot = document.getElementById('appointment-form-root');

if (appointmentFormRoot) {
  const requestedService = new URLSearchParams(window.location.search).get('service');
  const submitAppointment = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const subject = encodeURIComponent('Appointment enquiry — Multani Plastic Surgery Centre');
    const body = encodeURIComponent(
      `Name: ${values.get('name')}\nEmail: ${values.get('email')}\nPhone: ${values.get('phone') || 'Not provided'}\n\nQuery:\n${values.get('query')}`
    );
    window.location.href = `mailto:jangpreetsingh@yahoo.co.in?subject=${subject}&body=${body}`;
  };

  createRoot(appointmentFormRoot).render(
    <ReflectiveCard
      name="Appointment enquiry"
      role="Contact Multani Plastic Surgery Centre"
      badge="PLAN YOUR VISIT"
      status="Jalandhar, Punjab"
      idLabel=""
      idValue=""
      theme="light"
      tint="#e6f4f9"
      metalness={0.28}
      roughness={0.62}
      blurStrength={12}
      grayscale={0.3}
      warp={0.08}
      shine={0.55}
      glare={0.22}
      enableTilt
      tiltStrength={2.5}
      intro
      width="100%"
      height={620}
      radius={18}
      className="appointment-reflective"
    >
      <form id="appointment-form" className="appointment-form appointment-form-reflective" onSubmit={submitAppointment}>
        <p className="contact-label">PLAN YOUR VISIT · JALANDHAR</p>
        <h2>Appointment enquiry</h2>
        <p className="appointment-form-intro">Share only the details needed for your enquiry. Your email app will open a draft for you to review and send. Do not include health information.</p>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" autoComplete="name" required />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" />
        <label htmlFor="query">Your query</label>
        <textarea id="query" name="query" rows="4" required defaultValue={requestedService ? `I'm interested in: ${requestedService}` : ''} />
        <label className="form-consent"><input type="checkbox" name="privacy-consent" required /> <span>I have read the <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a> and understand this form prepares an email draft. I will not include sensitive health information.</span></label>
        <button className="button button-dark" type="submit">Prepare email <span>↗</span></button>
        <small>Your email app will open with a draft for you to review and send. Please don’t include sensitive health information.</small>
      </form>
    </ReflectiveCard>
  );
}

mountVideoGallery();
