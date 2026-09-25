import React, { useEffect, useRef } from 'react';

export default function AssociationConstellationCanvas({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || 800);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Major Hubs with business association badges
    const hubs = [
      { name: 'BNI Global', xPct: 0.35, yPct: 0.30, color: '#dc2626', size: 6, pulseColor: 'rgba(220, 38, 38, ' },
      { name: 'HUBA Alliance', xPct: 0.65, yPct: 0.25, color: '#0052cc', size: 7, pulseColor: 'rgba(0, 82, 204, ' },
      { name: 'VCCI Vietnam', xPct: 0.50, yPct: 0.55, color: '#0284c7', size: 8, pulseColor: 'rgba(2, 132, 199, ' },
      { name: 'FIATA Logistics', xPct: 0.80, yPct: 0.60, color: '#059669', size: 6, pulseColor: 'rgba(5, 150, 105, ' },
      { name: 'FDI Bridge', xPct: 0.25, yPct: 0.70, color: '#7c3aed', size: 6, pulseColor: 'rgba(124, 58, 237, ' },
    ];

    // Background floating micro-particles
    const particleCount = 28;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
        color: '#0052cc',
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    // Dynamic data packets flowing along lines
    const packets = [];
    const maxPackets = 12;

    const createPacket = () => {
      if (hubs.length < 2) return;
      const srcIdx = Math.floor(Math.random() * hubs.length);
      let dstIdx = Math.floor(Math.random() * hubs.length);
      while (dstIdx === srcIdx) {
        dstIdx = Math.floor(Math.random() * hubs.length);
      }
      packets.push({
        src: hubs[srcIdx],
        dst: hubs[dstIdx],
        progress: 0,
        speed: Math.random() * 0.008 + 0.004,
        color: hubs[srcIdx].color,
        size: Math.random() * 2 + 2,
      });
    };

    // Pre-populate packets
    for (let i = 0; i < 6; i++) {
      createPacket();
      if (packets[i]) packets[i].progress = Math.random();
    }

    let mouse = { x: null, y: null };
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

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Update and draw micro particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 82, 204, ${p.alpha})`;
        ctx.fill();
      });

      // 2. Connect micro-particles that are close
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 82, 204, ${(1 - dist / 100) * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 3. Connect Hubs with high-tech dashed & solid lines
      for (let i = 0; i < hubs.length; i++) {
        for (let j = i + 1; j < hubs.length; j++) {
          const h1 = hubs[i];
          const h2 = hubs[j];
          const x1 = h1.xPct * width;
          const y1 = h1.yPct * height;
          const x2 = h2.xPct * width;
          const y2 = h2.yPct * height;

          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = 'rgba(0, 82, 204, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 4. Update and render data packets (Energy transfer across hubs)
      if (packets.length < maxPackets && Math.random() < 0.03) {
        createPacket();
      }

      for (let k = packets.length - 1; k >= 0; k--) {
        const pkt = packets[k];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(k, 1);
          continue;
        }

        const x1 = pkt.src.xPct * width;
        const y1 = pkt.src.yPct * height;
        const x2 = pkt.dst.xPct * width;
        const y2 = pkt.dst.yPct * height;

        const curX = x1 + (x2 - x1) * pkt.progress;
        const curY = y1 + (y2 - y1) * pkt.progress;

        // Glowing packet head
        ctx.beginPath();
        ctx.arc(curX, curY, pkt.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // 5. Render Major Hubs & Labels
      hubs.forEach((hub, idx) => {
        const hx = hub.xPct * width;
        const hy = hub.yPct * height;

        // Pulsing radar rings
        const pulse = (Math.sin(tick * 0.04 + idx) + 1) / 2; // 0 to 1
        const ringRadius = hub.size + pulse * 14;
        const ringAlpha = (1 - pulse) * 0.5;

        ctx.beginPath();
        ctx.arc(hx, hy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `${hub.pulseColor}${ringAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Outer glow circle
        ctx.beginPath();
        ctx.arc(hx, hy, hub.size + 2, 0, Math.PI * 2);
        ctx.fillStyle = `${hub.pulseColor}0.25)`;
        ctx.fill();

        // Inner solid core
        ctx.beginPath();
        ctx.arc(hx, hy, hub.size, 0, Math.PI * 2);
        ctx.fillStyle = hub.color;
        ctx.fill();

        // Center white dot
        ctx.beginPath();
        ctx.arc(hx, hy, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Glassmorphic Tag Label
        const labelText = hub.name;
        ctx.font = '600 11px system-ui, -apple-system, sans-serif';
        const textMetrics = ctx.measureText(labelText);
        const boxWidth = textMetrics.width + 16;
        const boxHeight = 20;
        const boxX = hx - boxWidth / 2;
        const boxY = hy + hub.size + 8;

        // Background pill
        ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 10);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Border pill
        ctx.strokeStyle = `${hub.pulseColor}0.3)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 10);
        ctx.stroke();

        // Text
        ctx.fillStyle = '#1e293b';
        ctx.fillText(labelText, boxX + 8, boxY + 14);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
