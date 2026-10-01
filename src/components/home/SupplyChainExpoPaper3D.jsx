import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

export default function SupplyChainExpoPaper3D() {
  const navigate = useNavigate();
  const canvasMountRef = useRef(null);
  const containerRef = useRef(null);

  // State refs for animation without triggering re-renders
  const stateRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    paperMesh: null,
    pointLight: null,
    texture: null,
    animationFrameId: null,
    pointer: { x: 0, y: 0, targetX: 0, targetY: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    rotation: { x: 0, y: 0, targetX: 0, targetY: 0 }
  });

  // 1. Generate High-Res 2D Canvas Texture (Bright, Luminous Porcelain, Centered Title with Logo)
  const createPaperTexture = (onLogoLoaded) => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2800; // 1 : 1.36 aspect ratio
    const ctx = canvas.getContext('2d');

    const drawContent = (logoImg = null) => {
      // Base background: Crisp porcelain white with ultra-subtle pearl gradient
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const radGrad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.45, 100,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.8
      );
      radGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      radGrad.addColorStop(1, 'rgba(244, 247, 251, 0.95)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Fine architectural grid lines
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
      ctx.lineWidth = 1.5;
      const gridSize = 64;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Elegant double border (Hardware edge)
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
      ctx.lineWidth = 5;
      ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

      ctx.strokeStyle = 'rgba(0, 82, 204, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

      // Corner bracket accents
      const bracketSize = 40;
      ctx.fillStyle = '#0052cc';
      // Top-Left
      ctx.fillRect(36, 36, bracketSize, 4);
      ctx.fillRect(36, 36, 4, bracketSize);
      // Top-Right
      ctx.fillRect(canvas.width - 36 - bracketSize, 36, bracketSize, 4);
      ctx.fillRect(canvas.width - 40, 36, 4, bracketSize);
      // Bottom-Left
      ctx.fillRect(36, canvas.height - 40, bracketSize, 4);
      ctx.fillRect(36, canvas.height - 36 - bracketSize, 4, bracketSize);
      // Bottom-Right
      ctx.fillRect(canvas.width - 36 - bracketSize, canvas.height - 40, bracketSize, 4);
      ctx.fillRect(canvas.width - 40, canvas.height - 36 - bracketSize, 4, bracketSize);

      ctx.textAlign = 'center';

      // 1. Top Logo (logo_only.png)
      const logoSize = 210;
      const logoY = 160;
      if (logoImg && logoImg.complete) {
        ctx.drawImage(logoImg, canvas.width / 2 - logoSize / 2, logoY, logoSize, logoSize);
      } else {
        // Fallback placeholder while image loads
        ctx.fillStyle = '#0052cc';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, logoY + logoSize / 2, 70, 0, Math.PI * 2);
        ctx.fill();
      }

      // Micro Header Label below Logo
      ctx.fillStyle = '#0052cc';
      ctx.font = '800 40px "JetBrains Mono", monospace';
      ctx.letterSpacing = '8px';
      ctx.fillText('CHUỖI CUNG ỨNG VIỆT NAM', canvas.width / 2, logoY + logoSize + 60);

      // Perforation / Cut line 1
      ctx.setLineDash([14, 10]);
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(100, logoY + logoSize + 95);
      ctx.lineTo(canvas.width - 100, logoY + logoSize + 95);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Centered Editorial Title Block (Concise, Elegant, No Repetition)
      // Line 1: Ngày Hội Chuỗi Cung Ứng
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 136px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillText('Ngày hội Chuỗi Cung Ứng.', canvas.width / 2, 700);

      // Line 2: Sourcing Day & B2B Matchmaking
      ctx.fillStyle = '#0052cc';
      ctx.font = '800 114px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillText('Sourcing Day & B2B', canvas.width / 2, 850);

      // 3. Centered Subtitle (Concise & Direct)
      ctx.fillStyle = '#475569';
      ctx.font = '600 52px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillText('Kết nối trực tiếp Nhà máy FDI & Doanh nghiệp phụ trợ', canvas.width / 2, 970);

      // 4. Interactive Callout Badge: "Nhấn vào để xem chi tiết"
      const btnW = 980;
      const btnH = 110;
      const btnX = canvas.width / 2 - btnW / 2;
      const btnY = 1100;
      const btnRadius = 55;

      ctx.save();
      // Light soft blue pill background
      ctx.fillStyle = '#EFF6FF';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(btnX, btnY, btnW, btnH, btnRadius);
      } else {
        ctx.rect(btnX, btnY, btnW, btnH);
      }
      ctx.fill();

      // Border in brand blue
      ctx.strokeStyle = '#0052cc';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Text with arrow
      ctx.fillStyle = '#0052cc';
      ctx.font = '700 46px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👉 Nhấn vào để xem chi tiết ↗', canvas.width / 2, btnY + 70);
      ctx.restore();

      // Center subtle watermark seal
      ctx.save();
      ctx.translate(canvas.width / 2, 1420);
      ctx.font = '900 280px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.035)';
      ctx.fillText('CCU 2026', 0, 0);
      ctx.restore();

      // Perforation / Cut line 2
      ctx.setLineDash([14, 10]);
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(100, 1630);
      ctx.lineTo(canvas.width - 100, 1630);
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Centered Lower Certificate Section (Concise)
      ctx.fillStyle = '#0F172A';
      ctx.font = '800 54px "JetBrains Mono", monospace';
      ctx.fillText('2026 Official Program', canvas.width / 2, 1750);

      ctx.fillStyle = '#475569';
      ctx.font = '500 48px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillText('Chương trình xúc tiến thương mại & thẩm định mẫu thử trực tiếp', canvas.width / 2, 1835);

      // Centered Authentic Hand-drawn Signature squiggle
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 5;
      ctx.beginPath();
      const sigStartX = canvas.width / 2 - 250;
      const sigY = 2000;
      ctx.moveTo(sigStartX, sigY);
      ctx.bezierCurveTo(sigStartX + 70, sigY - 45, sigStartX + 130, sigY + 35, sigStartX + 185, sigY - 18);
      ctx.bezierCurveTo(sigStartX + 240, sigY - 65, sigStartX + 310, sigY + 25, sigStartX + 390, sigY - 28);
      ctx.bezierCurveTo(sigStartX + 445, sigY - 75, sigStartX + 500, sigY + 12, sigStartX + 570, sigY - 18);
      ctx.stroke();

      // 6. Centered Bottom Footer (Enlarged)
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 78px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillText('chuoicungung.com', canvas.width / 2, 2350);

      ctx.fillStyle = '#64748B';
      ctx.font = '800 38px "JetBrains Mono", monospace';
      ctx.letterSpacing = '5px';
      ctx.fillText('OFFICIAL SOURCING DAY · B2B EXPO PASS', canvas.width / 2, 2430);
    };

    // Draw initially without image
    drawContent();

    // Asynchronously load /logo_only.png
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/logo_only.png';
    logoImg.onload = () => {
      drawContent(logoImg);
      if (onLogoLoaded) onLogoLoaded();
    };

    return canvas;
  };

  // 2. Three.js Scene Setup (Translucent Porcelain Paper with Specular Lighting)
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || 700;

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.6);

    // High Performance WebGL Renderer with Alpha
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Bright daylight ambient & directional lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(6, 9, 6);
    scene.add(dirLight);

    // Interactive Specular Point Light ("HOVER TO LIGHT IT")
    const pointLight = new THREE.PointLight(0x38bdf8, 4.5, 16);
    pointLight.position.set(0, 0, 3.2);
    scene.add(pointLight);

    // Secondary subtle rim light
    const pointLight2 = new THREE.PointLight(0x0052cc, 2.0, 12);
    pointLight2.position.set(-3, -3, 2);
    scene.add(pointLight2);

    // Create Canvas Texture
    let canvasTexture;
    const textureCanvas = createPaperTexture(() => {
      if (canvasTexture) canvasTexture.needsUpdate = true;
    });

    canvasTexture = new THREE.CanvasTexture(textureCanvas);
    canvasTexture.minFilter = THREE.LinearFilter;
    canvasTexture.magFilter = THREE.LinearFilter;
    canvasTexture.generateMipmaps = true;

    // Subdivided Plane Geometry (Aspect Ratio 1 : 1.36)
    const paperWidth = 2.9;
    const paperHeight = 3.95;
    const geometry = new THREE.PlaneGeometry(paperWidth, paperHeight, 64, 64);
    const origPositions = geometry.attributes.position.array.slice();

    // Luminous Translucent Porcelain Paper Material
    const material = new THREE.MeshPhysicalMaterial({
      map: canvasTexture,
      transparent: true,
      opacity: 0.98,
      roughness: 0.16,
      metalness: 0.05,
      clearcoat: 0.92,
      clearcoatRoughness: 0.12,
      reflectivity: 0.95,
      transmission: 0.06,
      side: THREE.DoubleSide
    });

    const paperMesh = new THREE.Mesh(geometry, material);
    scene.add(paperMesh);

    // Save to ref
    const state = stateRef.current;
    state.renderer = renderer;
    state.scene = scene;
    state.camera = camera;
    state.paperMesh = paperMesh;
    state.pointLight = pointLight;
    state.texture = canvasTexture;

    // Render & Physics Loop
    let clock = new THREE.Clock();

    const animate = () => {
      state.animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Damped pointer coordinates
      state.pointer.x += (state.pointer.targetX - state.pointer.x) * 0.07;
      state.pointer.y += (state.pointer.targetY - state.pointer.y) * 0.07;

      // Damped 3D rotation
      state.rotation.x += (state.rotation.targetX - state.rotation.x) * 0.08;
      state.rotation.y += (state.rotation.targetY - state.rotation.y) * 0.08;

      // Apply rotation + organic floating breathing wave
      const floatTiltX = Math.sin(time * 0.8) * 0.02;
      const floatTiltY = Math.cos(time * 0.6) * 0.03;
      const floatY = Math.sin(time * 1.1) * 0.05;

      paperMesh.rotation.x = state.rotation.x + floatTiltX;
      paperMesh.rotation.y = state.rotation.y + floatTiltY;
      paperMesh.position.y = floatY;

      // "HOVER TO LIGHT IT" - Point Light moves directly with cursor
      pointLight.position.x = state.pointer.x * 4.5;
      pointLight.position.y = state.pointer.y * 4.5;

      // "3D PAPER BENDING" - Dynamic Vertex Curvature & Inertia Flex
      const positions = geometry.attributes.position.array;
      const mouseBendX = state.pointer.x * 0.22;
      const mouseBendY = state.pointer.y * 0.18;

      for (let i = 0; i < positions.length; i += 3) {
        const ox = origPositions[i];
        const oy = origPositions[i + 1];

        // S-curve and parabolic paper curl
        const wave = Math.sin(ox * 1.2 + time * 1.2) * 0.03;
        const curlX = (ox * ox) * -0.05 * (1 + mouseBendX);
        const curlY = (oy * oy) * -0.025 * (1 + mouseBendY);
        const flex = Math.sin(ox * 1.8 + oy * 1.0) * wave;

        // Top right paper curl accent
        const cornerCurl = Math.max(0, (ox + 1.2) * (oy - 1.2)) * 0.015;

        positions[i + 2] = curlX + curlY + flex + cornerCurl;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      canvasTexture.dispose();
      renderer.dispose();
    };
  }, []);

  // Pointer & Drag Interaction ("DRAG TO TURN IT · HOVER TO LIGHT IT")
  const handlePointerMove = (e) => {
    const mount = canvasMountRef.current;
    if (!mount) return;
    const rect = mount.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    const state = stateRef.current;
    state.pointer.targetX = x;
    state.pointer.targetY = y;

    if (state.isDragging) {
      const deltaX = (e.clientX - state.dragStart.x) * 0.007;
      const deltaY = (e.clientY - state.dragStart.y) * 0.007;
      state.rotation.targetY += deltaX;
      state.rotation.targetX += deltaY;
      state.dragStart = { x: e.clientX, y: e.clientY };
    } else {
      // Natural responsive 3D tilt on hover
      state.rotation.targetY = x * 0.42;
      state.rotation.targetX = -y * 0.32;
    }
  };

  const handlePointerDown = (e) => {
    const state = stateRef.current;
    state.isDragging = true;
    state.dragStart = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    const state = stateRef.current;
    state.isDragging = false;
  };

  const handlePaperClick = () => {
    navigate('/chuong-trinh');
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#F0F4F8] via-[#F8FAFC] to-[#EEF2F6] py-14 sm:py-20 lg:py-24 border-y border-slate-200/90 select-none"
    >
      {/* Subtle radial daylight vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35)_0%,transparent_80%)] pointer-events-none z-0" />

      {/* 1. Giant Wordmark with Vibrant 6-Color Rainbow Gradient ("CHUỖI CUNG ỨNG") */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
      >
        <span 
          style={{ letterSpacing: '-0.04em' }}
          className="text-[12.5vw] sm:text-[13vw] font-black uppercase whitespace-nowrap tracking-tighter select-none text-rainbow-gradient opacity-35 sm:opacity-45"
        >
          CHUỖI CUNG ỨNG
        </span>
      </div>

      {/* 2. Interactive Three.js 3D Paper Stage */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* 3D WebGL Canvas */}
        <div 
          ref={canvasMountRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onClick={handlePaperClick}
          title="Nhấn vào để xem chi tiết Ngày Hội Chuỗi Cung Ứng"
          className="w-full h-[520px] sm:h-[620px] lg:h-[700px] cursor-pointer flex items-center justify-center touch-none drop-shadow-xl"
        />

        {/* Caption / Interactive Button: "Nhấn vào để xem chi tiết" */}
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={handlePaperClick}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/95 hover:bg-[#0052cc] text-slate-800 hover:text-white border border-slate-300/80 hover:border-[#0052cc] shadow-sm hover:shadow-xl transition-all duration-300 text-xs sm:text-sm font-semibold cursor-pointer group scale-100 hover:scale-105"
          >
            <span className="w-2 h-2 rounded-full bg-[#0052cc] group-hover:bg-white animate-pulse" />
            <span>Nhấn vào để xem chi tiết</span>
            <span className="text-[#0052cc] group-hover:text-white group-hover:translate-x-1 transition-transform font-bold">→</span>
          </button>
        </div>

      </div>
    </section>
  );
}
