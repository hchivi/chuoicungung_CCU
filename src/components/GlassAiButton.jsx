import React from 'react';
import { Brain, Search } from 'lucide-react';
import './GlassAiButton.css';

export default function GlassAiButton({
  type = 'submit',
  text = 'TÌM KIẾM',
  onClick,
  className = '',
  disabled = false
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`glass-ai-btn h-11 sm:h-12 px-3.5 sm:px-5 flex items-center gap-2 sm:gap-2.5 flex-shrink-0 group ${className}`}
      aria-label={text}
    >
      {/* Top Half Glass Glare & Specular Reflection */}
      <span className="glass-ai-glare" aria-hidden="true" />
      
      {/* Sheen Glint Sweep on Hover */}
      <span className="glass-ai-sheen" aria-hidden="true" />

      {/* Cosmic Galaxy Orb Container with Orbiting Rings */}
      <div className="relative flex items-center justify-center shrink-0 w-8 h-8 sm:w-9 sm:h-9">
        {/* Orbital Ring 1 (Tilted Ellipse) */}
        <span className="glass-ai-ring-1" aria-hidden="true" />

        {/* Orbital Ring 2 (Opposite Tilted Ellipse) */}
        <span className="glass-ai-ring-2" aria-hidden="true" />

        {/* The 3D Galaxy Sphere */}
        <div className="glass-ai-orb">
          {/* Swirling Galaxy Spiral Texture */}
          <svg
            className="glass-ai-vortex opacity-90"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M50 10C27.9 10 10 27.9 10 50C10 65.5 19 79 32 85.5C40 76 38 62 44 52C48 45 56 42 62 47C68 52 66 62 60 68C53 75 42 74 38 80C42 82 46 83 50 83C68.2 83 83 68.2 83 50C83 31.8 68.2 17 50 17"
              stroke="url(#galaxyGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.85"
            />
            <circle cx="50" cy="50" r="4" fill="#38bdf8" />
            <circle cx="38" cy="35" r="1.5" fill="#ffffff" opacity="0.9" />
            <circle cx="62" cy="60" r="1.2" fill="#93c5fd" opacity="0.8" />
            <circle cx="45" cy="65" r="1.5" fill="#38bdf8" opacity="0.8" />
            <defs>
              <linearGradient id="galaxyGradient" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#818cf8" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* 3D Glass Sphere Top-Left Specular Highlight Dot */}
          <span
            className="absolute top-1 left-1.5 w-2 h-1.5 rounded-full bg-white/90 blur-[0.4px] pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Button Typography */}
      <span className="font-heading font-black text-xs sm:text-[13px] tracking-wider text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] whitespace-nowrap">
        {text}
      </span>

      {/* Subtle Vertical Glass Divider */}
      <span
        className="w-[1px] h-4 sm:h-5 bg-gradient-to-b from-transparent via-white/40 to-transparent mx-0.5 shrink-0"
        aria-hidden="true"
      />

      {/* Traced Luminous AI Brain Icon matching ThreeUI Glass AI button */}
      <div className="flex items-center justify-center shrink-0">
        <Brain
          className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-200 glass-ai-brain-icon"
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>
    </button>
  );
}
