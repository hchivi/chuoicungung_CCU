import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * WovenClothFlag
 * A 3D realistic woven cloth flag physics simulation based on Neuform / ThreeUI Verlet sheet,
 * customized specifically for CCU Ngày Hội Chuỗi Cung Ứng.
 *
 * Requirements:
 * - Flag contains ONLY:
 *   1. `logo_only` (/logo_only.png)
 *   2. Text `NGÀY HỘI CHUỖI CUNG ỨNG`
 * - Pinned at top edge, waving with authentic Verlet cloth dynamics and wind turbulence.
 * - Sits right at the boundary between header and hero, directly under BrandLogo (Image 2).
 */
export default function WovenClothFlag({ onClick, className = '' }) {
  const mountRef = useRef(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId = null;
    let isDisposed = false;

    // Cloth mesh dimensions (aspect ratio ~ 1.6 : 1)
    const BW = 4.0;
    const BH = 2.5;
    const GX = 36;
    const GY = 22;

    // Scene & Renderer
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 2), 3));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    container.appendChild(renderer.domElement);

    // Canvas Texture for Cloth Ground & Typography
    const canvas = document.createElement('canvas');
    const W = 1024;
    const H = 640;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    const clothTexture = new THREE.CanvasTexture(canvas);
    clothTexture.colorSpace = THREE.SRGBColorSpace;
    clothTexture.minFilter = THREE.LinearFilter;
    clothTexture.magFilter = THREE.LinearFilter;
    clothTexture.generateMipmaps = false;

    // Draw Flag Texture function
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/logo_only.png';

    function renderFlagTexture() {
      if (!ctx) return;

      // 1. Vibrant Red Textile ground gradient
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#d32f2f'); // Rich vibrant crimson scarlet
      g.addColorStop(0.5, '#c62828');
      g.addColorStop(1, '#9e1418');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // 2. Gold & Yellow Embroidered Hem Borders
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 12;
      ctx.strokeRect(26, 26, W - 52, H - 52);

      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 3;
      ctx.strokeRect(42, 42, W - 84, H - 84);

      // 3. Subtle Weave Thread Grid on Background ONLY (does not touch text or logo)
      ctx.globalAlpha = 0.5;
      for (let yy = 0; yy < H; yy += 4) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, yy + 0.5);
        ctx.lineTo(W, yy + 0.5);
        ctx.stroke();
      }
      for (let xx = 0; xx < W; xx += 4) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xx + 0.5, 0);
        ctx.lineTo(xx + 0.5, H);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // 4. Logo Only (/logo_only.png) - Large, crisp & centered (NO foggy white halo)
      const logoSize = 230;
      const logoX = (W - logoSize) / 2;
      const logoY = 70;

      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 3;
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        ctx.restore();
      }

      // 5. Text: ONLY "NGÀY HỘI CHUỖI CUNG ỨNG" - Extra Large, Razor-Sharp & High Contrast
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Line 1: NGÀY HỘI (Large & bold with dark edge stroke for maximum legibility)
      ctx.font = '900 82px "Space Grotesk", "Montserrat", "Segoe UI", sans-serif';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.lineWidth = 8;
      ctx.lineJoin = 'round';
      ctx.strokeText('NGÀY HỘI', W / 2, 365);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('NGÀY HỘI', W / 2, 365);

      // Line 2: CHUỖI CUNG ỨNG (Large & bold with dark edge stroke)
      ctx.font = '900 96px "Space Grotesk", "Montserrat", "Segoe UI", sans-serif';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.lineWidth = 9;
      ctx.lineJoin = 'round';
      ctx.strokeText('CHUỖI CUNG ỨNG', W / 2, 475);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('CHUỖI CUNG ỨNG', W / 2, 475);



      clothTexture.needsUpdate = true;
    }

    logoImg.onload = () => {
      if (!isDisposed) renderFlagTexture();
    };
    renderFlagTexture();

    // Geometry & Material
    const geo = new THREE.PlaneGeometry(BW, BH, GX, GY);
    const mat = new THREE.MeshPhongMaterial({
      map: clothTexture,
      side: THREE.DoubleSide,
      shininess: 8,
      specular: 0x331a14,
      color: 0xffffff,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Lighting (Crisp key + soft rim + ambient for vibrant red textile)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
    keyLight.position.set(-2.5, 3.5, 3.0);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 0.4);
    rimLight.position.set(2.8, -1.8, 2.2);
    scene.add(rimLight);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);

    function updateCamera() {
      if (!container) return;
      const w = container.clientWidth || 108;
      const h = container.clientHeight || 68;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      const vFit = (BH / 2) / Math.tan((38 * Math.PI) / 360);
      const hFit = (BW / 2) / Math.tan((38 * Math.PI) / 360) / aspect;
      camera.position.set(0, -0.05, Math.max(vFit, hFit) * 1.14 + 0.35);
      camera.lookAt(0, -0.05, 0);
    }
    updateCamera();

    // Verlet Physics Data
    const pos = geo.attributes.position;
    const N = (GX + 1) * (GY + 1);
    const cur = new Float32Array(N * 3);
    const prev = new Float32Array(N * 3);
    const rest = new Float32Array(N * 3);
    const pinned = new Uint8Array(N);

    for (let i = 0; i < N; i++) {
      const ax = pos.getX(i);
      const ay = pos.getY(i);
      const az = 0;
      cur[i * 3] = prev[i * 3] = rest[i * 3] = ax;
      cur[i * 3 + 1] = prev[i * 3 + 1] = rest[i * 3 + 1] = ay;
      cur[i * 3 + 2] = prev[i * 3 + 2] = rest[i * 3 + 2] = az;
    }

    // Top row pinned to top suspension edge!
    for (let ix = 0; ix <= GX; ix++) {
      pinned[ix] = 1;
    }

    const idx = (ix, iy) => ix + iy * (GX + 1);
    const restH = BW / GX;
    const restV = BH / GY;
    const GRAV = -2.8;
    const DAMP = 0.985;
    const DT = 0.016;

    // Wind function with wave travel
    function wind(ix, iy, t, hoverBoost) {
      const cx = ix / GX;
      const cy = iy / GY;
      const speed = hoverBoost ? 2.4 : 1.6;
      const travel = t * speed - cy * 3.8;
      const gust = (hoverBoost ? 1.0 : 0.6) + 0.35 * Math.sin(t * 0.7) + 0.15 * Math.sin(t * 2.1 + 1.2);
      const amp = (hoverBoost ? 4.8 : 3.6) * cy;

      const fz = (Math.sin(travel + cx * 3.2) + 0.45 * Math.sin(travel * 1.8 + cx * 5.8)) * amp * gust;
      const fx = Math.sin(t * 0.9 + cy * 2.0) * (hoverBoost ? 0.8 : 0.5) * cy;
      const fy = -0.35 * cy;
      return [fx, fy, fz];
    }

    function solve(a, b, rl) {
      const ax = cur[a * 3];
      const ay = cur[a * 3 + 1];
      const az = cur[a * 3 + 2];
      const bx = cur[b * 3];
      const by = cur[b * 3 + 1];
      const bz = cur[b * 3 + 2];

      let dx = bx - ax;
      let dy = by - ay;
      let dz = bz - az;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
      const diff = ((d - rl) / d) * 0.5;
      dx *= diff;
      dy *= diff;
      dz *= diff;

      const pa = pinned[a];
      const pb = pinned[b];
      if (!pa && !pb) {
        cur[a * 3] += dx;
        cur[a * 3 + 1] += dy;
        cur[a * 3 + 2] += dz;
        cur[b * 3] -= dx;
        cur[b * 3 + 1] -= dy;
        cur[b * 3 + 2] -= dz;
      } else if (pa && !pb) {
        cur[b * 3] -= dx * 2;
        cur[b * 3 + 1] -= dy * 2;
        cur[b * 3 + 2] -= dz * 2;
      } else if (!pa && pb) {
        cur[a * 3] += dx * 2;
        cur[a * 3 + 1] += dy * 2;
        cur[a * 3 + 2] += dz * 2;
      }
    }

    function physicsStep(t) {
      const hoverBoost = isHoveredRef.current;
      for (let iy = 0; iy <= GY; iy++) {
        for (let ix = 0; ix <= GX; ix++) {
          const i = idx(ix, iy);
          if (pinned[i]) continue;
          const [fx, fy, fz] = wind(ix, iy, t, hoverBoost);
          for (let k = 0; k < 3; k++) {
            const j = i * 3 + k;
            const a = k === 0 ? fx : k === 1 ? fy + GRAV : fz;
            const v = (cur[j] - prev[j]) * DAMP;
            prev[j] = cur[j];
            cur[j] = cur[j] + v + a * DT * DT;
          }
        }
      }

      // Constraint relaxation iterations
      for (let it = 0; it < 3; it++) {
        for (let iy = 0; iy <= GY; iy++) {
          for (let ix = 0; ix < GX; ix++) {
            solve(idx(ix, iy), idx(ix + 1, iy), restH);
          }
        }
        for (let iy = 0; iy < GY; iy++) {
          for (let ix = 0; ix <= GX; ix++) {
            solve(idx(ix, iy), idx(ix, iy + 1), restV);
          }
        }
      }

      // Enforce pinned boundary condition
      for (let ix = 0; ix <= GX; ix++) {
        const i = ix;
        cur[i * 3] = rest[i * 3];
        cur[i * 3 + 1] = rest[i * 3 + 1];
        cur[i * 3 + 2] = rest[i * 3 + 2];
        prev[i * 3] = rest[i * 3];
        prev[i * 3 + 1] = rest[i * 3 + 1];
        prev[i * 3 + 2] = rest[i * 3 + 2];
      }
    }

    function commit() {
      for (let i = 0; i < N; i++) {
        pos.setXYZ(i, cur[i * 3], cur[i * 3 + 1], cur[i * 3 + 2]);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    }

    // Warm-up physics steps so cloth drapes naturally from frame 1
    for (let s = 0; s < 45; s++) physicsStep(s * DT);
    commit();

    let t = 45 * DT;
    let isRunning = true;

    function loop() {
      if (!isRunning || isDisposed) return;
      t += DT;
      physicsStep(t);
      commit();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!isDisposed) updateCamera();
    });
    resizeObserver.observe(container);

    // Visibility change handling
    const onVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        if (animId) cancelAnimationFrame(animId);
      } else {
        if (!isRunning && !isDisposed) {
          isRunning = true;
          animId = requestAnimationFrame(loop);
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      isDisposed = true;
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      resizeObserver.disconnect();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      clothTexture.dispose();
    };
  }, []);

  return (
    <div
      className={`group relative cursor-pointer select-none transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] ${className}`}
      onClick={onClick}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      title="Ngày hội Chuỗi Cung Ứng - Bấm để xem chi tiết"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* 3D WebGL Canvas Container - Sleek compact size sitting snug under logo without covering text */}
      <div
        ref={mountRef}
        className="w-[88px] h-[55px] sm:w-[98px] sm:h-[61px] lg:w-[108px] lg:h-[68px] overflow-visible drop-shadow-md"
      />

      {/* Subtle Hover Pulse Badge */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
        <span className="px-2 py-0.5 rounded-full bg-[#072348]/90 text-amber-300 text-[10px] font-bold tracking-tight shadow-md backdrop-blur-sm border border-amber-400/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Bấm để xem sự kiện</span>
        </span>
      </div>
    </div>
  );
}
