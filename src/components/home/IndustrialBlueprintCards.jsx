import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';

export default function IndustrialBlueprintCards() {
  const containerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Animated counters
  const [counts, setCounts] = useState({
    factories: 0,
    suppliers: 0,
    hubs: 0,
  });

  // 1. GSAP Counter Animation on viewport reveal
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          hasAnimated = true;

          const counterObj = { f: 0, s: 0, h: 0 };
          gsap.to(counterObj, {
            f: 450,
            s: 2850,
            h: 63,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: () => {
              setCounts({
                factories: Math.floor(counterObj.f),
                suppliers: Math.floor(counterObj.s),
                hubs: Math.floor(counterObj.h),
              });
            },
          });
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2. Three.js Blueprint Coordinate Grid & Particle Wave Field
  useEffect(() => {
    const mount = canvasContainerRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 1200;
    const height = mount.clientHeight || 500;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 35, 65);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    // Particle Grid Construction (Swiss Blueprint Lattice)
    const cols = 56;
    const rows = 28;
    const numParticles = cols * rows;
    const positions = new Float32Array(numParticles * 3);
    const originalPositions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    const xSpacing = 1.8;
    const zSpacing = 1.8;
    const xOffset = ((cols - 1) * xSpacing) / 2;
    const zOffset = ((rows - 1) * zSpacing) / 2;

    const baseColor = new THREE.Color('#cbd5e1'); // Slate-300 neutral blueprint
    const blueColor = new THREE.Color('#2563eb'); // FDI Sourcing Blue
    const greenColor = new THREE.Color('#059669'); // Supplier Emerald
    const purpleColor = new THREE.Color('#7c3aed'); // Nexus Violet

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const idx = (i * rows + j) * 3;
        const x = i * xSpacing - xOffset;
        const y = 0;
        const z = j * zSpacing - zOffset;

        positions[idx] = x;
        positions[idx + 1] = y;
        positions[idx + 2] = z;

        originalPositions[idx] = x;
        originalPositions[idx + 1] = y;
        originalPositions[idx + 2] = z;

        colors[idx] = baseColor.r;
        colors[idx + 1] = baseColor.g;
        colors[idx + 2] = baseColor.b;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circle texture for smooth particles
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 2, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    // Subtle Architectural Wireframe Ground Grid
    const gridHelper = new THREE.GridHelper(100, 30, 0x94a3b8, 0xe2e8f0);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Animation variables
    let clock = new THREE.Clock();
    let isVisible = true;
    let animId = null;

    // Viewport Intersection Observer (Performance Optimization)
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(mount);

    // Animation Loop
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();
      const posAttr = geometry.attributes.position;
      const colAttr = geometry.attributes.color;

      // Target attraction center based on hovered card
      let targetX = null;
      let targetColor = baseColor;
      if (hoveredIndex === 0) {
        targetX = -28; // Left (Card 1)
        targetColor = blueColor;
      } else if (hoveredIndex === 1) {
        targetX = 0; // Center (Card 2)
        targetColor = greenColor;
      } else if (hoveredIndex === 2) {
        targetX = 28; // Right (Card 3)
        targetColor = purpleColor;
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = (i * rows + j) * 3;
          const ox = originalPositions[idx];
          const oz = originalPositions[idx + 2];

          // Natural CAD Blueprint Sine Wave
          let wave = Math.sin(ox * 0.15 + elapsedTime * 1.5) * Math.cos(oz * 0.15 + elapsedTime * 1.2) * 1.8;

          // If a card is hovered, attract nearby particles toward the card node
          if (targetX !== null) {
            const dist = Math.hypot(ox - targetX, oz);
            if (dist < 32) {
              const pullFactor = (1 - dist / 32) * 4.5;
              wave += Math.sin(dist * 0.5 - elapsedTime * 4) * pullFactor;

              // Lerp particle color toward active theme
              colAttr.array[idx] += (targetColor.r - colAttr.array[idx]) * 0.08;
              colAttr.array[idx + 1] += (targetColor.g - colAttr.array[idx + 1]) * 0.08;
              colAttr.array[idx + 2] += (targetColor.b - colAttr.array[idx + 2]) * 0.08;
            } else {
              // Return to base color
              colAttr.array[idx] += (baseColor.r - colAttr.array[idx]) * 0.04;
              colAttr.array[idx + 1] += (baseColor.g - colAttr.array[idx + 1]) * 0.04;
              colAttr.array[idx + 2] += (baseColor.b - colAttr.array[idx + 2]) * 0.04;
            }
          } else {
            // Idle return to base color
            colAttr.array[idx] += (baseColor.r - colAttr.array[idx]) * 0.05;
            colAttr.array[idx + 1] += (baseColor.g - colAttr.array[idx + 1]) * 0.05;
            colAttr.array[idx + 2] += (baseColor.b - colAttr.array[idx + 2]) * 0.05;
          }

          posAttr.array[idx + 1] = wave;
        }
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, [hoveredIndex]);

  // 3. GSAP 3D Interactive Gyroscope Tilt on Hover
  const handleMouseMove = (e, index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotationY: x * 8,
      rotationX: -y * 8,
      transformPerspective: 1200,
      ease: 'power2.out',
      duration: 0.35,
    });
  };

  const handleMouseLeave = (index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      ease: 'power2.out',
      duration: 0.6,
    });
  };

  return (
    <div ref={containerRef} className="relative py-4">
      {/* Three.js Shared Blueprint Coordinate Grid Canvas */}
      <div
        ref={canvasContainerRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-45 overflow-hidden z-0"
      />

      {/* 3 Swiss Industrial Brutalist Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* CARD 01: DÀNH CHO NHÀ MÁY / FDI */}
        <div
          ref={(el) => (cardRefs.current[0] = el)}
          onMouseEnter={() => setHoveredIndex(0)}
          onMouseLeave={() => {
            setHoveredIndex(null);
            handleMouseLeave(0);
          }}
          onMouseMove={(e) => handleMouseMove(e, 0)}
          className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-blue-500/80 transition-all duration-300 flex flex-col justify-between space-y-5 group relative overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Swiss Blueprint Registration Crosshairs */}
          <span className="absolute top-2.5 left-3 text-[10px] font-mono text-slate-300 font-bold select-none group-hover:text-blue-500 transition-colors">+</span>
          <span className="absolute top-2.5 right-3 text-[10px] font-mono text-slate-300 font-bold select-none group-hover:text-blue-500 transition-colors">+</span>
          <span className="absolute bottom-2.5 left-3 text-[10px] font-mono text-slate-300 font-bold select-none group-hover:text-blue-500 transition-colors">+</span>
          <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-slate-300 font-bold select-none group-hover:text-blue-500 transition-colors">+</span>

          <div className="space-y-4">
            {/* Context Image Showcase with Role Badge */}
            <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs">
              <img
                src="/images/roles/hero_card_factory_sourcing.jpg"
                alt="Nhà máy & FDI hoạt động"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-blue-700 border border-white/60 text-[11px] font-mono font-bold uppercase shadow-xs">
                  Dành cho Nhà máy / FDI
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-950 uppercase font-heading leading-snug group-hover:text-[#0052cc] transition-colors">
                TÔI ĐANG CẦN NGUỒN CUNG
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
                Bạn có một nhu cầu mua sắm cụ thể? SUPPI giúp bạn làm rõ yêu cầu, chuẩn hóa tiêu chí và tìm nguồn có năng lực thực tế phù hợp.
              </p>
            </div>

            {/* Metric Counter Strip */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Nhà máy & FDI hoạt động:</span>
              <span className="font-mono font-bold text-sm text-blue-600">
                {counts.factories}+ đơn vị
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            to="/tro-ly-ai?role=factory&intent=sourcing"
            className="w-full inline-flex items-center justify-between p-3.5 rounded-2xl bg-blue-50 hover:bg-[#0052cc] text-[#0052cc] hover:text-white font-bold text-xs sm:text-sm font-heading transition-all shadow-2xs group-hover:shadow-lg group-hover:shadow-blue-900/10 active:scale-[0.98]"
          >
            <span>Bắt đầu với SUPPI</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* CARD 02: DÀNH CHO NHÀ CUNG ỨNG */}
        <div
          ref={(el) => (cardRefs.current[1] = el)}
          onMouseEnter={() => setHoveredIndex(1)}
          onMouseLeave={() => {
            setHoveredIndex(null);
            handleMouseLeave(1);
          }}
          onMouseMove={(e) => handleMouseMove(e, 1)}
          className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-emerald-500/80 transition-all duration-300 flex flex-col justify-between space-y-5 group relative overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Swiss Blueprint Registration Crosshairs */}
          <span className="absolute top-2.5 left-3 text-[10px] font-mono text-slate-300 font-bold select-none group-hover:text-emerald-500 transition-colors">+</span>
          <span className="absolute top-2.5 right-3 text-[10px] font-mono text-slate-300 font-bold select-none group-hover:text-emerald-500 transition-colors">+</span>
          <span className="absolute bottom-2.5 left-3 text-[10px] font-mono text-slate-300 font-bold select-none group-hover:text-emerald-500 transition-colors">+</span>
          <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-slate-300 font-bold select-none group-hover:text-emerald-500 transition-colors">+</span>

          <div className="space-y-4">
            {/* Context Image Showcase with Role Badge */}
            <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs">
              <img
                src="/images/roles/hero_card_supplier_cnc.jpg"
                alt="Nhà cung ứng phụ trợ"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-emerald-700 border border-white/60 text-[11px] font-mono font-bold uppercase shadow-xs">
                  Dành cho Nhà cung ứng
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-950 uppercase font-heading leading-snug group-hover:text-emerald-600 transition-colors">
                TÔI MUỐN TÌM KHÁCH HÀNG
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
                Doanh nghiệp bạn có sản phẩm, máy móc hoặc năng lực cung ứng? Chuẩn hóa hồ sơ năng lực để SUPPI tự động ghép nối với các cơ hội mua sắm.
              </p>
            </div>

            {/* Metric Counter Strip */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Hồ sơ nhà xưởng phụ trợ:</span>
              <span className="font-mono font-bold text-sm text-emerald-600">
                {counts.suppliers}+ doanh nghiệp
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            to="/tao-ho-so"
            className="w-full inline-flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs sm:text-sm font-heading transition-all shadow-2xs group-hover:shadow-lg group-hover:shadow-emerald-900/10 active:scale-[0.98]"
          >
            <span>Giới thiệu năng lực</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* CARD 03: DÀNH CHO KCN & HIỆP HỘI */}
        <div
          ref={(el) => (cardRefs.current[2] = el)}
          onMouseEnter={() => setHoveredIndex(2)}
          onMouseLeave={() => {
            setHoveredIndex(null);
            handleMouseLeave(2);
          }}
          onMouseMove={(e) => handleMouseMove(e, 2)}
          className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-purple-500/80 transition-all duration-300 flex flex-col justify-between space-y-5 group relative overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Swiss Blueprint Registration Crosshairs */}
          <span className="absolute top-2.5 left-3 text-[10px] font-mono text-slate-300 font-bold select-none group-hover:text-purple-500 transition-colors">+</span>
          <span className="absolute top-2.5 right-3 text-[10px] font-mono text-slate-300 font-bold select-none group-hover:text-purple-500 transition-colors">+</span>
          <span className="absolute bottom-2.5 left-3 text-[10px] font-mono text-slate-300 font-bold select-none group-hover:text-purple-500 transition-colors">+</span>
          <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-slate-300 font-bold select-none group-hover:text-purple-500 transition-colors">+</span>

          <div className="space-y-4">
            {/* Context Image Showcase with Role Badge */}
            <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs">
              <img
                src="/images/roles/hero_card_ecosystem_kcn.jpg"
                alt="KCN & Hiệp hội kết nối"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-purple-700 border border-white/60 text-[11px] font-mono font-bold uppercase shadow-xs">
                  Dành cho KCN & Hiệp hội
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-950 uppercase font-heading leading-snug group-hover:text-purple-600 transition-colors">
                TÔI MUỐN TỔ CHỨC KẾT NỐI
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
                Dành cho Hội, Hiệp hội, Ban quản lý KCN. Thu thập nhu cầu nhà máy, tìm nguồn cung phụ trợ, tổ chức phiên gặp gỡ và theo việc đến kết quả.
              </p>
            </div>

            {/* Metric Counter Strip */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Mạng lưới kết nối diện rộng:</span>
              <span className="font-mono font-bold text-sm text-purple-600">
                {counts.hubs} tỉnh thành & KCN
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            to="/dich-vu/to-chuc-ket-noi"
            className="w-full inline-flex items-center justify-between p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold text-xs sm:text-sm font-heading transition-all shadow-2xs group-hover:shadow-lg group-hover:shadow-purple-900/10 active:scale-[0.98]"
          >
            <span>Đề xuất chương trình</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
