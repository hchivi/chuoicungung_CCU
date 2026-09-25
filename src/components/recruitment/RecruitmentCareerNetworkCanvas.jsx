import React, { useEffect, useRef } from 'react';

/**
 * RecruitmentCareerNetworkCanvas
 * Interactive Live Career & Smart Factory Talent Matching Canvas
 * Renders real-time robotic automation pulses, candidate matching streams,
 * verified talent hubs (Bắc Ninh, Bình Dương, Đồng Nai, Hải Phòng, TP.HCM),
 * and Industry 4.0 career telemetry over the Recruitment hero image.
 */
export default function RecruitmentCareerNetworkCanvas({ className = '' }) {
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

    // Industrial KCN Career Hubs mapped across Vietnam manufacturing zones
    const careerHubs = [
      { name: 'KCN Bình Dương & Đồng Nai', xPct: 0.65, yPct: 0.42, color: '#0052cc', pulseColor: 'rgba(0, 82, 204,', size: 6.5, role: 'Kỹ Sư Cơ Điện & Robot' },
      { name: 'KCN Bắc Ninh & Hải Phòng', xPct: 0.82, yPct: 0.24, color: '#0284c7', pulseColor: 'rgba(2, 132, 199,', size: 6, role: 'Kỹ Sư Điện Tử & Bán Dẫn' },
      { name: 'Khu Công Nghệ Cao TP.HCM', xPct: 0.48, yPct: 0.32, color: '#7c3aed', pulseColor: 'rgba(124, 58, 237,', size: 6, role: 'Trưởng Phòng QA/QC' },
      { name: 'KCN VSIP Hải Dương / Hưng Yên', xPct: 0.88, yPct: 0.48, color: '#059669', pulseColor: 'rgba(5, 150, 105,', size: 5.5, role: 'Quản Lý Chuỗi Cung Ứng' },
      { name: 'Smart Factory Automation Hub', xPct: 0.76, yPct: 0.62, color: '#ea580c', pulseColor: 'rgba(234, 88, 12,', size: 5.5, role: 'Kỹ Thuật Viên CNC 5 Trục' },
    ];

    // Ambient floating industrial telemetry sparks & data micro-particles
    const particles = [];
    const particleCount = 26;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        radius: Math.random() * 2 + 1.2,
        color: '#0052cc',
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    // Talent matching energy pulses flowing between factories and candidates
    const matchPackets = [];
    const maxPackets = 12;

    const createMatchPacket = () => {
      if (careerHubs.length < 2) return;
      const srcIdx = Math.floor(Math.random() * careerHubs.length);
      let dstIdx = Math.floor(Math.random() * careerHubs.length);
      while (dstIdx === srcIdx) {
        dstIdx = Math.floor(Math.random() * careerHubs.length);
      }

      matchPackets.push({
        src: careerHubs[srcIdx],
        dst: careerHubs[dstIdx],
        progress: 0,
        speed: Math.random() * 0.007 + 0.0035,
        color: careerHubs[srcIdx].color,
        size: Math.random() * 2.5 + 2.5,
        curveOffset: (Math.random() - 0.5) * 40,
      });
    };

    // Pre-populate packets
    for (let i = 0; i < 5; i++) {
      createMatchPacket();
      if (matchPackets[i]) matchPackets[i].progress = Math.random();
    }

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Render ambient floating micro sparks
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

      // 2. Render Curved Talent Matching Arcs & Connection Beams
      for (let i = 0; i < careerHubs.length; i++) {
        for (let j = i + 1; j < careerHubs.length; j++) {
          const h1 = careerHubs[i];
          const h2 = careerHubs[j];
          const x1 = h1.xPct * width;
          const y1 = h1.yPct * height;
          const x2 = h2.xPct * width;
          const y2 = h2.yPct * height;

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2 - Math.min(Math.abs(x2 - x1) * 0.16, 40);

          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(midX, midY, x2, y2);
          ctx.strokeStyle = 'rgba(0, 82, 204, 0.28)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 3. Render moving talent matching pulses
      if (matchPackets.length < maxPackets && Math.random() < 0.035) {
        createMatchPacket();
      }

      for (let k = matchPackets.length - 1; k >= 0; k--) {
        const pkt = matchPackets[k];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          matchPackets.splice(k, 1);
          continue;
        }

        const x1 = pkt.src.xPct * width;
        const y1 = pkt.src.yPct * height;
        const x2 = pkt.dst.xPct * width;
        const y2 = pkt.dst.yPct * height;

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - Math.min(Math.abs(x2 - x1) * 0.16, 40) + pkt.curveOffset;

        const t = pkt.progress;
        const curX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
        const curY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

        // Glowing packet head
        ctx.beginPath();
        ctx.arc(curX, curY, pkt.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Render Career Hub Nodes & Radar Scan Rings
      careerHubs.forEach((hub, idx) => {
        const hx = hub.xPct * width;
        const hy = hub.yPct * height;

        // Radar expansion ring
        const pulse = (Math.sin(tick * 0.045 + idx * 1.3) + 1) / 2;
        const ringRadius = hub.size + pulse * 16;
        const ringAlpha = (1 - pulse) * 0.6;

        ctx.beginPath();
        ctx.arc(hx, hy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `${hub.pulseColor}${ringAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Outer glow
        ctx.beginPath();
        ctx.arc(hx, hy, hub.size + 3, 0, Math.PI * 2);
        ctx.fillStyle = `${hub.pulseColor}0.25)`;
        ctx.fill();

        // Inner solid node
        ctx.beginPath();
        ctx.arc(hx, hy, hub.size, 0, Math.PI * 2);
        ctx.fillStyle = hub.color;
        ctx.fill();

        // Center white core
        ctx.beginPath();
        ctx.arc(hx, hy, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Glassmorphic Tag with Job Title
        const labelText = hub.name;
        ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
        const textMetrics = ctx.measureText(labelText);
        const boxWidth = textMetrics.width + 16;
        const boxHeight = 18;
        const boxX = hx - boxWidth / 2;
        const boxY = hy + hub.size + 7;

        // Pill background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 9);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Pill border
        ctx.strokeStyle = `${hub.pulseColor}0.35)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 9);
        ctx.stroke();

        // Pill text
        ctx.fillStyle = '#0f172a';
        ctx.fillText(labelText, boxX + 8, boxY + 13);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
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
