(function() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let w = 0, h = 0;

  const config = {
    particleCount: 50,
    baseRadius: 1.5,
    maxDistance: 120,
    mouseRadius: 150,
    baseColor: '#0ea5e9', // cyan
    altColor: '#64748b', // slate
    pulseColor: '#38bdf8',
    speed: 0.3
  };

  let mouse = { x: -1000, y: -1000 };
  let isPlaying = true;
  let pulses = [];

  function resize() {
    w = canvas.width = canvas.parentElement.offsetWidth;
    h = canvas.height = canvas.parentElement.offsetHeight;

    // Responsive particle count
    if (w < 768) {
      config.particleCount = 30;
    } else {
      config.particleCount = 50;
    }
    initParticles();
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        radius: config.baseRadius + Math.random() * 1,
        color: Math.random() > 0.5 ? config.baseColor : config.altColor,
        activePulse: 0
      });
    }
  }

  function draw() {
    if (!isPlaying) return;

    ctx.clearRect(0, 0, w, h);

    // Draw lines
    for (let i = 0; i < particles.length; i++) {
      let p1 = particles[i];

      // Update pulse
      if (p1.activePulse > 0) {
        p1.activePulse -= 0.05;
      }

      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p1.x - p2.x;
        let dy = p1.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.maxDistance) {
          ctx.beginPath();
          let alpha = 1 - (dist / config.maxDistance);
          let isPulsing = p1.activePulse > 0 || p2.activePulse > 0;

          if (isPulsing) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 1.5})`;
            ctx.lineWidth = 1.5;
          } else {
            ctx.strokeStyle = `rgba(100, 116, 139, ${alpha * 0.5})`;
            ctx.lineWidth = 0.8;
          }

          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Mouse interaction
      let mdx = mouse.x - p1.x;
      let mdy = mouse.y - p1.y;
      let mDist = Math.sqrt(mdx * mdx + mdy * mdy);

      if (mDist < config.mouseRadius) {
        p1.x += mdx * 0.01;
        p1.y += mdy * 0.01;

        ctx.beginPath();
        let mAlpha = 1 - (mDist / config.mouseRadius);
        ctx.strokeStyle = `rgba(14, 165, 233, ${mAlpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }

      // Update pos
      p1.x += p1.vx;
      p1.y += p1.vy;

      // Bounce
      if (p1.x < 0 || p1.x > w) p1.vx *= -1;
      if (p1.y < 0 || p1.y > h) p1.vy *= -1;

      // Draw node
      ctx.beginPath();
      let currentRadius = p1.activePulse > 0 ? p1.radius * 1.8 : p1.radius;
      ctx.arc(p1.x, p1.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = p1.activePulse > 0 ? config.pulseColor : p1.color;
      ctx.fill();
    }

    // Draw expanding pulse waves
    for (let i = pulses.length - 1; i >= 0; i--) {
      let pulse = pulses[i];
      pulse.radius += 5;
      pulse.alpha -= 0.02;

      if (pulse.alpha <= 0) {
        pulses.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${pulse.alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Trigger particles
      for (let p of particles) {
        let dx = p.x - pulse.x;
        let dy = p.y - pulse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (Math.abs(dist - pulse.radius) < 10 && p.activePulse <= 0) {
          p.activePulse = 1;
        }
      }
    }

    requestAnimationFrame(draw);
  }

  // Events
  window.addEventListener('resize', () => {
    resize();
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    let cx = e.clientX - rect.left;
    let cy = e.clientY - rect.top;

    pulses.push({
      x: cx,
      y: cy,
      radius: 0,
      alpha: 1
    });
  });

  // Init
  resize();
  draw();

  // Intersection Observer for performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!isPlaying) {
          isPlaying = true;
          draw();
        }
      } else {
        isPlaying = false;
      }
    });
  });
  observer.observe(canvas.parentElement);

})();
