import React, { useEffect, useRef } from 'react';

/**
 * B2bTradeNetworkCanvas
 * Interactive Live Global Supply Network Canvas
 * Renders real-time glowing supply chain arcs, pulsing logistics hubs, moving RFQ data packets,
 * and live trade connection pulses over the B2B Sourcing hero background.
 */
export default function B2bTradeNetworkCanvas({ className = '' }) {
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

    // Global Trade & Supply Chain Strategic Hubs (normalized percentages mapped to hero map layout)
    const tradeHubs = [
      { name: 'Vietnam Hub (HCMC / HN)', xPct: 0.72, yPct: 0.38, color: '#0052cc', pulseColor: 'rgba(0, 82, 204,', size: 6, isCenter: true },
      { name: 'East Asia (Japan / Korea)', xPct: 0.82, yPct: 0.22, color: '#0284c7', pulseColor: 'rgba(2, 132, 199,', size: 5 },
      { name: 'Shenzhen / Shanghai', xPct: 0.75, yPct: 0.26, color: '#2563eb', pulseColor: 'rgba(37, 99, 235,', size: 5.5 },
      { name: 'EU Trade Corridor', xPct: 0.38, yPct: 0.20, color: '#0d9488', pulseColor: 'rgba(13, 148, 136,', size: 5 },
      { name: 'North America Trade', xPct: 0.18, yPct: 0.28, color: '#4f46e5', pulseColor: 'rgba(79, 70, 229,', size: 5 },
      { name: 'ASEAN Maritime Hub', xPct: 0.68, yPct: 0.48, color: '#059669', pulseColor: 'rgba(5, 150, 105,', size: 5 },
    ];

    // Ambient floating logistics micro-particles
    const particles = [];
    const particleCount = 24;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.2,
        color: '#0052cc',
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    // Trade Data Flow Packets (Moving along trade arcs)
    const packets = [];
    const maxPackets = 14;

    const createPacket = () => {
      if (tradeHubs.length < 2) return;
      // Connect peripheral hubs to Vietnam central manufacturing hub or each other
      const srcIdx = Math.floor(Math.random() * tradeHubs.length);
      let dstIdx = 0; // default to Vietnam Hub
      if (srcIdx === 0) {
        dstIdx = Math.floor(Math.random() * (tradeHubs.length - 1)) + 1;
      }

      packets.push({
        src: tradeHubs[srcIdx],
        dst: tradeHubs[dstIdx],
        progress: 0,
        speed: Math.random() * 0.007 + 0.003,
        color: tradeHubs[srcIdx].color,
        size: Math.random() * 2.5 + 2.5,
        curveOffset: (Math.random() - 0.5) * 35,
      });
    };

    // Pre-populate packets
    for (let i = 0; i < 6; i++) {
      createPacket();
      if (packets[i]) packets[i].progress = Math.random();
    }

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Render ambient floating micro-particles
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

      // 2. Render Curved Trade Routes (Curved Beziers to simulate spherical globe arcs)
      for (let i = 0; i < tradeHubs.length; i++) {
        for (let j = i + 1; j < tradeHubs.length; j++) {
          const h1 = tradeHubs[i];
          const h2 = tradeHubs[j];
          const x1 = h1.xPct * width;
          const y1 = h1.yPct * height;
          const x2 = h2.xPct * width;
          const y2 = h2.yPct * height;

          // Midpoint with curve arc upward
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2 - Math.min(Math.abs(x2 - x1) * 0.18, 45);

          ctx.beginPath();
          ctx.setLineDash([5, 5]);
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(midX, midY, x2, y2);
          ctx.strokeStyle = 'rgba(0, 82, 204, 0.28)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 3. Render moving data packets along trade curves
      if (packets.length < maxPackets && Math.random() < 0.04) {
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

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - Math.min(Math.abs(x2 - x1) * 0.18, 45) + pkt.curveOffset;

        // Quadratic Bezier interpolation point
        const t = pkt.progress;
        const curX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
        const curY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

        // Luminous glowing packet head
        ctx.beginPath();
        ctx.arc(curX, curY, pkt.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // 4. Render Major Trade Hub Nodes & Radar Rings
      tradeHubs.forEach((hub, idx) => {
        const hx = hub.xPct * width;
        const hy = hub.yPct * height;

        // Radar expansion ring
        const pulse = (Math.sin(tick * 0.045 + idx * 1.2) + 1) / 2;
        const ringRadius = hub.size + pulse * 16;
        const ringAlpha = (1 - pulse) * 0.6;

        ctx.beginPath();
        ctx.arc(hx, hy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `${hub.pulseColor}${ringAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Secondary inner pulse
        if (hub.isCenter) {
          const pulse2 = (Math.sin(tick * 0.06 + Math.PI) + 1) / 2;
          ctx.beginPath();
          ctx.arc(hx, hy, hub.size + pulse2 * 26, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 82, 204, ${(1 - pulse2) * 0.4})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Outer glow aura
        ctx.beginPath();
        ctx.arc(hx, hy, hub.size + 3, 0, Math.PI * 2);
        ctx.fillStyle = `${hub.pulseColor}0.25)`;
        ctx.fill();

        // Solid core
        ctx.beginPath();
        ctx.arc(hx, hy, hub.size, 0, Math.PI * 2);
        ctx.fillStyle = hub.color;
        ctx.fill();

        // Center white core
        ctx.beginPath();
        ctx.arc(hx, hy, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Futuristic Glass Badge Label
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

        // Text
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
