(() => {
  const canvas = document.querySelector('#location-globe-canvas');
  const globe = document.querySelector('#location-globe');
  const mapSection = document.querySelector('.map-section');
  const mapLayout = document.querySelector('.map-layout');
  const mapFrame = document.querySelector('#clinic-map');
  const zoomLink = document.querySelector('.globe-zoom-link');
  if (!canvas || !globe || !mapSection || !mapLayout || !mapFrame || !zoomLink) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = canvas.width / 256;
  ctx.scale(dpr, dpr);

  const center = { x: 128, y: 128 };
  const radius = 94;
  const clinic = { lat: 31.326, lon: 75.576 };
  const destinations = [
    { lat: 2, lon: 132 },
    { lat: -28, lon: 12 },
    { lat: 55, lon: -91 },
    { lat: -42, lon: 102 }
  ];
  let rotation = -clinic.lon * Math.PI / 180;
  let frameId = 0;
  let visible = false;
  const toRadians = degrees => degrees * Math.PI / 180;

  function project(lat, lon, spin) {
    const latitude = toRadians(lat);
    const longitude = toRadians(lon) + spin;
    const cosLatitude = Math.cos(latitude);
    return {
      x: center.x + radius * cosLatitude * Math.sin(longitude),
      y: center.y - radius * Math.sin(latitude),
      z: cosLatitude * Math.cos(longitude)
    };
  }

  function draw(time = 0) {
    ctx.clearRect(0, 0, 256, 256);
    const glow = ctx.createRadialGradient(center.x - 28, center.y - 34, 8, center.x, center.y, radius * 1.15);
    glow.addColorStop(0, 'rgba(83, 185, 223, .2)');
    glow.addColorStop(1, 'rgba(29, 103, 151, .015)');
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius + 5, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Longitude and latitude dots give the sphere depth without external assets.
    for (let lat = -80; lat <= 80; lat += 10) {
      for (let lon = -180; lon < 180; lon += 10) {
        const point = project(lat, lon, rotation);
        if (point.z < -0.05) continue;
        const depth = Math.max(0.12, (point.z + 0.05) / 1.05);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 0.7 + depth * 0.72, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(24, 105, 151, ${0.2 + depth * 0.57})`;
        ctx.fill();
      }
    }

    // Delicate animated arcs meet around Jalandhar as a decorative globe motif.
    destinations.forEach((destination, arcIndex) => {
      ctx.beginPath();
      let drawing = false;
      const phase = (Math.sin(time / 1600 + arcIndex * 1.4) + 1) * 0.5;
      for (let step = 0; step <= 44; step += 1) {
        const progress = step / 44;
        const lat = clinic.lat + (destination.lat - clinic.lat) * progress + Math.sin(progress * Math.PI) * (18 + arcIndex * 3);
        const lon = clinic.lon + (destination.lon - clinic.lon) * progress;
        const point = project(lat, lon, rotation);
        if (point.z > 0.04) {
          if (!drawing) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
          drawing = true;
        } else drawing = false;
      }
      ctx.strokeStyle = `rgba(8, 133, 190, ${0.28 + phase * 0.48})`;
      ctx.lineWidth = 1.15;
      ctx.setLineDash([3, 4]);
      ctx.lineDashOffset = -time / 110;
      ctx.stroke();
    });
    ctx.setLineDash([]);

    const marker = project(clinic.lat, clinic.lon, rotation);
    if (marker.z > 0.02) {
      const pulse = reducedMotion ? 1 : 1 + (Math.sin(time / 420) + 1) * 0.35;
      ctx.beginPath();
      ctx.arc(marker.x, marker.y, 5.3 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14, 149, 204, .16)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(marker.x, marker.y, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = '#087eae';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.96)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(69, 156, 193, .32)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function animate(time) {
    if (!visible || reducedMotion || document.hidden) {
      frameId = 0;
      draw(time);
      return;
    }
    rotation += 0.00045;
    draw(time);
    frameId = window.requestAnimationFrame(animate);
  }

  function updateAnimation() {
    if (visible && !reducedMotion && !document.hidden && !frameId) {
      frameId = window.requestAnimationFrame(animate);
    } else if ((!visible || reducedMotion || document.hidden) && frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
      draw();
    }
  }

  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      updateAnimation();
    }, { rootMargin: '160px' });
    observer.observe(mapSection);
  } else {
    visible = true;
    draw();
  }
  document.addEventListener('visibilitychange', updateAnimation);

  zoomLink.addEventListener('click', event => {
    event.preventDefault();
    mapSection.classList.add('is-zooming-location');
    mapLayout.classList.add('is-map-zoomed');
    globe.classList.add('is-zooming');
    const wait = reducedMotion ? 0 : 780;
    window.setTimeout(() => mapFrame.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' }), wait);
    if (!reducedMotion) window.setTimeout(() => mapSection.classList.remove('is-zooming-location'), 1150);
  });
})();
