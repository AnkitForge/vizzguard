import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import type { Threat } from '../hooks/useRealTimeAlerts';

const threatTrendData = [
    { time: '00:00', violence: 2, weapons: 0, suspicious: 5 },
    { time: '03:00', violence: 1, weapons: 1, suspicious: 3 },
    { time: '06:00', violence: 3, weapons: 0, suspicious: 8 },
    { time: '09:00', violence: 7, weapons: 2, suspicious: 12 },
    { time: '12:00', violence: 12, weapons: 3, suspicious: 18 },
    { time: '15:00', violence: 9, weapons: 1, suspicious: 14 },
    { time: '18:00', violence: 15, weapons: 4, suspicious: 22 },
    { time: '21:00', violence: 8, weapons: 2, suspicious: 11 },
    { time: 'Now', violence: 6, weapons: 1, suspicious: 9 },
];

const regionData = [
    { name: 'Delhi', threats: 38, color: '#ff716c' },
    { name: 'Mumbai', threats: 24, color: '#69f6b8' },
    { name: 'Kolkata', threats: 31, color: '#ff716c' },
    { name: 'Bangalore', threats: 12, color: '#3bbffa' },
    { name: 'Hyderabad', threats: 19, color: '#69f6b8' },
    { name: 'Jaipur', threats: 8, color: '#3bbffa' },
];

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 1500) => {
    const [count, setCount] = useState(0);
    useState(() => {
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    });
    return count;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-container-high/95 backdrop-blur-md border border-outline-variant/20 rounded-md p-3 shadow-2xl">
                <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-[11px]">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-on-surface-variant capitalize">{entry.dataKey}:</span>
                        <span className="font-bold text-on-surface">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

interface AnalyticsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    alerts?: Threat[];
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ isOpen, onClose, alerts = [] }) => {
    const weaponCount = useMemo(() => alerts.filter(a => a.type === 'weapon').length, [alerts]);
    const violenceCount = useMemo(() => alerts.filter(a => a.type === 'violence').length, [alerts]);
    
    const totalThreats = useAnimatedCounter(alerts.length);
    const weaponAlerts = useAnimatedCounter(weaponCount);
    const violenceAlerts = useAnimatedCounter(violenceCount);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-6 right-6 z-30 glass-panel bg-surface-container-high/90 border border-outline-variant/20 rounded-lg shadow-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                    <h3 className="font-headline font-bold text-on-surface tracking-tight">THREAT ANALYTICS</h3>
                    <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-sm font-bold uppercase tracking-widest">Live Stream</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-white/10 rounded-sm transition-colors text-on-surface-variant"
                >
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            </div>

            <div className="p-6 space-y-6">
                {/* Stat Counters */}
                <div className="grid grid-cols-3 gap-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface-container p-4 rounded-md border border-outline-variant/10 text-center"
                    >
                        <span className="block text-3xl font-headline font-black text-error">{totalThreats}</span>
                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Total Threats</span>
                    </motion.div>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-surface-container p-4 rounded-md border border-outline-variant/10 text-center"
                    >
                        <span className="block text-3xl font-headline font-black text-primary">{weaponAlerts}</span>
                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Weapon Detections</span>
                    </motion.div>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-surface-container p-4 rounded-md border border-outline-variant/10 text-center"
                    >
                        <span className="block text-3xl font-headline font-black text-tertiary">{violenceAlerts}</span>
                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Violence Events</span>
                    </motion.div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Area Chart - Threat Trends */}
                    <div className="lg:col-span-3 bg-surface-container p-4 rounded-md border border-outline-variant/10">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Threat Trends (24h)</h4>
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={threatTrendData}>
                                <defs>
                                    <linearGradient id="colorViolence" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff716c" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ff716c" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorWeapons" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3bbffa" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3bbffa" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#69f6b8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#69f6b8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#8a90a5' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 9, fill: '#8a90a5' }} axisLine={false} tickLine={false} width={25} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="violence" stroke="#ff716c" fill="url(#colorViolence)" strokeWidth={2} />
                                <Area type="monotone" dataKey="weapons" stroke="#3bbffa" fill="url(#colorWeapons)" strokeWidth={2} />
                                <Area type="monotone" dataKey="suspicious" stroke="#69f6b8" fill="url(#colorSuspicious)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-[9px] text-on-surface-variant">
                                <div className="w-2 h-2 rounded-full bg-[#ff716c]"></div> Violence
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] text-on-surface-variant">
                                <div className="w-2 h-2 rounded-full bg-[#3bbffa]"></div> Weapons
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] text-on-surface-variant">
                                <div className="w-2 h-2 rounded-full bg-[#69f6b8]"></div> Suspicious
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart - Threats by Region */}
                    <div className="lg:col-span-2 bg-surface-container p-4 rounded-md border border-outline-variant/10">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Threats by Region</h4>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={regionData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 9, fill: '#8a90a5' }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#8a90a5' }} axisLine={false} tickLine={false} width={60} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="threats" radius={[0, 4, 4, 0]} barSize={14}>
                                    {regionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.7} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyticsPanel;
