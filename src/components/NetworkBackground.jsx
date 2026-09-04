import React, { useEffect, useRef } from 'react';

export default function NetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes configuration - crisp, modern supply chain nodes
    const particleCount = Math.min(Math.floor((width * height) / 13000), 80);
    const particles = [];

    const colors = [
      '#2563eb', // Blue
      '#0284c7', // Sky
      '#06b6d4', // Cyan
      '#8b5cf6', // Purple
      '#10b981', // Emerald
      '#f59e0b', // Amber
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 2.2 + 1.8;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        radius: radius,
        baseRadius: radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.55 + 0.35,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Interactive mouse coordinates tracking across parent container
    let mouse = { x: null, y: null, maxDist: 180 };

    const handleMouseMove = (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    let frameCount = 0;

    // Render loop
    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw connecting lines between particles
      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // 2. Draw dynamic interactive magnetic connections to mouse cursor
      if (mouse.x !== null && mouse.y !== null && mouse.x >= 0 && mouse.x <= width && mouse.y >= 0 && mouse.y <= height) {
        for (let i = 0; i < particles.length; i++) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.maxDist) {
            const lineAlpha = (1 - dist / mouse.maxDist) * 0.55;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 1.4;
            ctx.stroke();

            // Slight gravitational attraction towards cursor
            const force = (1 - dist / mouse.maxDist) * 0.08;
            particles[i].x -= (dx / dist) * force;
            particles[i].y -= (dy / dist) * force;
          }
        }
      }

      // 3. Update and draw particles with subtle pulsation & glow
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundary
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        const pulse = Math.sin(frameCount * p.pulseSpeed + p.pulseOffset);
        const currentRadius = p.baseRadius + pulse * 0.6;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha + pulse * 0.15;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Glow ring on key landmark nodes
        if (p.baseRadius > 2.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius + 3.5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(37, 99, 235, ${0.25 + pulse * 0.1})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
}
