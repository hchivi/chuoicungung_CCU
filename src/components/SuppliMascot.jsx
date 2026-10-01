import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

// Clockwise from the right, matching atan2 with y pointing down.
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

export default function SuppliMascot() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide floating mascot on AI Workspace page or TODZUNG portfolio page
  const isHiddenPage = 
    location.pathname.startsWith('/tro-ly-ai') || 
    location.pathname.startsWith('/ai') ||
    location.pathname.startsWith('/todzung');

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
  // Initially and after 3s of no mouse movement: SUPPI looks down-left, CHAINY looks down-right at laptops.
  // When mouse moves: both mascots look up and track the cursor together in unison.
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
  };

  const handleBoopBoth = () => {
    handleBoopSuppli();
    handleBoopChainy();
  };

  if (isHiddenPage) {
    return null;
  }


  return (
    <aside 
      aria-label="Linh vật tương tác SUPPI & CHAINY"
      onClick={() => {
        handleBoopBoth();
        navigate('/tro-ly-ai');
      }}
      title="Nhấn để trò chuyện cùng Trợ lý AI SUPPI & CHAINY"
      className="fixed bottom-1 right-1 sm:bottom-3 sm:right-3 z-50 select-none print:hidden flex flex-col items-center pointer-events-auto cursor-pointer transition-all duration-300 ease-out origin-bottom-right scale-[0.52] sm:scale-[0.62] sm:hover:scale-[0.78] hover:scale-[0.56] active:scale-50 sm:active:scale-[0.60] opacity-90 hover:opacity-100 group"
    >
      {/* Mascots Container */}
      <div className="relative">

        {/* 1. DUAL MASCOTS CONTAINER (STANDING CLOSER SIDE-BY-SIDE WITHOUT GROUND SHADOWS) */}
        <div 
          ref={containerRef}
          className="pointer-events-auto flex items-end justify-center -space-x-9 sm:-space-x-10 cursor-pointer"
        >
        
        {/* SUPPI (LEFT) */}
        <button
          ref={suppliButtonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleBoopSuppli(e);
            navigate('/tro-ly-ai');
          }}
          aria-label="Tương tác với linh vật SUPPI"
          className="relative cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95 z-0"
          style={{
            width: 105,
            height: 105,
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
                filter: 'drop-shadow(0 8px 12px rgba(7,35,72,0.25))',
              }}
            />

            {/* Reactions Layer */}
            <span
              style={{
                ...layer,
                backgroundImage: `url(${SUPPLI_ASSETS.reactions})`,
                ...cell(REACTIONS.indexOf(reactionSuppli ?? 'blink')),
                opacity: reactionSuppli ? 1 : 0,
                filter: 'drop-shadow(0 8px 12px rgba(7,35,72,0.25))',
              }}
            />
          </span>
        </button>

        {/* CHAINY (RIGHT) */}
        <button
          ref={chainyButtonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleBoopChainy(e);
            navigate('/tro-ly-ai');
          }}
          aria-label="Tương tác với linh vật CHAINY"
          className="relative cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95 z-10"
          style={{
            width: 105,
            height: 105,
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
                filter: 'drop-shadow(0 8px 12px rgba(7,35,72,0.25))',
              }}
            />

            {/* Reactions Layer */}
            <span
              style={{
                ...layer,
                backgroundImage: `url(${CHAINY_ASSETS.reactions})`,
                ...cell(REACTIONS.indexOf(reactionChainy ?? 'blink')),
                opacity: reactionChainy ? 1 : 0,
                filter: 'drop-shadow(0 8px 12px rgba(7,35,72,0.25))',
              }}
            />
          </span>
        </button>
      </div>
      </div>

      {/* 2. CHAT TEXT (NO BACKGROUND / FRAMELESS / SÁT CHÂN MASCOTS) */}
      <div className="-mt-3.5 sm:-mt-4 flex items-center justify-center gap-1.5 select-none pointer-events-none transition-transform duration-200 group-hover:scale-105">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0 shadow-sm" />
        <span 
          className="text-xs sm:text-[13px] font-black tracking-wider whitespace-nowrap"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.95)) drop-shadow(0 1px 3px rgba(15, 23, 42, 0.25))'
          }}
        >
          <span className="text-[#0055d4]">SUPPI</span>
          <span className="text-slate-600 mx-1 font-extrabold">&</span>
          <span className="text-[#e11d48]">CHAINY</span>
        </span>
      </div>
    </aside>
  );
}
