import { useState, useEffect, useRef, memo } from 'react';
import LiveLogs from './LiveLogs';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';

// Fix map size on mount
const MapResizer = () => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => map.invalidateSize(), 100);
        let resizeTimeout: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => map.invalidateSize(), 150);
        };
        window.addEventListener('resize', onResize);
        return () => {
            clearTimeout(timer);
            clearTimeout(resizeTimeout);
            window.removeEventListener('resize', onResize);
        };
    }, [map]);
    return null;
};

// Dynamic tile layer
const DynamicTileLayer = ({ url }: { url: string }) => (
    <TileLayer
        key={url}
        url={url}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={18}
        updateWhenIdle={true}
        updateWhenZooming={false}
        keepBuffer={4}
    />
);

// 2 map themes: Light and Dark
const MAP_THEMES = [
    {
        id: 'light',
        name: 'Light',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        thumb: 'https://basemaps.cartocdn.com/rastertiles/voyager/5/11/14.png',
    },
    {
        id: 'dark',
        name: 'Dark',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        thumb: 'https://basemaps.cartocdn.com/dark_all/5/11/14.png',
    },
];

// Threat level → color (traffic style: green = safe, yellow = caution, red = danger)
const getThreatColor = (level: number) => {
    // level: 0–100 (0=safe, 100=critical)
    if (level >= 80) return '#cc0000';      // deep red — critical
    if (level >= 60) return '#e53935';      // red — high
    if (level >= 45) return '#ff6d00';      // orange — elevated
    if (level >= 30) return '#ffab00';      // amber — moderate
    if (level >= 15) return '#ffd600';      // yellow — low-moderate
    return '#43a047';                        // green — safe
};

const getThreatOpacity = (level: number) => {
    if (level >= 80) return 0.85;
    if (level >= 60) return 0.7;
    if (level >= 40) return 0.55;
    return 0.4;
};

const getThreatRadius = (level: number) => {
    if (level >= 80) return 16;
    if (level >= 60) return 12;
    if (level >= 40) return 9;
    if (level >= 20) return 7;
    return 5;
};

const getThreatLabel = (level: number) => {
    if (level >= 80) return 'CRITICAL';
    if (level >= 60) return 'HIGH';
    if (level >= 40) return 'ELEVATED';
    if (level >= 20) return 'MODERATE';
    return 'LOW';
};

// Dense threat data across India — like traffic dots
const THREAT_POINTS = [
    // CRITICAL zones (deep red, large, pulsing)
    { id: 1, pos: [28.6139, 77.2090] as [number, number], name: "New Delhi", type: "Violence Detected", level: 95, time: "1m ago" },
    { id: 2, pos: [22.5726, 88.3639] as [number, number], name: "Kolkata", type: "Weapon Detected", level: 92, time: "2m ago" },
    { id: 3, pos: [26.8467, 80.9462] as [number, number], name: "Lucknow", type: "Mass Violence", level: 88, time: "3m ago" },
    { id: 4, pos: [13.0827, 80.2707] as [number, number], name: "Chennai", type: "Perimeter Breach", level: 82, time: "4m ago" },

    // HIGH (red)
    { id: 5, pos: [19.0760, 72.8777] as [number, number], name: "Mumbai", type: "Suspicious Activity", level: 72, time: "6m ago" },
    { id: 6, pos: [25.3176, 82.9739] as [number, number], name: "Varanasi", type: "Crowd Surge", level: 68, time: "8m ago" },
    { id: 7, pos: [23.2599, 77.4126] as [number, number], name: "Bhopal", type: "Unauth. Vehicle", level: 65, time: "10m ago" },

    // ELEVATED (orange)
    { id: 8, pos: [17.3850, 78.4867] as [number, number], name: "Hyderabad", type: "Crowd Anomaly", level: 55, time: "14m ago" },
    { id: 9, pos: [23.0225, 72.5714] as [number, number], name: "Ahmedabad", type: "Suspicious Object", level: 50, time: "18m ago" },
    { id: 10, pos: [30.7333, 76.7794] as [number, number], name: "Chandigarh", type: "Unauthorized Entry", level: 48, time: "12m ago" },
    { id: 11, pos: [15.2993, 74.1240] as [number, number], name: "Goa", type: "Drone Detected", level: 46, time: "20m ago" },

    // MODERATE (yellow/amber)
    { id: 12, pos: [26.9124, 75.7873] as [number, number], name: "Jaipur", type: "VIP Zone Alert", level: 38, time: "25m ago" },
    { id: 13, pos: [12.9716, 77.5946] as [number, number], name: "Bangalore", type: "Network Anomaly", level: 32, time: "30m ago" },
    { id: 14, pos: [21.1702, 72.8311] as [number, number], name: "Surat", type: "Motion Anomaly", level: 28, time: "35m ago" },
    { id: 15, pos: [11.0168, 76.9558] as [number, number], name: "Coimbatore", type: "Sensor Spike", level: 25, time: "40m ago" },

    // LOW (green)
    { id: 16, pos: [22.7196, 75.8577] as [number, number], name: "Indore", type: "Routine Patrol", level: 12, time: "1h ago" },
    { id: 17, pos: [9.9312, 76.2673] as [number, number], name: "Kochi", type: "All Clear", level: 8, time: "2h ago" },
    { id: 18, pos: [31.1048, 77.1734] as [number, number], name: "Shimla", type: "Standby", level: 5, time: "3h ago" },
    { id: 19, pos: [27.1767, 78.0081] as [number, number], name: "Agra", type: "Patrol Active", level: 10, time: "1h ago" },

    // Scatter points for density (minor dots, like traffic)
    { id: 20, pos: [28.7, 77.1] as [number, number], name: "Delhi NCR - Gurgaon", type: "Motion Cluster", level: 85, time: "2m" },
    { id: 21, pos: [28.5, 77.35] as [number, number], name: "Noida", type: "Vehicle Alert", level: 78, time: "5m" },
    { id: 22, pos: [28.45, 77.0] as [number, number], name: "Faridabad", type: "Crowd", level: 62, time: "9m" },
    { id: 23, pos: [19.2, 72.95] as [number, number], name: "Thane", type: "Noise Spike", level: 45, time: "15m" },
    { id: 24, pos: [19.0, 72.85] as [number, number], name: "Navi Mumbai", type: "Minor Alert", level: 35, time: "22m" },
    { id: 25, pos: [22.65, 88.45] as [number, number], name: "Howrah", type: "Crowd Density", level: 75, time: "4m" },
    { id: 26, pos: [22.5, 88.3] as [number, number], name: "Salt Lake", type: "Movement", level: 58, time: "11m" },
    { id: 27, pos: [12.95, 77.65] as [number, number], name: "Whitefield", type: "All Clear", level: 15, time: "45m" },
    { id: 28, pos: [13.02, 77.5] as [number, number], name: "Yeshwanthpur", type: "Patrol", level: 10, time: "1h" },
    { id: 29, pos: [17.45, 78.55] as [number, number], name: "Secunderabad", type: "Monitor", level: 40, time: "18m" },
    { id: 30, pos: [26.85, 81.0] as [number, number], name: "Lucknow Sub", type: "Elevated", level: 70, time: "7m" },
    { id: 31, pos: [25.44, 81.85] as [number, number], name: "Allahabad", type: "Crowd", level: 52, time: "16m" },
    { id: 32, pos: [30.73, 76.78] as [number, number], name: "Mohali", type: "Check", level: 22, time: "30m" },
];

// Memoized threat markers
const ThreatMarkers = memo(() => (
    <>
        {THREAT_POINTS.map((point) => (
            <CircleMarker
                key={point.id}
                center={point.pos}
                radius={getThreatRadius(point.level)}
                pathOptions={{
                    color: getThreatColor(point.level),
                    fillColor: getThreatColor(point.level),
                    fillOpacity: getThreatOpacity(point.level),
                    weight: point.level >= 80 ? 3 : point.level >= 60 ? 2 : 1,
                    className: point.level >= 80 ? 'threat-marker-critical' : '',
                }}
            >
                <Popup>
                    <div className="p-3 bg-white rounded-lg shadow-lg text-slate-800 min-w-[220px] border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getThreatColor(point.level), boxShadow: `0 0 8px ${getThreatColor(point.level)}` }}></div>
                            <h4 className="font-bold text-sm text-slate-900">{point.name}</h4>
                            <span className="ml-auto text-[10px] text-slate-500">{point.time}</span>
                        </div>
                        <div className="text-xs text-slate-600 mb-2">{point.type}</div>
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                            <span className="text-[10px] text-slate-500 font-medium">Threat Level:</span>
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{ width: `${point.level}%`, backgroundColor: getThreatColor(point.level) }}></div>
                            </div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: getThreatColor(point.level) }}>{getThreatLabel(point.level)}</span>
                        </div>
                    </div>
                </Popup>
            </CircleMarker>
        ))}
    </>
));

// Memoized system health card
const SystemHealthCard = memo(() => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4 w-56 glass-panel bg-white/85 dark:bg-surface-container-high/85 p-4 rounded-xl border border-slate-200/50 dark:border-outline-variant/10 shadow-xl z-20 pointer-events-none"
    >
        <div className="flex justify-between items-start mb-3">
            <h3 className="font-headline font-bold text-xs tracking-tight text-slate-800 dark:text-on-surface uppercase">System Health</h3>
            <span className="text-[9px] bg-green-100 text-green-700 dark:bg-secondary/10 dark:text-secondary px-1.5 py-0.5 rounded font-bold">STABLE</span>
        </div>
        <div className="space-y-2.5">
            <div>
                <div className="flex justify-between text-[9px] text-slate-500 dark:text-on-surface-variant mb-1 font-medium">
                    <span>CPU LATENCY</span><span>12ms</span>
                </div>
                <div className="h-1 bg-slate-100 dark:bg-surface-container-lowest rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "35%" }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-blue-500 dark:bg-primary rounded-full" />
                </div>
            </div>
            <div>
                <div className="flex justify-between text-[9px] text-slate-500 dark:text-on-surface-variant mb-1 font-medium">
                    <span>NET LOAD</span><span>82%</span>
                </div>
                <div className="h-1 bg-slate-100 dark:bg-surface-container-lowest rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-blue-500 dark:bg-primary rounded-full" />
                </div>
            </div>
        </div>
    </motion.div>
));

const MapDashboard = () => {
    const [mapTheme, setMapTheme] = useState('light');
    const [showThemePanel, setShowThemePanel] = useState(false);
    const mapRef = useRef(null);

    const activeTheme = MAP_THEMES.find(t => t.id === mapTheme) || MAP_THEMES[0];

    return (
        <div className="flex-1 relative bg-slate-100 dark:bg-surface-container-lowest overflow-hidden z-0">
            {/* Map */}
            <div className="absolute inset-0 z-0">
                <MapContainer
                    ref={mapRef}
                    center={[22.5, 79.0]}
                    zoom={5}
                    style={{ height: '100%', width: '100%', background: '#f1f3f5' }}
                    zoomControl={false}
                    scrollWheelZoom={true}
                    preferCanvas={true}
                    zoomAnimation={true}
                    markerZoomAnimation={true}
                >
                    <MapResizer />
                    <DynamicTileLayer url={activeTheme.url} />
                    <ThreatMarkers />
                </MapContainer>
            </div>

            {/* Map Type Toggle (top right) */}
            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowThemePanel(!showThemePanel)}
                className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-surface-container-high/90 p-1.5 rounded-xl border border-slate-200/60 dark:border-outline-variant/15 shadow-lg hover:shadow-xl transition-all active:scale-95 group backdrop-blur-sm"
                title="Map type"
            >
                <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-blue-500/60 group-hover:border-blue-500 transition-colors">
                    <img src={activeTheme.thumb} alt={activeTheme.name} className="w-full h-full object-cover" />
                </div>
                <span className="block text-[7px] font-bold uppercase tracking-widest text-slate-500 dark:text-on-surface-variant text-center mt-1">Layers</span>
            </motion.button>

            {/* Map Type Panel */}
            {showThemePanel && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute top-4 right-4 z-30 bg-white/95 dark:bg-surface-container-high/95 rounded-2xl border border-slate-200/60 dark:border-outline-variant/15 shadow-2xl p-4 min-w-[250px] backdrop-blur-md"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-on-surface">Map type</h4>
                        <button onClick={() => setShowThemePanel(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-slate-400 dark:text-on-surface-variant text-sm">close</span>
                        </button>
                    </div>
                    <div className="flex gap-3 justify-center">
                        {MAP_THEMES.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => { setMapTheme(theme.id); setShowThemePanel(false); }}
                                className="flex flex-col items-center gap-1.5 group"
                            >
                                <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                                    mapTheme === theme.id
                                        ? 'border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)] scale-105'
                                        : 'border-slate-200 dark:border-outline-variant/30 hover:border-blue-300 hover:scale-105'
                                }`}>
                                    <img src={theme.thumb} alt={theme.name} className="w-full h-full object-cover" />
                                </div>
                                <span className={`text-[9px] font-bold transition-colors ${
                                    mapTheme === theme.id ? 'text-blue-500' : 'text-slate-500 dark:text-on-surface-variant group-hover:text-slate-700 dark:group-hover:text-on-surface'
                                }`}>{theme.name}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* System Health */}
            <SystemHealthCard />

            {/* Live Threat Legend Bar (bottom center, like Google traffic) */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-white/90 dark:bg-surface-container-high/90 px-4 py-2 rounded-full border border-slate-200/60 dark:border-outline-variant/15 shadow-lg backdrop-blur-sm"
            >
                <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-600 dark:text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-on-surface uppercase tracking-wider">Live threat</span>
                </div>
                <div className="flex items-center gap-0.5">
                    <span className="text-[9px] font-medium text-green-600">Low</span>
                    <div className="flex gap-[1px] mx-1">
                        <div className="w-5 h-2 rounded-sm bg-[#43a047]"></div>
                        <div className="w-5 h-2 rounded-sm bg-[#ffd600]"></div>
                        <div className="w-5 h-2 rounded-sm bg-[#ffab00]"></div>
                        <div className="w-5 h-2 rounded-sm bg-[#ff6d00]"></div>
                        <div className="w-5 h-2 rounded-sm bg-[#e53935]"></div>
                        <div className="w-5 h-2 rounded-sm bg-[#cc0000]"></div>
                    </div>
                    <span className="text-[9px] font-medium text-red-600">Critical</span>
                </div>
            </motion.div>

            {/* Terminal Overlay */}
            <div className="z-20 relative pointer-events-none w-full h-full">
                <LiveLogs />
            </div>
        </div>
    );
};

export default MapDashboard;
