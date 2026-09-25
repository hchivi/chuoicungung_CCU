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
const DEAD_ZONE = 70;

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

const MASCOTS = {
  suppli: {
    id: 'suppli',
    name: 'SUPPLI',
    directions: '/mascots/suppli-directions.webp?v=6',
    reactions: '/mascots/suppli-reactions.webp?v=6',
  },
  chainy: {
    id: 'chainy',
    name: 'CHAINY',
    directions: '/mascots/chainy-directions.webp?v=6',
    reactions: '/mascots/chainy-reactions.webp?v=6',
  },
};

export default function SuppliMascot() {
  const [character, setCharacter] = useState('suppli'); // 'suppli' | 'chainy'
  const [direction, setDirection] = useState('center');
  const [reaction, setReaction] = useState(null);

  const buttonRef = useRef(null);
  const squashRef = useRef(null);
  const timersRef = useRef([]);
  const boopsRef = useRef({ count: 0, at: 0 });

  const activeMascot = MASCOTS[character] || MASCOTS.suppli;

  // 9-Direction Cursor Tracking (Koboyo Page-Mascot Engine)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    let sector = -1;
    let pointer = null;

    const aim = () => {
      const button = buttonRef.current;
      if (!button || !pointer) {
        return;
      }

      const box = button.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);

      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        sector = -1;
        setDirection('center');
        return;
      }

      // Hold current sector until pointer crosses edge + hysteresis
      const angle = Math.atan2(dy, dx);
      if (sector !== -1 && Math.abs(wrap(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS) {
        return;
      }

      sector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
      setDirection(CLOCKWISE[sector]);
    };

    const onPointerMove = (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      aim();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', aim, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', aim);
    };
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(window.clearTimeout);
    };
  }, []);

  // Click Poke Interaction (Boop squash & cute expressions)
  const handleBoop = () => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];

    const later = (ms, next) => {
      timersRef.current.push(window.setTimeout(() => setReaction(next), ms));
    };

    const now = Date.now();
    const boops = boopsRef.current;
    boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1;
    boops.at = now;

    if (boops.count >= DIZZY_AFTER) {
      boops.count = 0;
      setReaction('dizzy');
      later(DIZZY_END, null);
    } else {
      setReaction('blink');
      later(BOOP_PAYOFF, PAYOFFS[(boops.count - 1) % PAYOFFS.length]);
      later(BOOP_END, null);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      squashRef.current?.animate(SQUASH, { duration: SQUASH_MS, easing: 'linear' });
    }
  };

  return (
    <aside 
      aria-label="Linh vật tương tác Chuỗi Cung Ứng"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 select-none print:hidden flex flex-col items-end pointer-events-none"
    >
      {/* MASCOT SPRITE CONTAINER */}
      <div className="pointer-events-auto relative flex flex-col items-center">
        {/* Real 3x3 Koboyo Sprite Engine Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleBoop}
          aria-label={`Tương tác với linh vật ${activeMascot.name}`}
          className="relative cursor-pointer focus:outline-none"
          style={{
            width: 130,
            height: 130,
            padding: 0,
            border: 0,
            background: 'transparent',
            appearance: 'none',
            userSelect: 'none',
          }}
        >
          {/* Soft Ambient Ground Shadow */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-3 bg-slate-900/15 rounded-full blur-xs pointer-events-none scale-y-50"></div>

          {/* Squash & Stretch Animation Span */}
          <span
            ref={squashRef}
            style={{
              position: 'relative',
              display: 'block',
              width: '100%',
              height: '100%',
              transformOrigin: '50% 78%',
            }}
          >
            {/* 1. Directions 3x3 Layer (Swaps 9 head turns smoothly) */}
            <span
              style={{
                ...layer,
                backgroundImage: `url(${activeMascot.directions})`,
                ...cell(DIRECTIONS.indexOf(direction)),
                opacity: reaction ? 0 : 1,
                filter: 'drop-shadow(0 10px 14px rgba(7,35,72,0.22))',
              }}
            />

            {/* 2. Reactions 3x3 Layer (Blinks, hearts, dizzy on click) */}
            <span
              style={{
                ...layer,
                backgroundImage: `url(${activeMascot.reactions})`,
                ...cell(REACTIONS.indexOf(reaction ?? 'blink')),
                opacity: reaction ? 1 : 0,
                filter: 'drop-shadow(0 10px 14px rgba(7,35,72,0.22))',
              }}
            />
          </span>
        </button>

        {/* Mascot Switcher Pill at the Bottom */}
        <div className="mt-0.5 flex items-center bg-[#072348]/90 backdrop-blur-md p-0.5 rounded-full border border-blue-400/40 shadow-lg shadow-blue-950/30">
          <button
            type="button"
            onClick={() => {
              if (character !== 'suppli') {
                setCharacter('suppli');
                setReaction(null);
              }
            }}
            className={`px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full flex items-center gap-1 transition-all duration-200 cursor-pointer ${
              character === 'suppli'
                ? 'bg-gradient-to-r from-[#003875] to-[#0066ee] text-white shadow-md shadow-blue-900/40'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {character === 'suppli' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
            <span>SUPPLI</span>
          </button>

          <span className="text-white/20 select-none text-[10px] px-0.5">|</span>

          <button
            type="button"
            onClick={() => {
              if (character !== 'chainy') {
                setCharacter('chainy');
                setReaction(null);
              }
            }}
            className={`px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full flex items-center gap-1 transition-all duration-200 cursor-pointer ${
              character === 'chainy'
                ? 'bg-gradient-to-r from-[#9d174d] to-[#ec4899] text-white shadow-md shadow-pink-900/40'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {character === 'chainy' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
            <span>CHAINY</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
