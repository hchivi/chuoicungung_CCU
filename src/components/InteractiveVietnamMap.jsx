import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { 
  Building2, Factory, Users, ShoppingBag, MapPin, Search, 
  Layers, Compass, ChevronRight, ExternalLink, Filter, 
  RotateCcw, Maximize2, Minimize2, CheckCircle2, Clock,
  Ship, Plane, Navigation, ShieldCheck, Zap, Sparkles, Send,
  SlidersHorizontal, ChevronLeft, ArrowRight, Eye, PhoneCall,
  Flame, Leaf, Cpu, Award
} from 'lucide-react';
import provinceCoords from '../data/provinceCoordinates.json';
import industrialParksData from '../data/industrialParksFull.json';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  DEEP_WATER_SEAPORTS, 
  INTERNATIONAL_AIRPORTS, 
  MAJOR_EXPRESSWAYS, 
  STRATEGIC_GIS_IPS 
} from '../data/infrastructureMapData';

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
  height = '100%',
  externalFlyTo = null,
  onRequestQuote = null
}) {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const infraLayerRef = useRef(null);
  const radiusCircleRef = useRef(null);

  // Filter & Layer Toggles
  const [currentZoom, setCurrentZoom] = useState(6);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [searchQuery, setSearchQuery] = useState('');
  const [minAvailableLand, setMinAvailableLand] = useState(0); // 0 (all) | 10 | 50 | 100
  const [occupancyFilter, setOccupancyFilter] = useState('all'); // 'all' | 'under50' | '50-80' | 'over80'
  const [isEcoOnly, setIsEcoOnly] = useState(false);
  const [isHighTechOnly, setIsHighTechOnly] = useState(false);
  const [isRbfOnly, setIsRbfOnly] = useState(false);

  // Macro Infrastructure Layers Toggles
  const [showSeaports, setShowSeaports] = useState(true);
  const [showAirports, setShowAirports] = useState(true);
  const [showExpressways, setShowExpressways] = useState(false);

  // Selected KCN Drawer State
  const [selectedIP, setSelectedIP] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [radiusKm, setRadiusKm] = useState(20); // 10 | 20 | 50 km
  const [isRadiusActive, setIsRadiusActive] = useState(false);

  // Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);

  // Combine default dataset with rich strategic GIS IPs
  const allEnrichedIPs = useMemo(() => {
    const combined = [...STRATEGIC_GIS_IPS];
    const existingIds = new Set(STRATEGIC_GIS_IPS.map(i => i.id));

    industrialParksData.forEach((ip) => {
      if (!existingIds.has(ip.id)) {
        combined.push({
          id: ip.id,
          name: ip.name,
          shortName: ip.shortName || ip.name,
          coords: [ip.lat || 10.8, ip.lng || 106.7],
          province: ip.province || 'Hà Nội',
          region: ip.region || 'Miền Bắc',
          investor: ip.investor || 'Ban Quản Lý Các KCN Tỉnh',
          establishedYear: ip.establishedYear || 2010,
          totalAreaHa: ip.totalAreaHa || ip.area || 300,
          availableLandHa: ip.availableLandHa || (ip.totalAreaHa ? Math.round(ip.totalAreaHa * 0.2) : 25),
          occupancyRate: ip.occupancyRate || '85%',
          rentalPrice: ip.rentalPrice || '$110 - $160 / m²',
          rbfAvailable: ip.rbfAvailable ?? true,
          isEcoPark: ip.isEcoPark ?? false,
          isHighTech: ip.isHighTech ?? (ip.name?.toLowerCase().includes('công nghệ cao') || false),
          categoryType: ip.categoryType || 'Khu Công Nghiệp Đa Ngành',
          priorityIndustries: ip.priorityIndustries || ['Cơ khí & Chế tạo', 'Điện tử', 'Logistics'],
          fdiTenants: ip.fdiTenants || ['FDI Nhật Bản', 'FDI Hàn Quốc', 'FDI Đài Loan'],
          activeFactories: ip.totalFactories || (ip.factories ? ip.factories.length : 40),
          ecosystemSuppliersCount: Math.round((ip.totalFactories || 40) * 0.4) + 15,
          distanceToPort: ip.distanceToPort || 'Cách Cảng nước sâu 25 - 45km',
          distanceToAirport: ip.distanceToAirport || 'Cách Sân bay Quốc tế 20 - 35km',
          distanceToHighway: ip.distanceToHighway || 'Kết nối trực tiếp trục Quốc lộ huyết mạch',
          image: ip.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'
        });
      }
    });

    return combined;
  }, []);

  // Filtered IPs based on Control Panel settings
  const filteredIPs = useMemo(() => {
    return allEnrichedIPs.filter(ip => {
      // Region
      if (selectedRegion !== 'Toàn quốc') {
        if (ip.region !== selectedRegion && !ip.province?.includes(selectedRegion)) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = ip.name.toLowerCase().includes(q) || ip.shortName.toLowerCase().includes(q);
        const matchProv = ip.province.toLowerCase().includes(q);
        const matchInvestor = ip.investor?.toLowerCase().includes(q);
        const matchTenants = ip.fdiTenants?.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchProv && !matchInvestor && !matchTenants) {
          return false;
        }
      }

      // Minimum Available Land (ha)
      if (minAvailableLand > 0) {
        if ((ip.availableLandHa || 0) < minAvailableLand) return false;
      }

      // Occupancy Rate
      if (occupancyFilter !== 'all') {
        const rateNum = parseInt(ip.occupancyRate) || 80;
        if (occupancyFilter === 'under50' && rateNum >= 50) return false;
        if (occupancyFilter === '50-80' && (rateNum < 50 || rateNum > 80)) return false;
        if (occupancyFilter === 'over80' && rateNum < 80) return false;
      }

      // Toggles
      if (isEcoOnly && !ip.isEcoPark) return false;
      if (isHighTechOnly && !ip.isHighTech) return false;
      if (isRbfOnly && !ip.rbfAvailable) return false;

      return true;
    });
  }, [allEnrichedIPs, selectedRegion, searchQuery, minAvailableLand, occupancyFilter, isEcoOnly, isHighTechOnly, isRbfOnly]);

  // Aggregate clusters by province
  const provinceClusters = useMemo(() => {
    const map = {};
    filteredIPs.forEach(ip => {
      const prov = ip.province || 'Bình Dương';
      if (!map[prov]) {
        const pCoord = provinceCoords[prov] || ip.coords || [16.0, 107.5];
        map[prov] = {
          province: prov,
          region: ip.region,
          coords: [pCoord.lat || pCoord[0], pCoord.lng || pCoord[1]],
          ips: [],
          totalAvailableLand: 0,
          totalFactories: 0
        };
      }
      map[prov].ips.push(ip);
      map[prov].totalAvailableLand += (ip.availableLandHa || 0);
      map[prov].totalFactories += (ip.activeFactories || 0);
    });
    return Object.values(map);
  }, [filteredIPs]);

  // Initialize Leaflet Map with High-Tech Dark Mode WebGL Tile Layer
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [16.0, 107.5],
        zoom: 6,
        minZoom: 5,
        maxZoom: 16,
        maxBounds: [
          [7.0, 100.0],
          [24.5, 119.0]
        ],
        maxBoundsViscosity: 0.8,
        zoomControl: false,
        attributionControl: false
      });

      // Dark Mode Tile Layer (CartoDB Dark Matter / High-Tech GIS Command Center)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
        ext: 'png'
      }).addTo(map);

      // Dedicated layer groups
      markersLayerRef.current = L.layerGroup().addTo(map);
      infraLayerRef.current = L.layerGroup().addTo(map);

      // Track zoom level for dynamic un-clustering
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep instance alive or clean up
    };
  }, []);

  // Handle external fly-to actions
  useEffect(() => {
    if (!externalFlyTo || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (externalFlyTo.type === 'region') {
      const vp = REGION_VIEWPORTS[externalFlyTo.name] || REGION_VIEWPORTS["Toàn quốc"];
      map.flyTo(vp.center, vp.zoom, { duration: 1.2 });
      setSelectedRegion(externalFlyTo.name);
    } else if (externalFlyTo.type === 'province') {
      const pCoord = provinceCoords[externalFlyTo.name];
      if (pCoord) {
        map.flyTo([pCoord.lat, pCoord.lng], 9, { duration: 1.2 });
      }
    }
  }, [externalFlyTo]);

  // Render Infrastructure Layers (Seaports & Airports)
  useEffect(() => {
    if (!mapInstanceRef.current || !infraLayerRef.current) return;
    const infraLayer = infraLayerRef.current;
    infraLayer.clearLayers();

    // 1. Deep-water Seaports Layer
    if (showSeaports) {
      DEEP_WATER_SEAPORTS.forEach(port => {
        const portIcon = L.divIcon({
          className: 'custom-infra-port-icon',
          html: `
            <div class="relative group cursor-pointer flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.8)] backdrop-blur-xs group-hover:scale-125 transition-transform">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1M4 18v-4a8 8 0 0 1 16 0v4M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M12 2v2" />
                </svg>
              </div>
              <div class="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 text-cyan-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-cyan-400/40 shadow-lg pointer-events-none opacity-90 group-hover:opacity-100">
                🚢 ${port.shortName}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker(port.coords, { icon: portIcon });
        marker.bindPopup(`
          <div class="p-3 bg-slate-900 text-white rounded-2xl border border-cyan-500/40 font-sans space-y-1.5 min-w-[220px]">
            <div class="flex items-center space-x-1.5 text-cyan-400 text-xs font-bold font-mono">
              <span>🚢 CẢNG NƯỚC SÂU</span>
            </div>
            <h4 class="font-black text-xs text-white font-heading">${port.name}</h4>
            <div class="text-[11px] text-slate-300 space-y-0.5 font-mono">
              <p>• Mớn nước: <strong>${port.draft}</strong></p>
              <p>• Công suất: <strong>${port.capacity}</strong></p>
              <p>• Tuyến trực tiếp: ${port.directRoutes}</p>
            </div>
          </div>
        `, { className: 'dark-leaflet-popup' });

        infraLayer.addLayer(marker);
      });
    }

    // 2. International Airports Layer
    if (showAirports) {
      INTERNATIONAL_AIRPORTS.forEach(airport => {
        const airportIcon = L.divIcon({
          className: 'custom-infra-airport-icon',
          html: `
            <div class="relative group cursor-pointer flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-purple-500/20 border-2 border-purple-400 text-purple-300 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.8)] backdrop-blur-xs group-hover:scale-125 transition-transform">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div class="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 text-purple-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-purple-400/40 shadow-lg pointer-events-none opacity-90 group-hover:opacity-100">
                ✈️ ${airport.code}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker(airport.coords, { icon: airportIcon });
        marker.bindPopup(`
          <div class="p-3 bg-slate-900 text-white rounded-2xl border border-purple-500/40 font-sans space-y-1.5 min-w-[220px]">
            <div class="flex items-center space-x-1.5 text-purple-400 text-xs font-bold font-mono">
              <span>✈️ SÂN BAY QUỐC TẾ</span>
            </div>
            <h4 class="font-black text-xs text-white font-heading">${airport.name}</h4>
            <div class="text-[11px] text-slate-300 space-y-0.5 font-mono">
              <p>• Hàng hóa: <strong>${airport.cargoCapacity}</strong></p>
              <p>• Đường băng: <strong>${airport.runways}</strong></p>
            </div>
          </div>
        `, { className: 'dark-leaflet-popup' });

        infraLayer.addLayer(marker);
      });
    }
  }, [showSeaports, showAirports]);

  // Render KCN Pins & Provincial Clusters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    // 1. MACRO VIEW (Zoom <= 7): Render Provincial Clusters with Glow Numbers
    if (currentZoom <= 7) {
      provinceClusters.forEach(cluster => {
        const count = cluster.ips.length;
        if (count === 0) return;

        const clusterIcon = L.divIcon({
          className: 'custom-cluster-icon',
          html: `
            <div class="relative group cursor-pointer flex items-center justify-center">
              <div class="w-11 h-11 rounded-full bg-[#0052cc]/30 border-2 border-cyan-400 text-cyan-300 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.9)] backdrop-blur-md group-hover:scale-115 group-hover:bg-[#0052cc]/50 transition-transform">
                <span class="text-xs font-black font-mono leading-none">${count}</span>
                <span class="text-[8px] font-mono text-slate-300 uppercase leading-none mt-0.5">KCN</span>
              </div>
              <div class="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/95 text-white text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border border-slate-700 shadow-md pointer-events-none">
                ${cluster.province}
              </div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        const marker = L.marker(cluster.coords, { icon: clusterIcon });
        marker.on('click', () => {
          mapInstanceRef.current.flyTo(cluster.coords, 9, { duration: 1.0 });
        });

        markersLayer.addLayer(marker);
      });
    } 
    // 2. MICRO DETAILED VIEW (Zoom >= 8): Un-cluster into Individual Glowing KCN Pins
    else {
      filteredIPs.forEach(ip => {
        const isEco = ip.isEcoPark;
        const isHighTech = ip.isHighTech;

        const pinColor = isHighTech 
          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)]' 
          : isEco 
          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.8)]' 
          : 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.8)]';

        const kcnPinIcon = L.divIcon({
          className: 'custom-kcn-pin-icon',
          html: `
            <div class="relative group cursor-pointer flex items-center justify-center">
              <div class="w-8 h-8 rounded-full border-2 ${pinColor} flex items-center justify-center backdrop-blur-xs group-hover:scale-125 transition-transform">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2zM5 5v14h14V5H5z"/>
                </svg>
              </div>
              <div class="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700 shadow-md pointer-events-none group-hover:border-cyan-400 transition-colors">
                ${ip.shortName}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker(ip.coords, { icon: kcnPinIcon });
        
        marker.on('click', () => {
          setSelectedIP(ip);
          setIsDrawerOpen(true);

          // Pan slightly to center KCN in the left portion so drawer doesn't obstruct
          mapInstanceRef.current.panTo([ip.coords[0], ip.coords[1] - 0.04], { animate: true });
        });

        markersLayer.addLayer(marker);
      });
    }
  }, [filteredIPs, provinceClusters, currentZoom]);

  // Radius Search Circle Overlay
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (radiusCircleRef.current) {
      map.removeLayer(radiusCircleRef.current);
      radiusCircleRef.current = null;
    }

    if (isRadiusActive && selectedIP && selectedIP.coords) {
      const radiusMeters = radiusKm * 1000;
      radiusCircleRef.current = L.circle(selectedIP.coords, {
        radius: radiusMeters,
        color: '#06b6d4',
        fillColor: '#06b6d4',
        fillOpacity: 0.12,
        weight: 2,
        dashArray: '6, 6'
      }).addTo(map);

      map.flyToBounds(radiusCircleRef.current.getBounds(), { padding: [50, 50], duration: 1.0 });
    }
  }, [isRadiusActive, selectedIP, radiusKm]);

  return (
    <div className={`relative w-full overflow-hidden bg-slate-950 font-sans select-none ${
      isFullscreen ? 'fixed inset-0 z-[1500] h-screen w-screen' : 'rounded-3xl border border-slate-800 shadow-2xl h-[780px] lg:h-[860px]'
    }`}>
      
      {/* 1. MAP CONTAINER CANVAS (60FPS WebGL Dark Mode) */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full bg-[#040d1a] z-0" 
      />

      {/* 2. TOP FLOATING MACRO INFRASTRUCTURE TOGGLE BAR */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80 shadow-2xl text-xs text-white">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
          Lớp Hạ Tầng:
        </span>

        {/* Deep-water Seaport Toggle */}
        <button
          onClick={() => setShowSeaports(!showSeaports)}
          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 cursor-pointer text-xs ${
            showSeaports 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]' 
              : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-white'
          }`}
        >
          <Ship className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cảng Nước Sâu (6)</span>
        </button>

        {/* Airport Toggle */}
        <button
          onClick={() => setShowAirports(!showAirports)}
          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 cursor-pointer text-xs ${
            showAirports 
              ? 'bg-purple-500/20 text-purple-300 border border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]' 
              : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-white'
          }`}
        >
          <Plane className="w-3.5 h-3.5 text-purple-400" />
          <span>Sân Bay Quốc Tế (5)</span>
        </button>

        {/* Zoom In/Out & Fullscreen Actions */}
        <div className="flex items-center space-x-1 pl-2 border-l border-slate-700">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs"
            title="Phóng to"
          >
            +
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs"
            title="Thu nhỏ"
          >
            -
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center justify-center ml-1"
            title={isFullscreen ? "Thu nhỏ cửa sổ" : "Mở rộng toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3. FLOATING GLASSMORPHISM CONTROL PANEL (GÓC TRÁI MÀN HÌNH) */}
      <div className={`absolute top-4 left-4 z-20 transition-all duration-300 ${
        isControlPanelOpen ? 'w-80 sm:w-88' : 'w-12'
      }`}>
        {isControlPanelOpen ? (
          <div className="bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 rounded-3xl p-5 shadow-2xl text-white space-y-4 max-h-[85vh] overflow-y-auto scrollbar-thin">
            
            {/* Control Panel Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black font-heading tracking-tight text-cyan-300 uppercase">
                    Bảng Điều Khiển Sa Bàn
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    Hiển thị: <strong>{filteredIPs.length}</strong> KCN khả dụng
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsControlPanelOpen(false)}
                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ◀
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm KCN, Samsung, Foxconn, VSIP..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Region Selector Pills */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Khu Vực Kinh Tế:
              </span>
              <div className="grid grid-cols-3 gap-1 text-[11px] font-heading font-bold">
                {['Toàn quốc', 'Miền Bắc', 'Miền Nam'].map((reg) => (
                  <button
                    key={reg}
                    onClick={() => {
                      setSelectedRegion(reg);
                      const vp = REGION_VIEWPORTS[reg] || REGION_VIEWPORTS["Toàn quốc"];
                      mapInstanceRef.current?.flyTo(vp.center, vp.zoom, { duration: 1.0 });
                    }}
                    className={`py-1.5 px-1 rounded-xl border text-center transition cursor-pointer ${
                      selectedRegion === reg
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Ready Available Land (ha) */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-heading">
                <span className="text-slate-300 font-bold">Quỹ Đất Sẵn Sàng Bàn Giao:</span>
                <span className="font-mono font-black text-cyan-400">
                  {minAvailableLand === 0 ? 'Tất cả' : `> ${minAvailableLand} ha`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono font-bold">
                {[0, 10, 50, 100].map((val) => (
                  <button
                    key={val}
                    onClick={() => setMinAvailableLand(val)}
                    className={`py-1.5 rounded-lg border text-center transition ${
                      minAvailableLand === val
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {val === 0 ? 'Tất cả' : `>${val}ha`}
                  </button>
                ))}
              </div>
            </div>

            {/* Occupancy Rate Filter */}
            <div className="space-y-1.5 pt-1 border-t border-slate-800">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Tỷ Lệ Lấp Đầy KCN:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-heading font-bold">
                {[
                  { id: 'all', label: 'Tất cả tỷ lệ' },
                  { id: 'under50', label: '< 50% (Đất dồi dào)' },
                  { id: '50-80', label: '50% - 80% (Cân bằng)' },
                  { id: 'over80', label: '> 80% (Kín chỗ)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setOccupancyFilter(item.id)}
                    className={`py-1.5 px-2 rounded-xl border text-center transition text-[10.5px] ${
                      occupancyFilter === item.id
                        ? 'bg-blue-600 text-white border-blue-400 font-black'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Standard Toggles (Eco, High-Tech, RBF) */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Chuẩn KCN & Hạ Tầng:
              </span>

              {/* Eco IP Toggle */}
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>KCN Sinh Thái (Eco-IP)</span>
                </div>
                <input
                  type="checkbox"
                  checked={isEcoOnly}
                  onChange={(e) => setIsEcoOnly(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded bg-slate-800 border-slate-700"
                />
              </label>

              {/* High-Tech Semi Toggle */}
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>KCN Công Nghệ Cao / Bán Dẫn</span>
                </div>
                <input
                  type="checkbox"
                  checked={isHighTechOnly}
                  onChange={(e) => setIsHighTechOnly(e.target.checked)}
                  className="w-4 h-4 text-cyan-500 rounded bg-slate-800 border-slate-700"
                />
              </label>

              {/* RBF Warehouse Toggle */}
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Factory className="w-3.5 h-3.5" />
                  <span>Kho Xưởng Xây Sẵn (RBF/RBW)</span>
                </div>
                <input
                  type="checkbox"
                  checked={isRbfOnly}
                  onChange={(e) => setIsRbfOnly(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded bg-slate-800 border-slate-700"
                />
              </label>
            </div>

            {/* Reset Filter Button */}
            {(searchQuery || minAvailableLand > 0 || occupancyFilter !== 'all' || isEcoOnly || isHighTechOnly || isRbfOnly || selectedRegion !== 'Toàn quốc') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('Toàn quốc');
                  setMinAvailableLand(0);
                  setOccupancyFilter('all');
                  setIsEcoOnly(false);
                  setIsHighTechOnly(false);
                  setIsRbfOnly(false);
                  mapInstanceRef.current?.flyTo([16.0, 107.5], 6, { duration: 1.0 });
                }}
                className="w-full py-2 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-xl font-bold text-xs border border-rose-500/30 transition flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt Lại Toàn Bộ Bộ Lọc</span>
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsControlPanelOpen(true)}
            className="w-11 h-11 rounded-2xl bg-slate-950/90 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
            title="Mở Bảng Điều Khiển Sa Bàn"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 4. SMART SLIDE-OUT DATA DRAWER (NGĂN KÉO DỮ LIỆU TRƯỢT CẠNH PHẢI) */}
      {isDrawerOpen && selectedIP && (
        <div className="absolute top-0 right-0 bottom-0 z-30 w-full sm:w-[420px] lg:w-[460px] bg-slate-950/95 backdrop-blur-xl border-l border-cyan-500/30 shadow-2xl flex flex-col text-white animate-in slide-in-from-right duration-300">
          
          {/* Drawer Top Bar */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
                HỒ SƠ GIS KCN & FDI
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedIP.province}
              </span>
            </div>

            <button
              onClick={() => {
                setIsDrawerOpen(false);
                setIsRadiusActive(false);
              }}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            
            {/* Title & Category */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {selectedIP.isHighTech && (
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-400/30">
                    ⚡ Công Nghệ Cao
                  </span>
                )}
                {selectedIP.isEcoPark && (
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-400/30">
                    🌿 Sinh Thái Eco-IP
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black font-heading tracking-tight text-white">
                {selectedIP.name}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Chủ đầu tư: <strong className="text-slate-200">{selectedIP.investor}</strong> (Thành lập: {selectedIP.establishedYear})
              </p>
            </div>

            {/* 4 Essential Industrial Metrics */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Tỷ Lệ Lấp Đầy</span>
                <span className="text-lg font-mono font-black text-cyan-400 block">{selectedIP.occupancyRate}</span>
                <span className="text-[10px] text-slate-500 block">Tổng DT: {selectedIP.totalAreaHa} ha</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Đất Sạch Sẵn Sàng</span>
                <span className="text-lg font-mono font-black text-emerald-400 block">{selectedIP.availableLandHa} ha</span>
                <span className="text-[10px] text-slate-500 block">Bàn giao ngay Q3/2026</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Giá Thuê Tham Khảo</span>
                <span className="text-sm font-mono font-bold text-amber-300 block">{selectedIP.rentalPrice}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Kho Xưởng Xây Sẵn</span>
                <span className="text-xs font-mono font-bold text-purple-300 block">
                  {selectedIP.rbfAvailable ? "✓ Có RBF / RBW" : "Chỉ giao đất"}
                </span>
              </div>
            </div>

            {/* Macro Logistics Distances Section */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold font-heading text-cyan-300">
                <div className="flex items-center space-x-1.5">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span>Khoảng Cách Logistics Vĩ Mô</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Tối ưu vận tải</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 font-mono">
                <div className="flex items-start space-x-2">
                  <Ship className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{selectedIP.distanceToPort}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Plane className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>{selectedIP.distanceToAirport}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{selectedIP.distanceToHighway}</span>
                </div>
              </div>
            </div>

            {/* Ecosystem & Active FDI Tenants */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold font-heading uppercase text-slate-300">
                  Hệ Sinh Thái FDI & Nhà Cung Cấp
                </h4>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {selectedIP.ecosystemSuppliersCount}+ NCC Sẵn Có
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedIP.fdiTenants.map((fdi, fIdx) => (
                  <span key={fIdx} className="px-2.5 py-1 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1">
                    <Building2 className="w-3 h-3 text-blue-400" />
                    <span>{fdi}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Radius Measurement Tool (10km / 20km / 50km) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-heading text-indigo-300">
                  Đo Lường Bán Kính Đệm (Radius Search)
                </span>
                <button
                  onClick={() => setIsRadiusActive(!isRadiusActive)}
                  className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg transition ${
                    isRadiusActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isRadiusActive ? '✓ Đang Bật' : 'Bật Quét'}
                </button>
              </div>

              {isRadiusActive && (
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold">
                    {[10, 20, 50].map((km) => (
                      <button
                        key={km}
                        onClick={() => setRadiusKm(km)}
                        className={`py-1.5 rounded-xl border text-center transition ${
                          radiusKm === km
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                            : 'bg-slate-900 text-slate-300 border-slate-700'
                        }`}
                      >
                        Bán kính {km}km
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Đang quét: <strong>{selectedIP.activeFactories}</strong> Nhà máy FDI và <strong>{selectedIP.ecosystemSuppliersCount}</strong> Nhà cung ứng trong bán kính {radiusKm}km.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Bottom Action CTAs (Đẩy Lead vào hệ thống 18 Pha) */}
          <div className="p-5 bg-slate-900 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                alert(`Đang khởi tạo yêu cầu thuê đất & khảo sát mặt bằng KCN ${selectedIP.shortName} (Pha 1.3)...`);
                navigate('/dang-nhu-cau');
              }}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition flex items-center justify-center space-x-2 font-heading uppercase cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Yêu Cầu Thuê Đất (Pha 1.3)</span>
            </button>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  alert(`Đang tìm kiếm nhà thầu xây dựng & MEP tại KCN ${selectedIP.shortName} (Pha 2.1 - 2.3)...`);
                  navigate('/san-nhu-cau');
                }}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition flex items-center justify-center space-x-1 font-heading"
              >
                <span>Tìm Thầu Xây Dựng (Pha 2)</span>
              </button>

              <button
                onClick={() => {
                  alert(`Đang mở danh sách nhà cung ứng sẵn sàng tại ${selectedIP.shortName}...`);
                  navigate('/founding-partner');
                }}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl border border-slate-700 transition flex items-center justify-center space-x-1 font-heading"
              >
                <span>Nhà Cung Ứng Chuỗi →</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
