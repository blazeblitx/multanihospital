import React from 'react';
import { createRoot } from 'react-dom/client';
import CrystalizedBall from './CrystalizedBall.jsx';

document.querySelectorAll('.ai-crystal-host').forEach(mount => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  createRoot(mount).render(
    <CrystalizedBall
      preset="abyss"
      color="#66d7ff"
      size={0.9}
      strands={4}
      crackle={0.38}
      flares={0.34}
      glow={0.8}
      sparks={0.16}
      particleCount={700}
      fill={0.7}
      motion="orbit"
      particleShape="round"
      depth={0.72}
      sway={0.45}
      twinkle={0.5}
      haze={0.55}
      speed={0.5}
      dustSpeed={0.55}
      interactive={!reducedMotion}
      hoverStrength={0.42}
      intro={!reducedMotion}
      paused={reducedMotion}
    />
  );
});
