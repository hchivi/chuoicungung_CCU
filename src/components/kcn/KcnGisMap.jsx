import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { 
  Building2, Factory, Users, ShoppingBag, MapPin, Search, 
  Layers, Compass, ChevronRight, ExternalLink, Filter, 
  RotateCcw, Maximize2, Minimize2, CheckCircle2, Clock,
  Anchor, Plane, Navigation, Sliders, ShieldCheck, Sparkles,
  ArrowRight, Check, X, Eye, PhoneCall, FileText, ChevronDown, ChevronUp, Radio
} from 'lucide-react';
import provinceCoords from '../../data/provinceCoordinates.json';
import industrialParksData from '../../data/industrialParksFull.json';
import expresswaysData from '../../data/vietnamExpressways.json';
import { 
  LOGISTICS_HUBS, 
  calculateKcnLogistics, 
  calculateRadiusEcosystem,
  PROVINCE_COORDS,
  getDistanceFromLatLonInKm 
} from '../../utils/kcnLogisticsUtils';
import { useLanguage } from '../../contexts/LanguageContext';
import { slugify } from '../../pages/IndustryCategoryPage';
import KcnSiteVisitModal from './KcnSiteVisitModal';
import KcnBrochureModal from './KcnBrochureModal';

// Coordinates center for 5 economic regions
const REGION_VIEWPORTS = {
  "Toàn quốc": { center: [16.2, 107.8], zoom: 6 },
  "Miền Bắc": { center: [21.0, 105.8], zoom: 7 },
  "Miền Trung": { center: [16.0, 107.8], zoom: 7 },
  "Đông Nam Bộ": { center: [11.0, 106.8], zoom: 8 },
  "Đồng bằng Sông Cửu Long": { center: [10.0, 105.7], zoom: 8 },
  "Tây Nguyên": { center: [13.5, 108.2], zoom: 7 }
};

export default function KcnGisMap({ 
  initialRegion = 'Toàn quốc', 
  height = '100%',
  externalFlyTo = null,
  isStandalonePage = false
}) {
  const { t, lang } = useLanguage();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // Layer Groups Refs
  const kcnLayerRef = useRef(null);
  const seaportLayerRef = useRef(null);
  const airportLayerRef = useRef(null);
  const expresswayLayerRef = useRef(null);
  const radiusLayerRef = useRef(null);

  // Map Navigation & Zoom State
  const [currentZoom, setCurrentZoom] = useState(6);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [minReadyLand, setMinReadyLand] = useState(0); // 0, 5, 10, 20, 50 (Ha)
  const [selectedSegment, setSelectedSegment] = useState('all'); // all | eco | hitech | multi | ccn
  const [selectedProvince, setSelectedProvince] = useState('all');

  // Macro Infrastructure Layer Toggles
  const [showSeaports, setShowSeaports] = useState(true);
  const [showAirports, setShowAirports] = useState(true);
  const [showExpressways, setShowExpressways] = useState(true);

  // Radius Search State
  const [isRadiusMode, setIsRadiusMode] = useState(false);
  const [radiusKm, setRadiusKm] = useState(20); // 10, 20, 30, 50
  const [radiusCenter, setRadiusCenter] = useState(null); // [lat, lng]
  const [radiusAnalytics, setRadiusAnalytics] = useState(null);

  // Smart Data Drawer & Modals State
  const [selectedKcn, setSelectedKcn] = useState(null);
  const [selectedKcnLogistics, setSelectedKcnLogistics] = useState(null);
  const [siteVisitModalData, setSiteVisitModalData] = useState({ isOpen: false, kcn: null, logistics: null });
  const [brochureModalData, setBrochureModalData] = useState({ isOpen: false, kcn: null, logistics: null });

  // 1. Text Normalizer for search
  const removeAccents = (str) => {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase();
  };

  // 2. Filter KCNs by current criteria
  const filteredKcns = useMemo(() => {
    const qClean = removeAccents(searchTerm.trim());

    return industrialParksData.filter(kcn => {
      const nameClean = removeAccents(kcn.name);
      const provClean = removeAccents(kcn.province);
      const locClean = removeAccents(kcn.location);

      // Search match
      const matchesSearch = !qClean || nameClean.includes(qClean) || provClean.includes(qClean) || locClean.includes(qClean);
      
      // Region match
      const matchesRegion = selectedRegion === 'Toàn quốc' || kcn.region === selectedRegion;

      // Province match
      const matchesProvince = selectedProvince === 'all' || (kcn.province && kcn.province.toLowerCase() === selectedProvince.toLowerCase());

      // Logistics & land metrics
      const log = calculateKcnLogistics(kcn);

      // Ready land filter
      const matchesLand = (log.readyLandHa || 0) >= minReadyLand;

      // Segment filter
      let matchesSegment = true;
      if (selectedSegment === 'eco') {
        matchesSegment = log.segment.includes('Sinh Thái');
      } else if (selectedSegment === 'hitech') {
        matchesSegment = log.segment.includes('Công Nghệ Cao');
      } else if (selectedSegment === 'multi') {
        matchesSegment = log.segment.includes('Đa Ngành');
      } else if (selectedSegment === 'ccn') {
        matchesSegment = log.segment.includes('Cụm Công Nghiệp');
      }

      return matchesSearch && matchesRegion && matchesProvince && matchesLand && matchesSegment;
    });
  }, [searchTerm, selectedRegion, selectedProvince, minReadyLand, selectedSegment]);

  // 3. Aggregate Province Clusters from filtered KCNs
  const provinceClusters = useMemo(() => {
    const map = {};
    filteredKcns.forEach((kcn) => {
      const p = kcn.province || 'Hà Nội';
      if (!map[p]) {
        map[p] = {
          province: p,
          region: kcn.region || 'Miền Bắc',
          kcns: [],
          factoriesCount: 0,
          readyLandSum: 0
        };
      }
      const log = calculateKcnLogistics(kcn);
      map[p].kcns.push({ ...kcn, logistics: log });
      map[p].factoriesCount += log.operatingFactoriesCount || 0;
      map[p].readyLandSum += log.readyLandHa || 0;
    });
    return map;
  }, [filteredKcns]);

  // Unique province list for filter dropdown
  const uniqueProvinces = useMemo(() => {
    const set = new Set();
    industrialParksData.forEach(k => {
      if (k.province) set.add(k.province);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
  }, []);

  // 4. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [16.2, 107.8],
        zoom: 6,
        minZoom: 5,
        maxZoom: 16,
        maxBounds: [
          [7.0, 100.5], // Southwest
          [24.8, 118.5]  // Northeast
        ],
        maxBoundsViscosity: 0.85,
        zoomControl: false,
        attributionControl: false
      });

      // High-performance light mode standard vector tiles (Google Maps Standard without watermark / Carto Light)
      L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 19
      }).addTo(map);

      // Custom Zoom Control (bottom-right)
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Layer groups
      expresswayLayerRef.current = L.layerGroup().addTo(map);
      seaportLayerRef.current = L.layerGroup().addTo(map);
      airportLayerRef.current = L.layerGroup().addTo(map);
      radiusLayerRef.current = L.layerGroup().addTo(map);
      kcnLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;

      // Track zoom level changes
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      // Handle map click for Radius Measurement mode
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        // If clicking on map in radius mode or default
        setRadiusCenter([lat, lng]);
      });

      // Sovereign Islands (Hoàng Sa, Trường Sa, Phú Quốc) with Neon Tech Badges
      const hoangSaIcon = L.divIcon({
        className: 'custom-island-marker',
        html: `
          <div class="px-2.5 py-1 rounded-xl bg-slate-950/90 text-amber-300 font-extrabold text-[10px] border border-amber-400/70 shadow-xl backdrop-blur-md whitespace-nowrap flex items-center space-x-1 ring-2 ring-amber-400/20">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>🇻🇳 QUẦN ĐẢO HOÀNG SA (VIỆT NAM)</span>
          </div>
        `,
        iconSize: [195, 28],
        iconAnchor: [97, 14]
      });
      L.marker([16.5, 112.0], { icon: hoangSaIcon }).addTo(map);

      const truongSaIcon = L.divIcon({
        className: 'custom-island-marker',
        html: `
          <div class="px-2.5 py-1 rounded-xl bg-slate-950/90 text-amber-300 font-extrabold text-[10px] border border-amber-400/70 shadow-xl backdrop-blur-md whitespace-nowrap flex items-center space-x-1 ring-2 ring-amber-400/20">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>🇻🇳 QUẦN ĐẢO TRƯỜNG SA (VIỆT NAM)</span>
          </div>
        `,
        iconSize: [200, 28],
        iconAnchor: [100, 14]
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

  // 5. Handle external flyTo triggers
  useEffect(() => {
    if (!externalFlyTo || !mapInstanceRef.current) return;

    if (externalFlyTo.type === 'region') {
      const target = REGION_VIEWPORTS[externalFlyTo.name] || REGION_VIEWPORTS['Toàn quốc'];
      setSelectedRegion(externalFlyTo.name);
      mapInstanceRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
    } else if (externalFlyTo.type === 'province') {
      const coords = PROVINCE_COORDS[externalFlyTo.name];
      if (coords) {
        setSelectedProvince(externalFlyTo.name);
        mapInstanceRef.current.flyTo(coords, 9, { duration: 1.2 });
      }
    } else if (externalFlyTo.type === 'kcn' && externalFlyTo.kcn) {
      const log = calculateKcnLogistics(externalFlyTo.kcn);
      mapInstanceRef.current.flyTo([log.lat, log.lng], 11, { duration: 1.2 });
      setSelectedKcn(externalFlyTo.kcn);
      setSelectedKcnLogistics(log);
    }
  }, [externalFlyTo]);

  // 6. Draw Expressway Infrastructure Lines (Polyline Neon Overlay)
  useEffect(() => {
    if (!expresswayLayerRef.current) return;
    const layer = expresswayLayerRef.current;
    layer.clearLayers();

    if (!showExpressways) return;

    expresswaysData.forEach(exp => {
      // Glow background line
      L.polyline(exp.coordinates, {
        color: exp.color,
        weight: 6,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layer);

      // Core crisp line
      const line = L.polyline(exp.coordinates, {
        color: exp.color,
        weight: 3.5,
        opacity: 0.9,
        dashArray: '8, 4'
      }).addTo(layer);

      line.bindTooltip(`
        <div class="font-sans text-xs p-1">
          <strong class="text-blue-700 font-bold block">${exp.code}</strong>
          <span class="text-slate-700">${exp.name}</span>
        </div>
      `, { sticky: true, className: 'highway-tooltip' });
    });
  }, [showExpressways]);

  // 7. Draw Seaport Infrastructure Layer (🚢 Deep-sea Ports)
  useEffect(() => {
    if (!seaportLayerRef.current) return;
    const layer = seaportLayerRef.current;
    layer.clearLayers();

    if (!showSeaports) return;

    LOGISTICS_HUBS.seaports.forEach(port => {
      const isDeep = port.type.toLowerCase().includes('deep');
      const icon = L.divIcon({
        className: 'seaport-gis-marker',
        html: `
          <div class="relative group cursor-pointer transform hover:scale-120 transition duration-200">
            <div class="flex items-center space-x-1.5 px-2.5 py-1 rounded-full ${
              isDeep 
                ? 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white ring-3 ring-blue-400/40 shadow-xl' 
                : 'bg-cyan-700 text-white ring-2 ring-cyan-400/30 shadow-lg'
            } text-[10px] font-bold border border-white whitespace-nowrap font-heading">
              <span class="text-xs">🚢</span>
              <span class="hidden sm:inline">${port.id === 'cai-mep' ? 'Cảng Cái Mép' : port.id === 'lach-huyen' ? 'Cảng Lạch Huyện' : port.name.split('(')[0]}</span>
            </div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-950 text-white text-[9px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
              ${port.name} (${port.draft})
            </div>
          </div>
        `,
        iconSize: [110, 26],
        iconAnchor: [55, 13]
      });

      const marker = L.marker([port.lat, port.lng], { icon }).addTo(layer);
      marker.on('click', () => {
        setRadiusCenter([port.lat, port.lng]);
        mapInstanceRef.current?.setView([port.lat, port.lng], 10, { animate: true });
      });
    });
  }, [showSeaports]);

  // 8. Draw Airport Infrastructure Layer (✈️ International Airports)
  useEffect(() => {
    if (!airportLayerRef.current) return;
    const layer = airportLayerRef.current;
    layer.clearLayers();

    if (!showAirports) return;

    LOGISTICS_HUBS.airports.forEach(ap => {
      const isHub = ap.code === 'HAN' || ap.code === 'SGN' || ap.code === 'LTX';
      const icon = L.divIcon({
        className: 'airport-gis-marker',
        html: `
          <div class="relative group cursor-pointer transform hover:scale-120 transition duration-200">
            <div class="flex items-center space-x-1 px-2.5 py-1 rounded-full ${
              isHub 
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white ring-3 ring-amber-400/40 shadow-xl animate-pulse' 
                : 'bg-slate-800 text-amber-300 ring-2 ring-slate-600 shadow-lg'
            } text-[10px] font-extrabold border border-white whitespace-nowrap font-mono">
              <span class="text-xs">✈️</span>
              <span>${ap.code}</span>
            </div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-950 text-white text-[9px] font-mono rounded shadow-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
              ${ap.name} (${ap.capacity})
            </div>
          </div>
        `,
        iconSize: [68, 26],
        iconAnchor: [34, 13]
      });

      const marker = L.marker([ap.lat, ap.lng], { icon }).addTo(layer);
      marker.on('click', () => {
        setRadiusCenter([ap.lat, ap.lng]);
        mapInstanceRef.current?.setView([ap.lat, ap.lng], 10, { animate: true });
      });
    });
  }, [showAirports]);

  // 9. Draw Radius Search Circle Overlay & Compute Realtime Ecosystem Metrics
  useEffect(() => {
    if (!radiusLayerRef.current) return;
    const layer = radiusLayerRef.current;
    layer.clearLayers();

    if (!radiusCenter) {
      setRadiusAnalytics(null);
      return;
    }

    // Compute spatial ecosystem inside circle
    const analytics = calculateRadiusEcosystem(radiusCenter[0], radiusCenter[1], radiusKm, industrialParksData);
    setRadiusAnalytics(analytics);

    // Draw interactive radius circle on map
    const circle = L.circle(radiusCenter, {
      radius: radiusKm * 1000, // meters
      color: '#0052cc',
      fillColor: '#0284c7',
      fillOpacity: 0.12,
      weight: 2,
      dashArray: '6, 6'
    }).addTo(layer);

    // Center pulse icon
    const centerIcon = L.divIcon({
      className: 'radius-center-pin',
      html: `
        <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg ring-4 ring-blue-400/50 flex items-center justify-center animate-ping"></div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    L.marker(radiusCenter, { icon: centerIcon }).addTo(layer);

  }, [radiusCenter, radiusKm]);

  // 10. Draw KCN Markers & Dynamic Province Clusters
  useEffect(() => {
    if (!kcnLayerRef.current) return;
    const layer = kcnLayerRef.current;
    layer.clearLayers();

    const isZoomedIn = currentZoom >= 8;

    if (!isZoomedIn) {
      // PROVINCE CLUSTERS VIEW (When looking at nationwide or region)
      Object.entries(provinceClusters).forEach(([provName, cluster]) => {
        const coords = PROVINCE_COORDS[provName];
        if (!coords) return;

        const kcnCount = cluster.kcns.length;
        if (kcnCount === 0) return;

        const totalReady = cluster.readyLandSum;

        const markerHtml = `
          <div class="relative group cursor-pointer transform hover:scale-115 transition duration-200">
            <div class="flex items-center space-x-1.5 px-3 py-1.5 rounded-full ${
              kcnCount >= 20 
                ? 'bg-gradient-to-r from-blue-700 to-indigo-900 text-white ring-4 ring-blue-500/35 shadow-2xl' 
                : kcnCount >= 10 
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white ring-3 ring-indigo-500/25 shadow-xl' 
                  : 'bg-blue-600 text-white ring-2 ring-blue-400/20 shadow-lg'
            } font-mono font-bold text-xs border border-white">
              <svg class="w-3.5 h-3.5 shrink-0 text-blue-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
              </svg>
              <span>${kcnCount} KCN</span>
            </div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900/95 text-white text-[10px] font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
              ${provName} (${totalReady} Ha sẵn sàng)
            </div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'kcn-cluster-marker',
          html: markerHtml,
          iconSize: [95, 32],
          iconAnchor: [47, 16]
        });

        const marker = L.marker(coords, { icon }).addTo(layer);
        marker.on('click', () => {
          mapInstanceRef.current?.flyTo(coords, 9, { duration: 1.0 });
        });
      });
    } else {
      // DETAILED INDIVIDUAL KCN PINS (When zoomed in)
      filteredKcns.forEach((kcn) => {
        const log = calculateKcnLogistics(kcn);
        const isEco = log.segment.includes('Sinh Thái');
        const isHiTech = log.segment.includes('Công Nghệ Cao');

        const isSelected = selectedKcn && selectedKcn.id === kcn.id;

        const markerHtml = `
          <div class="relative group cursor-pointer transform ${isSelected ? 'scale-125 z-40' : 'hover:scale-115'} transition duration-150">
            <div class="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl ${
              isSelected 
                ? 'bg-amber-500 text-slate-950 font-black ring-4 ring-amber-400/50 shadow-2xl'
                : isHiTech 
                  ? 'bg-purple-700 text-white shadow-xl ring-2 ring-purple-400/30'
                  : isEco 
                    ? 'bg-emerald-700 text-white shadow-xl ring-2 ring-emerald-400/30'
                    : 'bg-[#0052cc] text-white shadow-xl ring-2 ring-blue-400/20'
            } text-[11px] font-bold border border-white whitespace-nowrap font-heading">
              <span class="w-2 h-2 rounded-full ${isHiTech ? 'bg-purple-300' : isEco ? 'bg-emerald-300' : 'bg-amber-300'} animate-pulse"></span>
              <span class="max-w-[170px] truncate">${kcn.name}</span>
            </div>
            <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-mono rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
              ${log.readyLandHa} Ha trống • Lấp đầy ${log.occupancyRate}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'kcn-single-pin',
          html: markerHtml,
          iconSize: [180, 26],
          iconAnchor: [90, 13]
        });

        const marker = L.marker([log.lat, log.lng], { icon }).addTo(layer);
        marker.on('click', () => {
          setSelectedKcn(kcn);
          setSelectedKcnLogistics(log);
          setRadiusCenter([log.lat, log.lng]);
        });
      });
    }

  }, [filteredKcns, provinceClusters, currentZoom, selectedKcn]);

  // Handle Region switch
  const handleSelectRegion = (reg) => {
    setSelectedRegion(reg);
    setSelectedProvince('all');
    const target = REGION_VIEWPORTS[reg] || REGION_VIEWPORTS['Toàn quốc'];
    mapInstanceRef.current?.flyTo(target.center, target.zoom, { duration: 1.2 });
  };

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRegion('Toàn quốc');
    setSelectedProvince('all');
    setMinReadyLand(0);
    setSelectedSegment('all');
    setSelectedKcn(null);
    setSelectedKcnLogistics(null);
    setRadiusCenter(null);
    mapInstanceRef.current?.flyTo(REGION_VIEWPORTS['Toàn quốc'].center, REGION_VIEWPORTS['Toàn quốc'].zoom, { duration: 1.2 });
  };

  return (
    <div className={`relative w-full overflow-hidden bg-slate-900 font-sans select-none ${
      isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : (height === '100%' ? 'h-full min-h-[750px]' : '')
    }`} style={{ height: isFullscreen ? '100vh' : (height !== '100%' ? height : undefined) }}>
      
      {/* ========================================================================= */}
      {/* 1. GIS MAP CANVAS (Standard Vector WebGL Rendering)                       */}
      {/* ========================================================================= */}
      <div 
        ref={mapContainerRef}
        className="w-full h-full min-h-[750px] z-10"
      />

      {/* ========================================================================= */}
      {/* 2. FLOATING CONTROL PANEL (Bảng Điều Khiển Nổi bám góc phải màn hình)     */}
      {/* ========================================================================= */}
      <div className={`absolute top-4 right-4 z-30 transition-all duration-300 pointer-events-auto max-w-sm w-full ${
        isPanelCollapsed ? 'w-auto' : 'w-[360px] sm:w-[380px]'
      }`}>
        
        {isPanelCollapsed ? (
          <button
            onClick={() => setIsPanelCollapsed(false)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 text-slate-800 hover:text-blue-700 font-bold text-xs uppercase font-heading cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Mở Bảng Điều Khiển GIS</span>
          </button>
        ) : (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-200/90 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar font-sans text-xs">
            
            {/* Header with Title & Collapse */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                  <Compass className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm font-heading tracking-tight leading-none">
                    GIS COMMAND CENTER
                  </h3>
                  <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mt-0.5">
                    Sa Bàn Quỹ Đất &amp; Hạ Tầng FDI
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={handleResetFilters}
                  title="Đặt lại bộ lọc"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsPanelCollapsed(true)}
                  title="Thu nhỏ bảng điều khiển"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm KCN, Tỉnh thành, Vùng kinh tế..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 font-medium"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 3 Major Economic Zones Chips */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase font-heading tracking-wider flex items-center justify-between">
                <span>Vùng Kinh Tế Trọng Điểm</span>
                <span className="font-mono text-blue-600 font-bold">{filteredKcns.length} KCN Khớp</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Toàn quốc', 'Miền Bắc', 'Miền Trung', 'Đông Nam Bộ', 'Đồng bằng Sông Cửu Long', 'Tây Nguyên'].map((reg) => (
                  <button
                    key={reg}
                    onClick={() => handleSelectRegion(reg)}
                    className={`px-2 py-1.5 rounded-lg text-[10.5px] font-bold text-center truncate transition cursor-pointer font-heading ${
                      selectedRegion === reg
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100/80 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/60'
                    }`}
                  >
                    {reg === 'Đồng bằng Sông Cửu Long' ? 'ĐBSCL' : reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider Lọc Quỹ Đất Sẵn Sàng (Ready Land Area Filter) */}
            <div className="space-y-2 p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 font-heading uppercase">
                  Quỹ Đất Sẵn Sàng Còn Lại
                </span>
                <span className="px-2 py-0.5 bg-blue-600 text-white rounded-md text-[11px] font-black font-mono shadow-2xs">
                  {minReadyLand === 0 ? 'Tất cả quy mô' : `> ${minReadyLand} Ha`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={minReadyLand}
                onChange={(e) => setMinReadyLand(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Mọi quy mô</span>
                <span>&gt;10 Ha</span>
                <span>&gt;25 Ha</span>
                <span>&gt;50 Ha</span>
              </div>
            </div>

            {/* Segment Chips (KCN Sinh Thái / CNC / Đa Ngành / CCN) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase font-heading tracking-wider">
                Phân Khúc Tiêu Chuẩn KCN
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'Tất Cả' },
                  { id: 'eco', label: '🌱 Sinh Thái (Eco-IP)' },
                  { id: 'hitech', label: '⚡ Công Nghệ Cao' },
                  { id: 'multi', label: '🏭 Đa Ngành' },
                  { id: 'ccn', label: '📦 Cụm CN' }
                ].map(seg => (
                  <button
                    key={seg.id}
                    onClick={() => setSelectedSegment(seg.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition font-heading cursor-pointer ${
                      selectedSegment === seg.id
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {seg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Macro Infrastructure Layers Toggles */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase font-heading tracking-wider block">
                Lớp Hạ Tầng Vĩ Mô (Layers)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {/* Toggle Seaports */}
                <button
                  onClick={() => setShowSeaports(!showSeaports)}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                    showSeaports 
                      ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-2xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <span className="text-base">🚢</span>
                  <span className="text-[10px] font-bold font-heading">Cảng Biển</span>
                </button>

                {/* Toggle Airports */}
                <button
                  onClick={() => setShowAirports(!showAirports)}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                    showAirports 
                      ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-2xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <span className="text-base">✈️</span>
                  <span className="text-[10px] font-bold font-heading">Sân Bay QT</span>
                </button>

                {/* Toggle Expressways */}
                <button
                  onClick={() => setShowExpressways(!showExpressways)}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                    showExpressways 
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-2xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <span className="text-base">🛣️</span>
                  <span className="text-[10px] font-bold font-heading">Tuyến Cao Tốc</span>
                </button>
              </div>
            </div>

            {/* Radius Search Controls */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-700 uppercase font-heading flex items-center space-x-1">
                  <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>Đo Bán Kính Chuỗi Cung Ứng</span>
                </span>
                {radiusCenter && (
                  <button
                    onClick={() => setRadiusCenter(null)}
                    className="text-[10px] text-rose-600 font-bold hover:underline"
                  >
                    Tắt vòng đo
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-1.5">
                {[10, 20, 30, 50].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadiusKm(r)}
                    className={`flex-1 py-1 rounded-lg text-[10.5px] font-mono font-bold transition cursor-pointer ${
                      radiusKm === r
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400">
                * Nhấp vào bất kỳ KCN hoặc vị trí nào trên bản đồ để khoanh vòng tròn phân tích.
              </p>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. FLOATING RADIUS ANALYTICS CARD (Khi người dùng khoanh bán kính)         */}
      {/* ========================================================================= */}
      {radiusAnalytics && (
        <div className="absolute bottom-6 left-4 z-30 max-w-sm w-full bg-slate-950/90 text-white backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-slate-700 space-y-2.5 animate-in slide-in-from-bottom-5 font-sans pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h4 className="font-extrabold text-xs font-heading uppercase text-emerald-400">
                Hệ Sinh Thái Trong Bán Kính {radiusKm} KM
              </h4>
            </div>
            <button 
              onClick={() => setRadiusCenter(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
              <div className="text-lg font-black font-mono text-amber-400">{radiusAnalytics.kcnsCount}</div>
              <p className="text-[10px] text-slate-400 font-medium">Khu công nghiệp</p>
            </div>
            <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
              <div className="text-lg font-black font-mono text-sky-400">{radiusAnalytics.totalReadyLandHa} Ha</div>
              <p className="text-[10px] text-slate-400 font-medium">Đất sẵn sàng</p>
            </div>
            <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
              <div className="text-lg font-black font-mono text-purple-400">{radiusAnalytics.totalTier2Suppliers}+</div>
              <p className="text-[10px] text-slate-400 font-medium">Nhà cung ứng VIP</p>
            </div>
            <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
              <div className="text-lg font-black font-mono text-emerald-400">{radiusAnalytics.totalFactories}</div>
              <p className="text-[10px] text-slate-400 font-medium">Nhà máy FDI</p>
            </div>
          </div>

          {radiusAnalytics.seaportsInRadius.length > 0 && (
            <div className="text-[11px] text-slate-300">
              🚢 <strong>Cảng biển gần nhất:</strong> {radiusAnalytics.seaportsInRadius[0].name} ({radiusAnalytics.seaportsInRadius[0].distanceKm} km)
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TOP-LEFT TOOLBAR: FULLSCREEN & OVERVIEW                                 */}
      {/* ========================================================================= */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 pointer-events-auto">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5. SMART DATA DRAWER (Slide-out Panel trượt từ cạnh phải khi click KCN)   */}
      {/* ========================================================================= */}
      {selectedKcn && selectedKcnLogistics && (
        <div className="absolute top-4 right-4 bottom-4 w-96 sm:w-[420px] bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/90 z-40 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right-10 duration-300 pointer-events-auto font-sans">
          
          {/* Top Header */}
          <div className="relative p-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/50">
            <button
              onClick={() => setSelectedKcn(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-800 flex items-center justify-center font-bold text-xs shadow-xs"
            >
              ✕
            </button>

            <div className="space-y-2 pr-8">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase font-heading">
                  {selectedKcnLogistics.segment}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Xác thực FDI</span>
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-950 font-heading leading-tight">
                {selectedKcn.name}
              </h3>
              
              <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="font-semibold text-slate-800">{selectedKcn.province}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{selectedKcn.region}</span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs divide-y divide-slate-100">
            
            {/* Core Macro Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Quỹ Đất Sẵn Sàng</span>
                <div className="text-base font-black text-[#0052cc] font-mono">
                  {selectedKcnLogistics.readyLandHa} Ha
                </div>
                <div className="text-[10px] text-slate-400">Tổng quy mô: {selectedKcnLogistics.totalScaleHa} Ha</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Tỷ Lệ Lấp Đầy</span>
                <div className="text-base font-black text-emerald-600 font-mono">
                  {selectedKcnLogistics.occupancyRate}
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-emerald-500 h-full rounded-full" 
                    style={{ width: selectedKcnLogistics.occupancyRate }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Giá Thuê Tham Chiếu</span>
                <div className="text-xs font-black text-slate-900 font-mono">
                  {selectedKcnLogistics.rentPrice}
                </div>
                <div className="text-[10px] text-slate-400">Hợp đồng dài hạn 50 năm</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Nhà Máy Hoạt Động</span>
                <div className="text-base font-black text-purple-600 font-mono">
                  {selectedKcnLogistics.operatingFactoriesCount} NM
                </div>
                <div className="text-[10px] text-slate-400">Chủ yếu doanh nghiệp FDI</div>
              </div>
            </div>

            {/* Macro Logistics Distances */}
            <div className="pt-3 space-y-2">
              <h4 className="font-extrabold text-slate-900 uppercase font-heading text-[11px] tracking-wider flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>Khoảng Cách Logistics Vĩ Mô</span>
              </h4>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2.5 bg-blue-50/70 rounded-xl border border-blue-100/80">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">🚢</span>
                    <div>
                      <strong className="block text-slate-900 text-[11px]">{selectedKcnLogistics.seaport.name}</strong>
                      <span className="text-[10px] text-slate-500">{selectedKcnLogistics.seaport.type}</span>
                    </div>
                  </div>
                  <span className="font-black font-mono text-blue-700 text-xs">
                    {selectedKcnLogistics.seaport.distanceKm} km
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-amber-50/70 rounded-xl border border-amber-100/80">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">✈️</span>
                    <div>
                      <strong className="block text-slate-900 text-[11px]">{selectedKcnLogistics.airport.name}</strong>
                      <span className="text-[10px] text-slate-500">{selectedKcnLogistics.airport.capacity}</span>
                    </div>
                  </div>
                  <span className="font-black font-mono text-amber-700 text-xs">
                    {selectedKcnLogistics.airport.distanceKm} km
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">🛣️</span>
                    <strong className="text-slate-800 text-[11px]">{selectedKcnLogistics.highway}</strong>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 font-mono">Kết nối trực tiếp</span>
                </div>
              </div>
            </div>

            {/* Ecosystem & Tier 2/3 Integration */}
            <div className="pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 uppercase font-heading text-[11px] tracking-wider flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>Hệ Sinh Thái Cung Ứng Phụ Trợ</span>
                </h4>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-mono font-bold text-[10px] rounded-md">
                  {selectedKcnLogistics.tier2SuppliersCount}+ NCC Lớp 2/3
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                Đang có <strong>{selectedKcnLogistics.tier2SuppliersCount} Nhà cung cấp Lớp 2/3</strong> sẵn sàng phục vụ tại KCN này trong các ngành cơ khí chính xác, MEP, bao bì ESD, phòng sạch và xử lý nước thải.
              </p>

              {/* Priority Industries Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedKcnLogistics.priorityIndustries.map((ind, idx) => (
                  <Link 
                    key={idx}
                    to={`/nganh-nghe/${slugify(ind)}?name=${encodeURIComponent(ind)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 rounded-lg text-[10px] font-semibold transition"
                    title={`Xem nhà cung ứng ngành: ${ind}`}
                  >
                    ⚡ {ind}
                  </Link>
                ))}
              </div>
            </div>

            {/* Radius Button */}
            <div className="pt-3">
              <button
                onClick={() => setRadiusCenter([selectedKcnLogistics.lat, selectedKcnLogistics.lng])}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 font-heading cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-rose-500" />
                <span>Khoanh Vùng Bán Kính 20km Quanh KCN Này</span>
              </button>
            </div>

          </div>

          {/* Contextual CTAs (Khớp Lệnh Nhanh FDI) */}
          <div className="p-4 bg-slate-50 border-t border-slate-200/90 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSiteVisitModalData({ isOpen: true, kcn: selectedKcn, logistics: selectedKcnLogistics })}
                className="py-3 px-3 bg-gradient-to-r from-[#003d8f] via-[#0052cc] to-[#0066d6] hover:from-[#00347a] hover:to-[#004fa8] text-white rounded-xl text-center font-bold text-xs font-heading uppercase tracking-wide shadow-md transition cursor-pointer flex items-center justify-center space-x-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Gửi Yêu Cầu Thuê Đất</span>
              </button>

              <button
                onClick={() => setBrochureModalData({ isOpen: true, kcn: selectedKcn, logistics: selectedKcnLogistics })}
                className="py-3 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-center font-bold text-xs font-heading uppercase tracking-wide transition cursor-pointer flex items-center justify-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Hồ Sơ Quy Hoạch</span>
              </button>
            </div>

            <Link
              to={`/khu-cong-nghiep/${selectedKcn.id}`}
              className="block w-full py-2 text-center text-blue-700 hover:text-blue-900 font-bold text-xs font-heading uppercase transition"
            >
              Xem Trang Chi Tiết KCN &amp; Danh Sách Nhà Máy FDI →
            </Link>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODALS                                                                 */}
      {/* ========================================================================= */}
      <KcnSiteVisitModal
        isOpen={siteVisitModalData.isOpen}
        onClose={() => setSiteVisitModalData({ isOpen: false, kcn: null, logistics: null })}
        kcn={siteVisitModalData.kcn}
        logisticsInfo={siteVisitModalData.logistics}
      />

      <KcnBrochureModal
        isOpen={brochureModalData.isOpen}
        onClose={() => setBrochureModalData({ isOpen: false, kcn: null, logistics: null })}
        kcn={brochureModalData.kcn}
        logisticsInfo={brochureModalData.logistics}
      />

    </div>
  );
}
