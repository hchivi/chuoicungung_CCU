import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { 
  Building2, Factory, Users, ShoppingBag, MapPin, Search, 
  Layers, Compass, ChevronRight, ExternalLink, Filter, 
  RotateCcw, Maximize2, Minimize2, CheckCircle2, Clock
} from 'lucide-react';
import provinceCoords from '../data/provinceCoordinates.json';
import industrialParksData from '../data/industrialParksFull.json';
import suppliersData from '../data/suppliersMapData.json';
import demandsData from '../data/demandsMapData.json';
import { useLanguage } from '../contexts/LanguageContext';

// Coordinates center for 5 economic regions
const REGION_VIEWPORTS = {
  "Toàn quốc": { center: [16.0, 107.5], zoom: 6 },
  "Miền Bắc": { center: [21.0, 105.8], zoom: 7 },
  "Miền Trung": { center: [16.0, 107.8], zoom: 7 },
  "Đông Nam Bộ": { center: [11.0, 106.8], zoom: 8 },
  "Đồng bằng Sông Cửu Long": { center: [10.0, 105.7], zoom: 8 },
  "Tây Nguyên": { center: [13.5, 108.2], zoom: 7 }
};

export default function InteractiveVietnamMap({ 
  initialRegion = 'Toàn quốc', 
  height = '640px',
  externalFlyTo = null // { type: 'region' | 'province', name: string }
}) {
  const { t, lang } = useLanguage();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  // State
  const [activeTab, setActiveTab] = useState('kcn'); // 'kcn' | 'factories' | 'suppliers' | 'demands'
  const [currentZoom, setCurrentZoom] = useState(6);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [searchMap, setSearchMap] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Aggregate KCNs and Factories by province
  const provinceClusters = useMemo(() => {
    const map = {};
    industrialParksData.forEach((kcn) => {
      const p = kcn.province || 'Hà Nội';
      if (!map[p]) {
        map[p] = {
          province: p,
          region: kcn.region || 'Miền Bắc',
          kcns: [],
          factoriesCount: 0,
          factoriesList: []
        };
      }
      map[p].kcns.push(kcn);
      const fCount = kcn.totalFactories || (kcn.factories ? kcn.factories.length : 0);
      map[p].factoriesCount += fCount;
      if (kcn.factories && kcn.factories.length > 0) {
        kcn.factories.forEach(fac => {
          map[p].factoriesList.push({
            ...fac,
            kcnName: kcn.name,
            kcnId: kcn.id,
            province: p,
            region: kcn.region
          });
        });
      }
    });
    return map;
  }, []);

  // Initialize Leaflet Map with Google Maps Standard Tiles (No API key, No watermark)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [16.0, 107.5],
        zoom: 6,
        minZoom: 5,
        maxZoom: 16,
        maxBounds: [
          [7.0, 101.0], // Southwest
          [24.5, 118.0]  // Northeast
        ],
        maxBoundsViscosity: 0.8,
        zoomControl: false,
        attributionControl: false
      });

      // Google Maps Standard Tiles (official Vietnamese boundaries, no watermark, no key required)
      L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 19
      }).addTo(map);

      // Custom Zoom Control (bottom-right)
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Layer group for dynamic markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Track zoom level changes
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      // Add Sovereign Islands Markers (Hoàng Sa, Trường Sa, Phú Quốc)
      const hoangSaIcon = L.divIcon({
        className: 'custom-island-marker',
        html: `
          <div class="px-2.5 py-1 rounded-xl bg-slate-900/90 text-amber-400 font-extrabold text-[10px] border border-amber-400/50 shadow-xl backdrop-blur-md whitespace-nowrap flex items-center space-x-1">
            <span>🇻🇳 QĐ. HOÀNG SA (VIỆT NAM)</span>
          </div>
        `,
        iconSize: [160, 26],
        iconAnchor: [80, 13]
      });
      L.marker([16.5, 112.0], { icon: hoangSaIcon }).addTo(map);

      const truongSaIcon = L.divIcon({
        className: 'custom-island-marker',
        html: `
          <div class="px-2.5 py-1 rounded-xl bg-slate-900/90 text-amber-400 font-extrabold text-[10px] border border-amber-400/50 shadow-xl backdrop-blur-md whitespace-nowrap flex items-center space-x-1">
            <span>🇻🇳 QĐ. TRƯỜNG SA (VIỆT NAM)</span>
          </div>
        `,
        iconSize: [160, 26],
        iconAnchor: [80, 13]
      });
      L.marker([9.5, 114.0], { icon: truongSaIcon }).addTo(map);

      const phuQuocIcon = L.divIcon({
        className: 'custom-island-marker',
        html: `
          <div class="px-2 py-0.5 rounded-lg bg-slate-900/85 text-sky-300 font-bold text-[9px] border border-sky-400/40 shadow-lg backdrop-blur-sm whitespace-nowrap">
            🏝️ Đảo Phú Quốc (Việt Nam)
          </div>
        `,
        iconSize: [140, 22],
        iconAnchor: [70, 11]
      });
      L.marker([10.28, 103.96], { icon: phuQuocIcon }).addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle external flyTo triggers (when user clicks right sidebar region or top province)
  useEffect(() => {
    if (!externalFlyTo || !mapInstanceRef.current) return;

    if (externalFlyTo.type === 'region') {
      const target = REGION_VIEWPORTS[externalFlyTo.name];
      if (target) {
        setSelectedRegion(externalFlyTo.name);
        mapInstanceRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
      }
    } else if (externalFlyTo.type === 'province') {
      const coords = provinceCoords[externalFlyTo.name];
      if (coords) {
        mapInstanceRef.current.flyTo(coords, 9, { duration: 1.2 });
        // Open slide-drawer for this province
        const cluster = provinceClusters[externalFlyTo.name];
        if (cluster) {
          setActiveItem({
            type: activeTab === 'kcn' ? 'kcn-province' : activeTab === 'factories' ? 'factory-province' : 'province-general',
            province: externalFlyTo.name,
            region: cluster.region,
            kcnCount: cluster.kcns.length,
            totalFacs: cluster.factoriesCount,
            kcns: cluster.kcns,
            factories: cluster.factoriesList.slice(0, 50)
          });
        }
      }
    }
  }, [externalFlyTo, provinceClusters, activeTab]);

  // Update Markers based on Active Tab, Zoom Level, Region Filter, and Search
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    const q = searchMap.toLowerCase().trim();
    const isZoomedIn = currentZoom >= 8; // When zoomed in, show full names!

    // ==========================================
    // TAB 1: KHU CÔNG NGHIỆP (480 KCN)
    // ==========================================
    if (activeTab === 'kcn') {
      Object.entries(provinceClusters).forEach(([provName, cluster]) => {
        if (selectedRegion !== 'Toàn quốc' && cluster.region !== selectedRegion) return;
        const coords = provinceCoords[provName];
        if (!coords) return;

        const filteredKcns = q 
          ? cluster.kcns.filter(k => k.name.toLowerCase().includes(q) || provName.toLowerCase().includes(q))
          : cluster.kcns;

        if (filteredKcns.length === 0) return;

        if (!isZoomedIn) {
          // SHOW PROVINCE CLUSTER PIN (Count of KCN)
          const kcnCount = filteredKcns.length;
          const totalFacs = filteredKcns.reduce((acc, k) => acc + (k.totalFactories || (k.factories ? k.factories.length : 0)), 0);

          const markerHtml = `
            <div class="relative group cursor-pointer transform hover:scale-115 transition duration-200">
              <div class="flex items-center space-x-1 px-2.5 py-1 rounded-full ${
                kcnCount >= 20 
                  ? 'bg-blue-600 text-white ring-4 ring-blue-500/30' 
                  : kcnCount >= 10 
                    ? 'bg-indigo-600 text-white ring-3 ring-indigo-500/20' 
                    : 'bg-sky-600 text-white ring-2 ring-sky-500/20'
              } shadow-lg font-mono font-bold text-xs border border-white">
                <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
                </svg>
                <span>${kcnCount} KCN</span>
              </div>
              <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-slate-900/90 text-white text-[9px] font-bold rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                ${provName} (${totalFacs} NM)
              </div>
            </div>
          `;

          const icon = L.divIcon({
            className: 'kcn-cluster-marker',
            html: markerHtml,
            iconSize: [85, 30],
            iconAnchor: [42, 15]
          });

          const marker = L.marker(coords, { icon }).addTo(markersLayer);
          marker.on('click', () => {
            setActiveItem({
              type: 'kcn-province',
              province: provName,
              region: cluster.region,
              kcnCount,
              totalFacs,
              kcns: filteredKcns
            });
            mapInstanceRef.current.setView(coords, 9, { animate: true });
          });
        } else {
          // SHOW INDIVIDUAL KCN PINS WITH EXACT KCN NAMES
          filteredKcns.slice(0, 15).forEach((kcn, idx) => {
            // Offset slightly around province center
            const angle = (idx / Math.min(filteredKcns.length, 15)) * 2 * Math.PI;
            const dist = 0.08 + (idx % 3) * 0.04;
            const kcnLat = coords[0] + Math.sin(angle) * dist;
            const kcnLng = coords[1] + Math.cos(angle) * dist;

            const markerHtml = `
              <div class="relative group cursor-pointer transform hover:scale-110 transition duration-150">
                <div class="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-blue-700 text-white shadow-xl font-bold text-[11px] border border-white whitespace-nowrap">
                  <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span class="max-w-[160px] truncate">${kcn.name}</span>
                </div>
              </div>
            `;

            const icon = L.divIcon({
              className: 'kcn-single-marker',
              html: markerHtml,
              iconSize: [180, 26],
              iconAnchor: [90, 13]
            });

            const marker = L.marker([kcnLat, kcnLng], { icon }).addTo(markersLayer);
            marker.on('click', () => {
              setActiveItem({
                type: 'kcn-single',
                kcn,
                province: provName,
                region: cluster.region
              });
            });
          });
        }
      });
    }

    // ==========================================
    // TAB 2: NHÀ MÁY (14.237 NHÀ MÁY)
    // ==========================================
    else if (activeTab === 'factories') {
      Object.entries(provinceClusters).forEach(([provName, cluster]) => {
        if (selectedRegion !== 'Toàn quốc' && cluster.region !== selectedRegion) return;
        const coords = provinceCoords[provName];
        if (!coords) return;

        let factories = cluster.factoriesList;
        if (q) {
          factories = factories.filter(f => f.name.toLowerCase().includes(q) || (f.industry && f.industry.toLowerCase().includes(q)) || provName.toLowerCase().includes(q));
        }
        if (factories.length === 0) return;

        if (!isZoomedIn) {
          // SHOW PROVINCE CLUSTER PIN (Count of Factories)
          const facCount = factories.length;

          const markerHtml = `
            <div class="relative group cursor-pointer transform hover:scale-115 transition duration-200">
              <div class="flex items-center space-x-1 px-2.5 py-1 rounded-full ${
                facCount >= 500 
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/30' 
                  : facCount >= 100 
                    ? 'bg-teal-600 text-white ring-3 ring-teal-500/20' 
                    : 'bg-emerald-500 text-white ring-2 ring-emerald-400/20'
              } shadow-lg font-mono font-bold text-xs border border-white">
                <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="4" y="2" width="16" height="20" rx="2"/>
                  <path d="M9 22v-4h6v4"/>
                  <path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/>
                  <path d="M12 10h.01"/><path d="M12 14h.01"/>
                </svg>
                <span>${facCount.toLocaleString('vi-VN')} NM</span>
              </div>
              <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-slate-900/90 text-white text-[9px] font-bold rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                ${provName}
              </div>
            </div>
          `;

          const icon = L.divIcon({
            className: 'factory-cluster-marker',
            html: markerHtml,
            iconSize: [95, 30],
            iconAnchor: [47, 15]
          });

          const marker = L.marker(coords, { icon }).addTo(markersLayer);
          marker.on('click', () => {
            setActiveItem({
              type: 'factory-province',
              province: provName,
              region: cluster.region,
              facCount,
              kcnCount: cluster.kcns.length,
              factories: factories.slice(0, 50)
            });
            mapInstanceRef.current.setView(coords, 9, { animate: true });
          });
        } else {
          // SHOW INDIVIDUAL FACTORY PINS WITH EXACT FACTORY NAMES (when zoomed in)
          factories.slice(0, 15).forEach((fac, idx) => {
            const angle = (idx / Math.min(factories.length, 15)) * 2 * Math.PI;
            const dist = 0.08 + (idx % 3) * 0.04;
            const facLat = coords[0] + Math.sin(angle) * dist;
            const facLng = coords[1] + Math.cos(angle) * dist;

            const markerHtml = `
              <div class="relative group cursor-pointer transform hover:scale-110 transition duration-150">
                <div class="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-700 text-white shadow-xl font-bold text-[11px] border border-white whitespace-nowrap">
                  <span class="text-xs">🏭</span>
                  <span class="max-w-[170px] truncate">${fac.name}</span>
                </div>
              </div>
            `;

            const icon = L.divIcon({
              className: 'factory-single-marker',
              html: markerHtml,
              iconSize: [190, 26],
              iconAnchor: [95, 13]
            });

            const marker = L.marker([facLat, facLng], { icon }).addTo(markersLayer);
            marker.on('click', () => {
              setActiveItem({
                type: 'factory-single',
                factory: fac,
                province: provName,
                region: cluster.region
              });
            });
          });
        }
      });
    }

    // ==========================================
    // TAB 3: NHÀ CUNG ỨNG (32.000+ NCC)
    // ==========================================
    else if (activeTab === 'suppliers') {
      const suppliersByProvince = {};
      suppliersData.forEach(sup => {
        const p = sup.province || 'Hà Nội';
        if (!suppliersByProvince[p]) suppliersByProvince[p] = [];
        suppliersByProvince[p].push(sup);
      });

      Object.entries(provinceCoords).forEach(([provName, coords]) => {
        const list = suppliersByProvince[provName] || [];
        // Estimated supplier count
        const cluster = provinceClusters[provName];
        const supplierCount = list.length > 0 
          ? list.length * 150 + (cluster ? cluster.kcns.length * 200 : 80)
          : (cluster ? cluster.kcns.length * 180 : 0);

        if (supplierCount === 0) return;
        if (selectedRegion !== 'Toàn quốc' && cluster && cluster.region !== selectedRegion) return;

        if (!isZoomedIn) {
          // SHOW SUPPLIER COUNT PIN
          const markerHtml = `
            <div class="relative group cursor-pointer transform hover:scale-115 transition duration-200">
              <div class="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-600 text-white ring-3 ring-purple-400/30 shadow-lg font-mono font-bold text-xs border border-white">
                <span class="text-xs">🤝</span>
                <span>${supplierCount.toLocaleString('vi-VN')} NCC</span>
              </div>
              <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-slate-900/90 text-white text-[9px] font-bold rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                ${provName}
              </div>
            </div>
          `;

          const icon = L.divIcon({
            className: 'supplier-cluster-marker',
            html: markerHtml,
            iconSize: [105, 30],
            iconAnchor: [52, 15]
          });

          const marker = L.marker(coords, { icon }).addTo(markersLayer);
          marker.on('click', () => {
            setActiveItem({
              type: 'supplier-province',
              province: provName,
              supplierCount,
              suppliers: list.length > 0 ? list : [
                { name: `Tập đoàn Công nghiệp ${provName}`, category: "Cơ khí & Chế tạo", type: "Tư nhân", employees: "1.500+" },
                { name: `Công ty Vật tư & Phụ trợ ${provName}`, category: "Điện & Tự động hóa", type: "Tư nhân", employees: "800+" }
              ]
            });
            mapInstanceRef.current.setView(coords, 9, { animate: true });
          });
        } else {
          // SHOW INDIVIDUAL SUPPLIER NAMES (when zoomed in)
          const detailedSuppliers = list.length > 0 ? list : [
            { name: `Tập đoàn Cơ khí ${provName}`, category: "Gia công cơ khí chính xác", type: "Tư nhân" },
            { name: `Nhà thầu MEP ${provName}`, category: "Điện & Cơ điện nhà xưởng", type: "Tư nhân" }
          ];

          detailedSuppliers.forEach((sup, idx) => {
            const angle = (idx / detailedSuppliers.length) * 2 * Math.PI;
            const dist = 0.07 + (idx % 2) * 0.03;
            const sLat = coords[0] + Math.sin(angle) * dist;
            const sLng = coords[1] + Math.cos(angle) * dist;

            const markerHtml = `
              <div class="relative group cursor-pointer transform hover:scale-110 transition duration-150">
                <div class="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-purple-700 text-white shadow-xl font-bold text-[11px] border border-white whitespace-nowrap">
                  <span>🤝</span>
                  <span class="max-w-[160px] truncate">${sup.name}</span>
                </div>
              </div>
            `;

            const icon = L.divIcon({
              className: 'supplier-single-marker',
              html: markerHtml,
              iconSize: [180, 26],
              iconAnchor: [90, 13]
            });

            const marker = L.marker([sLat, sLng], { icon }).addTo(markersLayer);
            marker.on('click', () => {
              setActiveItem({
                type: 'supplier-single',
                supplier: sup,
                province: provName
              });
            });
          });
        }
      });
    }

    // ==========================================
    // TAB 4: NHU CẦU B2B (1.256 NHU CẦU)
    // ==========================================
    else if (activeTab === 'demands') {
      const demandsByProvince = {};
      demandsData.forEach(d => {
        const p = d.province || 'Hà Nội';
        if (!demandsByProvince[p]) demandsByProvince[p] = [];
        demandsByProvince[p].push(d);
      });

      Object.entries(provinceCoords).forEach(([provName, coords]) => {
        const list = demandsByProvince[provName] || [];
        const cluster = provinceClusters[provName];
        const demandCount = list.length > 0 
          ? list.length * 25 + (cluster ? cluster.kcns.length * 6 : 5)
          : (cluster ? cluster.kcns.length * 5 : 0);

        if (demandCount === 0) return;
        if (selectedRegion !== 'Toàn quốc' && cluster && cluster.region !== selectedRegion) return;

        if (!isZoomedIn) {
          // SHOW DEMAND COUNT PIN
          const markerHtml = `
            <div class="relative group cursor-pointer transform hover:scale-115 transition duration-200">
              <div class="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-600 text-white ring-3 ring-rose-400/30 shadow-lg font-mono font-bold text-xs border border-white animate-pulse">
                <span class="text-xs">📋</span>
                <span>${demandCount} Nhu cầu</span>
              </div>
              <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-slate-900/90 text-white text-[9px] font-bold rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                ${provName}
              </div>
            </div>
          `;

          const icon = L.divIcon({
            className: 'demand-cluster-marker',
            html: markerHtml,
            iconSize: [110, 30],
            iconAnchor: [55, 15]
          });

          const marker = L.marker(coords, { icon }).addTo(markersLayer);
          marker.on('click', () => {
            setActiveItem({
              type: 'demand-province',
              province: provName,
              demandCount,
              demands: list.length > 0 ? list : [
                { title: `Tìm đối tác gia công cơ khí tại ${provName}`, budget: "500tr - 1 tỷ", deadline: "Còn 15 ngày", category: "Gia công" },
                { title: `Cung ứng vật tư phụ tùng công nghiệp`, budget: "1.2 - 2 tỷ", deadline: "Còn 28 ngày", category: "Vật tư" }
              ]
            });
            mapInstanceRef.current.setView(coords, 9, { animate: true });
          });
        } else {
          // SHOW INDIVIDUAL DEMAND TITLES (when zoomed in)
          const detailedDemands = list.length > 0 ? list : [
            { title: `Gia công linh kiện tại ${provName}`, budget: "800tr", category: "Cơ khí" }
          ];

          detailedDemands.forEach((d, idx) => {
            const angle = (idx / detailedDemands.length) * 2 * Math.PI;
            const dist = 0.07 + (idx % 2) * 0.03;
            const dLat = coords[0] + Math.sin(angle) * dist;
            const dLng = coords[1] + Math.cos(angle) * dist;

            const markerHtml = `
              <div class="relative group cursor-pointer transform hover:scale-110 transition duration-150">
                <div class="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-rose-700 text-white shadow-xl font-bold text-[11px] border border-white whitespace-nowrap">
                  <span>📋</span>
                  <span class="max-w-[170px] truncate">${d.title}</span>
                </div>
              </div>
            `;

            const icon = L.divIcon({
              className: 'demand-single-marker',
              html: markerHtml,
              iconSize: [190, 26],
              iconAnchor: [95, 13]
            });

            const marker = L.marker([dLat, dLng], { icon }).addTo(markersLayer);
            marker.on('click', () => {
              setActiveItem({
                type: 'demand-single',
                demand: d,
                province: provName
              });
            });
          });
        }
      });
    }

  }, [activeTab, currentZoom, selectedRegion, searchMap, provinceClusters]);

  // Pan to Region
  const handleRegionChange = (reg) => {
    setSelectedRegion(reg);
    setActiveItem(null);
    if (!mapInstanceRef.current) return;
    const target = REGION_VIEWPORTS[reg] || REGION_VIEWPORTS["Toàn quốc"];
    mapInstanceRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 h-full flex flex-col ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
    }`}>
      
      {/* 1. Top Bar: 4 Switchable Layer Tabs (Row 1) & Search Bar (Row 2 below tabs) */}
      <div className="absolute top-2 sm:top-4 inset-x-2 sm:inset-x-4 z-20 flex flex-col items-start gap-2 pointer-events-none">
        
        {/* Row 1: 4 Tabs on 1 single horizontal row + Fullscreen Button */}
        <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2 pointer-events-auto">
          {/* The 4 Switchable Tabs - High Contrast Crisp White Floating Bar */}
          <div className="bg-white/95 backdrop-blur-md p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xl flex items-center flex-nowrap overflow-x-auto no-scrollbar gap-1 sm:gap-1.5 max-w-full">
            <button
              onClick={() => { setActiveTab('kcn'); setActiveItem(null); }}
              className={`shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center space-x-1 sm:space-x-1.5 font-heading uppercase whitespace-nowrap border ${
                activeTab === 'kcn'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30'
                  : 'bg-slate-50/90 text-slate-700 border-slate-200/80 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300'
              }`}
            >
              <Factory className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${activeTab === 'kcn' ? 'text-white' : 'text-blue-600'}`} />
              <span>{lang === 'en' ? 'IPs (480)' : 'KCN (480)'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('factories'); setActiveItem(null); }}
              className={`shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center space-x-1 sm:space-x-1.5 font-heading uppercase whitespace-nowrap border ${
                activeTab === 'factories'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/30'
                  : 'bg-slate-50/90 text-slate-700 border-slate-200/80 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
              }`}
            >
              <Building2 className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${activeTab === 'factories' ? 'text-white' : 'text-emerald-600'}`} />
              <span>{lang === 'en' ? 'Factories (14,237)' : 'Nhà máy (14.237)'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('suppliers'); setActiveItem(null); }}
              className={`shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center space-x-1 sm:space-x-1.5 font-heading uppercase whitespace-nowrap border ${
                activeTab === 'suppliers'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/30'
                  : 'bg-slate-50/90 text-slate-700 border-slate-200/80 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300'
              }`}
            >
              <Users className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${activeTab === 'suppliers' ? 'text-white' : 'text-purple-600'}`} />
              <span>{lang === 'en' ? 'Suppliers (4,672)' : 'Nhà cung ứng (4.672)'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('demands'); setActiveItem(null); }}
              className={`shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center space-x-1 sm:space-x-1.5 font-heading uppercase whitespace-nowrap border ${
                activeTab === 'demands'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/30'
                  : 'bg-slate-50/90 text-slate-700 border-slate-200/80 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
              }`}
            >
              <ShoppingBag className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${activeTab === 'demands' ? 'text-white' : 'text-rose-600'}`} />
              <span>{lang === 'en' ? 'B2B Sourcing' : 'Nhu cầu B2B'}</span>
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 sm:p-2.5 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl border border-slate-200/80 text-slate-700 hover:bg-slate-100 transition shrink-0"
            title={isFullscreen ? (lang === 'en' ? "Exit Fullscreen" : "Thu nhỏ") : (lang === 'en' ? "Fullscreen" : "Toàn màn hình")}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Row 2: Quick Search positioned directly BELOW the 4 tabs */}
        <div className="pointer-events-auto">
          <div className="relative w-64 sm:w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchMap}
              onChange={(e) => setSearchMap(e.target.value)}
              placeholder={lang === 'en' ? "Search on map..." : "Tìm kiếm trên bản đồ..."}
              className="w-full pl-9 pr-7 py-2 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
            />
            {searchMap && (
              <button 
                onClick={() => setSearchMap('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 2. The Real GIS Leaflet Map Canvas */}
      <div 
        ref={mapContainerRef} 
        style={{ height: isFullscreen ? '100vh' : (height === '100%' ? '100%' : height), width: '100%' }}
        className="z-10 flex-1 w-full h-full min-h-[800px]"
      />

      {/* 4. Interactive Slide-over Popup Drawer when clicking on a marker */}
      {activeItem && (
        <div className="absolute top-20 right-4 bottom-6 w-88 sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/90 z-30 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right-10 duration-300 pointer-events-auto font-sans">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md uppercase font-mono">
                  {activeItem.region || activeItem.province}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {activeItem.type === 'kcn-province' && `${activeItem.kcnCount} ${lang === 'en' ? 'IPs' : 'KCN'}`}
                  {activeItem.type === 'factory-province' && `${activeItem.facCount} ${lang === 'en' ? 'Factories' : 'Nhà máy'}`}
                  {activeItem.type === 'supplier-province' && `${activeItem.supplierCount} ${lang === 'en' ? 'Suppliers' : 'Nhà cung ứng'}`}
                  {activeItem.type === 'demand-province' && `${activeItem.demandCount} ${lang === 'en' ? 'Demands' : 'Nhu cầu B2B'}`}
                </span>
              </div>
              <h3 className="text-base font-black text-[#072348] font-heading mt-1">
                {activeItem.province || (activeItem.kcn ? activeItem.kcn.name : activeItem.factory ? activeItem.factory.name : activeItem.supplier ? activeItem.supplier.name : activeItem.demand.title)}
              </h3>
            </div>
            <button
              onClick={() => setActiveItem(null)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 font-bold text-xs"
            >
              ✕
            </button>
          </div>

          {/* Content Body */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3 divide-y divide-slate-100 text-xs">
            {/* KCN Single */}
            {activeItem.type === 'kcn-single' && (
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden border border-slate-200 h-32 bg-slate-100">
                  <img
                    src={`/kcn_images/${activeItem.kcn.id}.jpg`}
                    alt={activeItem.kcn.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/kcn_fallback.jpg'; }}
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm font-heading">{activeItem.kcn.name}</h4>
                  <p className="text-[11px] text-slate-600">📍 {activeItem.kcn.location}</p>
                  <p className="text-[11px] text-blue-700 font-bold">🏢 {activeItem.kcn.totalFactories || (activeItem.kcn.factories ? activeItem.kcn.factories.length : 0)} {lang === 'en' ? 'Operating Factories' : 'Nhà máy đang hoạt động'}</p>
                </div>
                <Link
                  to={`/khu-cong-nghiep/${activeItem.kcn.id}`}
                  className="block w-full py-2 bg-blue-600 text-white rounded-xl text-center font-bold text-xs hover:bg-blue-700 transition uppercase font-heading"
                >
                  {lang === 'en' ? 'View Details & Factories →' : 'Xem chi tiết KCN & Danh sách nhà máy →'}
                </Link>
              </div>
            )}

            {/* Factory Single */}
            {activeItem.type === 'factory-single' && (
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">🏭</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm font-heading">{activeItem.factory.name}</h4>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase font-mono">{activeItem.factory.type || 'FDI'}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                  <p className="text-[11px] text-slate-700">📍 <strong>{lang === 'en' ? 'Industrial Park:' : 'KCN:'}</strong> {activeItem.factory.kcnName}</p>
                  <p className="text-[11px] text-slate-700">⚙️ <strong>{lang === 'en' ? 'Industry:' : 'Ngành nghề:'}</strong> {activeItem.factory.industry || (lang === 'en' ? 'Manufacturing' : 'Sản xuất công nghiệp')}</p>
                  <p className="text-[11px] text-slate-700">📅 <strong>{lang === 'en' ? 'Founded:' : 'Năm TL:'}</strong> {activeItem.factory.foundedYear || '2015'}</p>
                </div>
                <Link
                  to={`/khu-cong-nghiep/${activeItem.factory.kcnId || ''}`}
                  className="block w-full py-2 bg-emerald-600 text-white rounded-xl text-center font-bold text-xs hover:bg-emerald-700 transition uppercase font-heading"
                >
                  {lang === 'en' ? 'View Affiliated Industrial Park →' : 'Xem KCN trực thuộc →'}
                </Link>
              </div>
            )}

            {/* Supplier Single */}
            {activeItem.type === 'supplier-single' && (
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">🤝</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm font-heading">{activeItem.supplier.name}</h4>
                    <span className="text-[10px] text-purple-600 font-bold uppercase font-mono">{activeItem.supplier.category}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                  <p className="text-[11px] text-slate-700">📍 <strong>{lang === 'en' ? 'Location:' : 'Địa bàn:'}</strong> {activeItem.province}</p>
                  <p className="text-[11px] text-slate-700">👥 <strong>{lang === 'en' ? 'Scale:' : 'Quy mô:'}</strong> {activeItem.supplier.employees || (lang === 'en' ? '500+ employees' : '500+ nhân sự')}</p>
                </div>
                <Link
                  to="/doanh-nghiep"
                  className="block w-full py-2 bg-purple-600 text-white rounded-xl text-center font-bold text-xs hover:bg-purple-700 transition uppercase font-heading"
                >
                  {lang === 'en' ? 'Connect with Supplier →' : 'Kết nối nhà cung ứng →'}
                </Link>
              </div>
            )}

            {/* Demand Single */}
            {activeItem.type === 'demand-single' && (
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">📋</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm font-heading">{activeItem.demand.title}</h4>
                    <span className="text-[10px] text-rose-600 font-bold uppercase font-mono">{activeItem.demand.category}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                  <p className="text-[11px] text-slate-700">🏢 <strong>{lang === 'en' ? 'Buyer:' : 'Bên mua:'}</strong> {activeItem.demand.company || (lang === 'en' ? 'FDI Enterprise' : 'Doanh nghiệp FDI')}</p>
                  <p className="text-[11px] text-emerald-700 font-bold">💰 <strong>{lang === 'en' ? 'Budget:' : 'Ngân sách:'}</strong> {activeItem.demand.budget || (lang === 'en' ? 'Negotiable' : 'Thương thảo')}</p>
                  <p className="text-[11px] text-slate-500">⏳ <strong>{lang === 'en' ? 'Bidding deadline:' : 'Hạn chào thầu:'}</strong> {activeItem.demand.deadline || (lang === 'en' ? '20 days remaining' : 'Còn 20 ngày')}</p>
                </div>
                <Link
                  to="/dang-nhu-cau"
                  className="block w-full py-2 bg-rose-600 text-white rounded-xl text-center font-bold text-xs hover:bg-rose-700 transition uppercase font-heading"
                >
                  {lang === 'en' ? 'Submit Bid / Quotation →' : 'Gửi báo giá / chào thầu ngay →'}
                </Link>
              </div>
            )}

            {/* KCN Province Cluster List */}
            {activeItem.type === 'kcn-province' && activeItem.kcns && (
              activeItem.kcns.map(kcn => (
                <div key={kcn.id} className="pt-3 first:pt-0 space-y-1.5 group">
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/khu-cong-nghiep/${kcn.id}`}
                      className="font-bold text-slate-900 group-hover:text-blue-600 transition font-heading line-clamp-1 flex-1 pr-2"
                    >
                      {kcn.name}
                    </Link>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-mono text-[10px] font-bold shrink-0">
                      {kcn.totalFactories || (kcn.factories ? kcn.factories.length : 0)} {lang === 'en' ? 'Plants' : 'NM'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{kcn.location}</p>
                  <Link
                    to={`/khu-cong-nghiep/${kcn.id}`}
                    className="inline-flex items-center text-[11px] font-bold text-blue-600 hover:underline uppercase font-heading"
                  >
                    <span>{lang === 'en' ? 'View factory list' : 'Xem danh sách nhà máy'}</span>
                    <ChevronRight className="w-3 h-3 ml-0.5" />
                  </Link>
                </div>
              ))
            )}

            {/* Factory Province Cluster List */}
            {activeItem.type === 'factory-province' && activeItem.factories && (
              activeItem.factories.map((fac, idx) => (
                <div key={idx} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 line-clamp-1 font-bold font-heading">{fac.name}</strong>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 shrink-0 font-mono">
                      {fac.type || (lang === 'en' ? 'Private' : 'Tư nhân')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">📍 {fac.kcnName}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">⚙️ {fac.industry || (lang === 'en' ? 'Manufacturing' : 'Sản xuất công nghiệp')}</p>
                </div>
              ))
            )}

            {/* Supplier Province List */}
            {activeItem.type === 'supplier-province' && activeItem.suppliers && (
              activeItem.suppliers.map((sup, idx) => (
                <div key={idx} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 line-clamp-1 font-bold font-heading">{sup.name}</strong>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700 shrink-0 font-mono">
                      {sup.type || (lang === 'en' ? 'Private' : 'Tư nhân')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">⚙️ {sup.category}</p>
                </div>
              ))
            )}

            {/* Demand Province List */}
            {activeItem.type === 'demand-province' && activeItem.demands && (
              activeItem.demands.map((d, idx) => (
                <div key={idx} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 line-clamp-1 font-bold font-heading">{d.title}</strong>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700 shrink-0 font-mono">
                      {d.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-bold font-mono">💰 {d.budget}</p>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/80">
            <Link
              to={`/khu-cong-nghiep?province=${encodeURIComponent(activeItem.province || '')}`}
              className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-xs transition font-heading uppercase shadow-md shadow-blue-500/20"
            >
              {lang === 'en' ? `View all in ${activeItem.province || 'this region'} →` : `Xem tất cả tại ${activeItem.province || 'khu vực này'} →`}
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
