import React, { useState, useEffect, useRef } from 'react';

const DIRECTIONS = [
  'up-left',
  'up',
  'up-right',
  'left',
  'center',
  'right',
  'down-left',
  'down',
  'down-right',
];

const REACTIONS = [
  'blink',
  'heart',
  'sparkle',
  'surprised',
  'wink',
  'bashful',
  'sleepy',
  'dizzy',
  'delighted',
];

const CLOCKWISE = [
  'right',
  'down-right',
  'down',
  'down-left',
  'left',
  'up-left',
  'up',
  'up-right',
];
const SECTOR = (Math.PI * 2) / CLOCKWISE.length;
const HYSTERESIS = 0.12;
const DEAD_ZONE = 60;

const PAYOFFS = ['heart', 'sparkle', 'delighted'];
const BOOP_PAYOFF = 120;
const BOOP_END = 560;
const SQUASH_MS = 420;
const DIZZY_AFTER = 4;
const DIZZY_WINDOW = 1600;
const DIZZY_END = 1100;

const SQUASH = [
  { transform: 'scale(1, 1)', easing: 'ease-in' },
  { transform: 'scale(1.10, 0.86)', offset: 0.18, easing: 'ease-out' },
  { transform: 'scale(0.95, 1.08)', offset: 0.45, easing: 'ease-in-out' },
  { transform: 'scale(1.03, 0.97)', offset: 0.72, easing: 'ease-in-out' },
  { transform: 'scale(1, 1)' },
];

function cell(index) {
  return { backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%` };
}

function wrap(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

const layer = {
  position: 'absolute',
  inset: 0,
  backgroundSize: '300% 300%',
  backgroundRepeat: 'no-repeat',
};

const SUPPLI_ASSETS = {
  name: 'SUPPI',
  directions: '/mascots/suppi-directions.webp?v=8',
  reactions: '/mascots/suppi-reactions.webp?v=8',
};

const CHAINY_ASSETS = {
  name: 'CHAINY',
  directions: '/mascots/chainy-directions.webp?v=8',
  reactions: '/mascots/chainy-reactions.webp?v=8',
};

export default function DualMascotInteractive({ 
  size = 145, 
  showBadges = false,
  showSpeechBubbles = true,
  spacingClassName = "-space-x-10 sm:-space-x-12",
  onSuppiClick,
  onChainyClick
}) {
  // Initial orientations: focused at laptop (SUPPI looks down-left, CHAINY looks down-right)
  const [directionSuppli, setDirectionSuppli] = useState('down-left');
  const [reactionSuppli, setReactionSuppli] = useState(null);

  const [directionChainy, setDirectionChainy] = useState('down-right');
  const [reactionChainy, setReactionChainy] = useState(null);

  const containerRef = useRef(null);
  const suppliButtonRef = useRef(null);
  const chainyButtonRef = useRef(null);
  const suppliSquashRef = useRef(null);
  const chainySquashRef = useRef(null);

  const hasMovedRef = useRef(false);
  const sectorRef = useRef(-1);
  const idleTimerRef = useRef(null);
  const timersRef = useRef([]);
  const boopsSuppliRef = useRef({ count: 0, at: 0 });
  const boopsChainyRef = useRef({ count: 0, at: 0 });

  // 9-Direction Synchronized Cursor Tracking for BOTH Mascots
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    let pointer = null;

    const resetToWorkingAngle = () => {
      sectorRef.current = -1;
      setDirectionSuppli('down-left');
      setDirectionChainy('down-right');
    };

    const aim = () => {
      if (!pointer || !hasMovedRef.current) return;

      const container = containerRef.current;
      if (container) {
        const box = container.getBoundingClientRect();
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height / 2;
        const dx = pointer.x - cx;
        const dy = pointer.y - cy;

        if (Math.hypot(dx, dy) < DEAD_ZONE) {
          sectorRef.current = -1;
          setDirectionSuppli('center');
          setDirectionChainy('center');
        } else {
          const angle = Math.atan2(dy, dx);
          const currSector = sectorRef.current;
          if (currSector === -1 || Math.abs(wrap(angle - currSector * SECTOR)) >= SECTOR / 2 + HYSTERESIS) {
            const nextSector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
            sectorRef.current = nextSector;
            const nextDir = CLOCKWISE[nextSector];
            setDirectionSuppli(nextDir);
            setDirectionChainy(nextDir);
          }
        }
      }
    };

    const onPointerMove = (event) => {
      hasMovedRef.current = true;
      pointer = { x: event.clientX, y: event.clientY };
      aim();

      // Reset to focused laptop positions after 3s of no mouse activity
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(resetToWorkingAngle, 3000);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', aim, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', aim);
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(window.clearTimeout);
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  // Individual Boop Squash & Reaction Handlers
  const handleBoopSuppli = (e) => {
    e?.stopPropagation?.();
    const now = Date.now();
    const boops = boopsSuppliRef.current;
    boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1;
    boops.at = now;

    const later = (ms, next) => {
      timersRef.current.push(window.setTimeout(() => setReactionSuppli(next), ms));
    };

    if (boops.count >= DIZZY_AFTER) {
      boops.count = 0;
      setReactionSuppli('dizzy');
      later(DIZZY_END, null);
    } else {
      setReactionSuppli('blink');
      later(BOOP_PAYOFF, PAYOFFS[(boops.count - 1) % PAYOFFS.length]);
      later(BOOP_END, null);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      suppliSquashRef.current?.animate(SQUASH, { duration: SQUASH_MS, easing: 'linear' });
    }

    if (onSuppiClick) onSuppiClick();
  };

  const handleBoopChainy = (e) => {
    e?.stopPropagation?.();
    const now = Date.now();
    const boops = boopsChainyRef.current;
    boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1;
    boops.at = now;

    const later = (ms, next) => {
      timersRef.current.push(window.setTimeout(() => setReactionChainy(next), ms));
    };

    if (boops.count >= DIZZY_AFTER) {
      boops.count = 0;
      setReactionChainy('dizzy');
      later(DIZZY_END, null);
    } else {
      setReactionChainy('blink');
      later(BOOP_PAYOFF, PAYOFFS[(boops.count - 1) % PAYOFFS.length]);
      later(BOOP_END, null);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      chainySquashRef.current?.animate(SQUASH, { duration: SQUASH_MS, easing: 'linear' });
    }

    if (onChainyClick) onChainyClick();
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Mascots Side by Side with breathing space */}
      <div 
        ref={containerRef}
        className={`flex items-end justify-center ${spacingClassName}`}
      >
        {/* SUPPI (LEFT) */}
        <div className="relative flex flex-col items-center">
          {/* Chat bubble above SUPPI (tách xa ra ngoài, ngay phần màu đỏ của tóc Suppi bên trái) */}
          {showSpeechBubbles && (
            <div className="absolute -top-9 sm:-top-10 left-1/2 -translate-x-[92%] z-20 pointer-events-none select-none">
              <div className="relative px-3.5 py-1.5 rounded-2xl bg-gradient-to-b from-[#1d4ed8] via-[#2563eb] to-[#0284c7] text-white shadow-lg shadow-blue-600/30 border border-white/25 text-center flex flex-col items-center justify-center min-w-[108px]">
                <span className="font-black text-xs sm:text-[13px] tracking-wide text-white uppercase leading-tight drop-shadow-xs">
                  SUPPI
                </span>
                <span className="text-[10.5px] sm:text-[11.5px] font-semibold text-blue-50 leading-tight whitespace-nowrap drop-shadow-xs">
                  tìm đúng nguồn
                </span>
                {/* Speech tail trỏ thẳng xuống lọn tóc đỏ bên trái của Suppi */}
                <svg 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2.5 text-[#0284c7]" 
                  viewBox="0 0 16 10" 
                  fill="currentColor"
                >
                  <path d="M0 0 L8 10 L16 0 Z" />
                </svg>
              </div>
            </div>
          )}

          <button
            ref={suppliButtonRef}
            type="button"
            onClick={handleBoopSuppli}
            aria-label="Tương tác với linh vật SUPPI"
            className="relative cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95 z-0"
            style={{
              width: size,
              height: size,
              padding: 0,
              border: 0,
              background: 'transparent',
              appearance: 'none',
              userSelect: 'none',
            }}
          >
            {/* Squash & Stretch Span */}
            <span
              ref={suppliSquashRef}
              style={{
                position: 'relative',
                display: 'block',
                width: '100%',
                height: '100%',
                transformOrigin: '50% 80%',
              }}
            >
              {/* Directions Layer */}
              <span
                style={{
                  ...layer,
                  backgroundImage: `url(${SUPPLI_ASSETS.directions})`,
                  ...cell(DIRECTIONS.indexOf(directionSuppli)),
                  opacity: reactionSuppli ? 0 : 1,
                  filter: 'drop-shadow(0 10px 18px rgba(7,35,72,0.22))',
                }}
              />

              {/* Reactions Layer */}
              <span
                style={{
                  ...layer,
                  backgroundImage: `url(${SUPPLI_ASSETS.reactions})`,
                  ...cell(REACTIONS.indexOf(reactionSuppli ?? 'blink')),
                  opacity: reactionSuppli ? 1 : 0,
                  filter: 'drop-shadow(0 10px 18px rgba(7,35,72,0.22))',
                }}
              />
            </span>
          </button>
        </div>

        {/* CHAINY (RIGHT) */}
        <div className="relative flex flex-col items-center">
          {/* Chat bubble above CHAINY (tách xa ra ngoài, ngay phần màu xanh lá của tóc Chainy bên phải) */}
          {showSpeechBubbles && (
            <div className="absolute -top-9 sm:-top-10 left-1/2 -translate-x-[8%] z-20 pointer-events-none select-none">
              <div className="relative px-3.5 py-1.5 rounded-2xl bg-gradient-to-b from-[#e11d48] via-[#f43f5e] to-[#fb7185] text-white shadow-lg shadow-pink-600/30 border border-white/25 text-center flex flex-col items-center justify-center min-w-[108px]">
                <span className="font-black text-xs sm:text-[13px] tracking-wide text-white uppercase leading-tight drop-shadow-xs">
                  CHAINY
                </span>
                <span className="text-[10.5px] sm:text-[11.5px] font-semibold text-pink-50 leading-tight whitespace-nowrap drop-shadow-xs">
                  kết nối đến cùng
                </span>
                {/* Speech tail trỏ thẳng xuống lọn tóc xanh lá bên phải của Chainy */}
                <svg 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2.5 text-[#fb7185]" 
                  viewBox="0 0 16 10" 
                  fill="currentColor"
                >
                  <path d="M0 0 L8 10 L16 0 Z" />
                </svg>
              </div>
            </div>
          )}

          <button
            ref={chainyButtonRef}
            type="button"
            onClick={handleBoopChainy}
            aria-label="Tương tác với linh vật CHAINY"
            className="relative cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95 z-10"
            style={{
              width: size,
              height: size,
              padding: 0,
              border: 0,
              background: 'transparent',
              appearance: 'none',
              userSelect: 'none',
            }}
          >
            {/* Squash & Stretch Span */}
            <span
              ref={chainySquashRef}
              style={{
                position: 'relative',
                display: 'block',
                width: '100%',
                height: '100%',
                transformOrigin: '50% 80%',
              }}
            >
              {/* Directions Layer */}
              <span
                style={{
                  ...layer,
                  backgroundImage: `url(${CHAINY_ASSETS.directions})`,
                  ...cell(DIRECTIONS.indexOf(directionChainy)),
                  opacity: reactionChainy ? 0 : 1,
                  filter: 'drop-shadow(0 10px 18px rgba(7,35,72,0.22))',
                }}
              />

              {/* Reactions Layer */}
              <span
                style={{
                  ...layer,
                  backgroundImage: `url(${CHAINY_ASSETS.reactions})`,
                  ...cell(REACTIONS.indexOf(reactionChainy ?? 'blink')),
                  opacity: reactionChainy ? 1 : 0,
                  filter: 'drop-shadow(0 10px 18px rgba(7,35,72,0.22))',
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Badges below Mascots (Optional, hidden by default per user request) */}
      {showBadges && (
        <div className="flex items-center justify-center -space-x-2 mt-2 pt-0.5">
          <span className="px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[11px] sm:text-xs font-bold shadow-2xs z-0">
            SUPPI • Tìm đúng nguồn
          </span>
          <span className="px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-[11px] sm:text-xs font-bold shadow-2xs z-10">
            CHAINY • Theo việc đến cùng
          </span>
        </div>
      )}
    </div>
  );
}

