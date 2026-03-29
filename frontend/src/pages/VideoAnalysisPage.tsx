import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine
} from 'recharts';

interface Detection {
    type: string;
    label: string;
    confidence: number;
}

interface SignificantFrame {
    time: number;
    image: string;
    detections: string[];
}

interface AnalysisTimeline {
    time: number;
    threat_level: number;
    detections: string[];
}

interface AnalysisReport {
    summary: string;
    duration: number;
    weapon_count: number;
    violence_count: number;
    timeline: AnalysisTimeline[];
    significant_frames: SignificantFrame[];
}

const VideoAnalysisPage = () => {
    const [mode, setMode] = useState<'idle' | 'streaming' | 'complete'>('idle');
    const [report, setReport] = useState<AnalysisReport | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activePoint, setActivePoint] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { token } = useAuth();

    // Local video playback URL
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    // Live streaming state (from SSE)
    const [latestFrame, setLatestFrame] = useState<string | null>(null);
    const [liveThreat, setLiveThreat] = useState(0);
    const [liveDetections, setLiveDetections] = useState<Detection[]>([]);
    const [liveProgress, setLiveProgress] = useState(0);
    const [liveWeapons, setLiveWeapons] = useState(0);
    const [liveViolence, setLiveViolence] = useState(0);
    const [liveTimeline, setLiveTimeline] = useState<AnalysisTimeline[]>([]);
    const [videoDuration, setVideoDuration] = useState(0);
    const [alertFlash, setAlertFlash] = useState(false);
    const [analysisTime, setAnalysisTime] = useState(0);

    const metrics = useMemo(() => {
        if (!report) return null;
        const threatLevels = report.timeline.map(t => t.threat_level);
        return {
            peakLevel: Math.max(...threatLevels, 0),
            avgRisk: (threatLevels.length > 0 ? threatLevels.reduce((a, b) => a + b, 0) / threatLevels.length : 0),
            confidence: 0.94,
            durationText: `${Math.floor(report.duration / 60)}m ${Math.floor(report.duration % 60)}s`
        };
    }, [report]);

    // Cleanup video URL on unmount
    useEffect(() => {
        return () => {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
        };
    }, [videoUrl]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        startLiveAnalysis(file);
    };

    const startLiveAnalysis = useCallback(async (file: File) => {
        // Create a local URL for the video so it plays at real speed in the browser
        if (videoUrl) URL.revokeObjectURL(videoUrl);
        const localUrl = URL.createObjectURL(file);
        setVideoUrl(localUrl);

        // Reset state
        setMode('streaming');
        setError(null);
        setReport(null);
        setLatestFrame(null);
        setLiveThreat(0);
        setLiveDetections([]);
        setLiveProgress(0);
        setLiveWeapons(0);
        setLiveViolence(0);
        setLiveTimeline([]);
        setVideoDuration(0);
        setAnalysisTime(0);

        // Start video playback
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.src = localUrl;
                videoRef.current.play();
            }
        }, 300);

        // Start SSE stream (processes as fast as possible)
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/api/v1/analyze/video/stream', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to start stream');
            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.event === 'meta') {
                                setVideoDuration(data.duration);
                            } else if (data.event === 'frame') {
                                setLatestFrame(data.frame);
                                setAnalysisTime(data.time);
                                setLiveThreat(data.threat_level);
                                setLiveDetections(data.detections);
                                setLiveProgress(data.progress);
                                setLiveWeapons(data.weapon_count);
                                setLiveViolence(data.violence_count);
                                setLiveTimeline(prev => [...prev, {
                                    time: data.time,
                                    threat_level: data.threat_level,
                                    detections: data.detections.map((d: Detection) => d.type),
                                }]);

                                if (data.threat_level > 0.4) {
                                    setAlertFlash(true);
                                    setTimeout(() => setAlertFlash(false), 1500);
                                }
                            } else if (data.event === 'complete') {
                                setReport(data as AnalysisReport);
                                setMode('complete');
                            }
                        } catch { /* skip malformed JSON */ }
                    }
                }
            }
        } catch (err: any) {
            setError(err.message || 'Stream failed');
            setMode('idle');
        }
    }, [token, videoUrl]);

    const resetAll = () => {
        setMode('idle');
        setReport(null);
        setLatestFrame(null);
        setLiveTimeline([]);
        setLiveProgress(0);
        setError(null);
        if (videoRef.current) videoRef.current.pause();
        if (videoUrl) URL.revokeObjectURL(videoUrl);
        setVideoUrl(null);
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload as AnalysisTimeline;
            return (
                <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 shadow-2xl ring-1 ring-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">T+{data.time}s</p>
                    <div className="flex items-center gap-2 justify-center">
                        <div className={`w-2 h-2 rounded-full ${data.threat_level > 0.5 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-emerald-500'}`}></div>
                        <span className="text-xs font-black text-white italic tracking-tighter uppercase leading-none">THREAT: {(data.threat_level * 100).toFixed(0)}%</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1700px] mx-auto space-y-4 select-none h-full flex flex-col overflow-y-auto scrollbar-hide">
            {/* Header */}
            <header className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
                        <span className="material-symbols-outlined text-sky-400 text-2xl">biotech</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-headline font-black text-white uppercase tracking-tight leading-none">Forensic Intelligence Console</h1>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 opacity-70">
                            {mode === 'streaming' ? 'LIVE NEURAL PROCESSING ACTIVE' : 'Unified Multi-Model Threat Verification'}
                        </p>
                    </div>
                </div>
                {mode !== 'idle' && (
                    <button
                        onClick={resetAll}
                        className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg font-black uppercase tracking-widest text-[9px] border border-white/10 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xs">refresh</span> Reset Loop
                    </button>
                )}
            </header>

            {/* ═══════ IDLE: Upload Zone ═══════ */}
            {mode === 'idle' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file?.type.startsWith('video/')) startLiveAnalysis(file);
                        else setError('Unsupported format');
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 w-full bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-10 cursor-pointer hover:border-sky-500/20 transition-all group relative min-h-[500px]"
                >
                    <input type="file" className="hidden" ref={fileInputRef} accept="video/*" onChange={handleFileSelect} />
                    <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700 group-hover:bg-sky-500/10 group-hover:border-sky-500/30 transition-all">
                        <span className="material-symbols-outlined text-5xl text-slate-500 group-hover:text-sky-400">upload_file</span>
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tight italic">Initialize Forensic Feed</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Drop footage here // MP4 / MKV / AVI</p>
                    </div>
                    {error && <div className="text-rose-500 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20">{error}</div>}
                </motion.div>
            )}

            {/* ═══════ STREAMING: Video + Live AI ═══════ */}
            {mode === 'streaming' && (
                <div className="flex-1 flex flex-col gap-4">
                    {/* Alert Flash */}
                    <AnimatePresence>
                        {alertFlash && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 pointer-events-none border-4 border-rose-500 rounded-2xl"
                                style={{ boxShadow: 'inset 0 0 80px rgba(244,63,94,0.15)' }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Main Grid: Video + AI Frame + Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* LEFT: Real-time video playing at native speed */}
                        <div className="lg:col-span-2 space-y-3">
                            {/* Actual Video Player */}
                            <div className="relative bg-black rounded-xl overflow-hidden border border-white/5 aspect-video shadow-2xl">
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-contain"
                                    muted
                                    playsInline
                                />

                                {/* HUD */}
                                <div className="absolute top-4 left-4 flex gap-2 z-10">
                                    <span className="px-3 py-1.5 bg-emerald-500/80 backdrop-blur-xl text-[9px] font-black text-white flex items-center gap-2 uppercase tracking-widest rounded-sm border border-emerald-500">
                                        <span className="w-2 h-2 rounded-sm bg-white animate-pulse"></span>
                                        VIDEO PLAYBACK — REAL TIME
                                    </span>
                                </div>

                                {/* Live detection overlay on video */}
                                {liveDetections.length > 0 && (
                                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
                                        {liveDetections.map((d, i) => (
                                            <motion.span
                                                key={`${d.label}-${i}`}
                                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/20 backdrop-blur-xl px-3 py-1.5 rounded border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                                            >
                                                ⚠ {d.label} — {(d.confidence * 100).toFixed(0)}%
                                            </motion.span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* AI Processed Frame (latest annotated frame from backend) */}
                            {latestFrame && (
                                <div className="relative bg-black rounded-xl overflow-hidden border border-sky-500/20 aspect-video shadow-2xl">
                                    <img
                                        src={`data:image/jpeg;base64,${latestFrame}`}
                                        className="w-full h-full object-contain"
                                        alt="AI Annotated Frame"
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                                        <span className={`px-3 py-1.5 backdrop-blur-xl text-[9px] font-black text-white flex items-center gap-2 uppercase tracking-widest rounded-sm border ${liveThreat > 0.4 ? 'bg-rose-500/80 border-rose-500 animate-pulse' : 'bg-sky-500/80 border-sky-500'}`}>
                                            <span className="w-2 h-2 rounded-sm bg-white animate-pulse"></span>
                                            AI VISION — T+{analysisTime.toFixed(1)}s
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
                                        <motion.div
                                            animate={{ width: `${liveProgress}%` }}
                                            className={`h-full transition-all duration-300 ${liveThreat > 0.4 ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-sky-400 shadow-[0_0_10px_#0ea5e9]'}`}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Stats Panel */}
                        <div className="flex flex-col gap-3">
                            {/* Progress Circle */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center">
                                <div className="relative w-28 h-28">
                                    <div className="w-full h-full rounded-full border border-white/5 flex items-center justify-center">
                                        <span className="text-2xl font-headline font-black text-sky-400">{Math.round(liveProgress)}%</span>
                                    </div>
                                    <svg className="absolute top-0 left-0 w-28 h-28 -rotate-90">
                                        <circle cx="56" cy="56" r="54" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={Math.PI * 108} strokeDashoffset={Math.PI * 108 * (1 - liveProgress / 100)} className="text-sky-400 transition-all" />
                                    </svg>
                                </div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3">
                                    AI Processing {videoDuration > 0 ? `${videoDuration.toFixed(0)}s footage` : '...'}
                                </p>
                            </div>

                            {/* Threat Level */}
                            <div className={`bg-slate-900 border p-4 rounded-xl transition-all ${liveThreat > 0.4 ? 'border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 'border-slate-800'}`}>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Current Risk</p>
                                <h4 className={`text-3xl font-black font-headline uppercase italic ${liveThreat > 0.4 ? 'text-rose-500' : 'text-white'}`}>{(liveThreat * 100).toFixed(0)}%</h4>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-3">
                                    <motion.div animate={{ width: `${liveThreat * 100}%` }} className={`h-full ${liveThreat > 0.4 ? 'bg-rose-500' : 'bg-sky-400'}`} />
                                </div>
                            </div>

                            {/* Counts */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Weapons</p>
                                    <span className="text-2xl font-black font-headline text-rose-500">{liveWeapons}</span>
                                </div>
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Violence</p>
                                    <span className="text-2xl font-black font-headline text-amber-500">{liveViolence}</span>
                                </div>
                            </div>

                            {/* Analysis Time */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">AI Analyzed Up To</p>
                                <span className="text-xl font-black font-headline text-sky-400">T+{analysisTime.toFixed(1)}s</span>
                                <span className="text-[8px] font-black text-slate-600 ml-2">/ {videoDuration.toFixed(0)}s</span>
                            </div>
                        </div>
                    </div>

                    {/* Live Threat Timeline */}
                    {liveTimeline.length > 1 && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="h-[140px] bg-slate-900/60 backdrop-blur-3xl p-4 rounded-2xl border border-slate-800 relative"
                        >
                            <div className="absolute top-2 left-4 z-10">
                                <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Live Threat Topology // Building...</h3>
                            </div>
                            <div className="w-full h-full pt-3">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={liveTimeline}>
                                        <defs>
                                            <linearGradient id="liveGlow" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                                        <YAxis hide domain={[0, 1]} />
                                        <Area type="monotone" dataKey="threat_level" stroke="#f43f5e" strokeWidth={2} fill="url(#liveGlow)" animationDuration={300} dot={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}

            {/* ═══════ COMPLETE: Final Report ═══════ */}
            {mode === 'complete' && report && metrics && (
                <div className="flex-1 flex flex-col gap-4 overflow-visible">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 shrink-0">
                        <div className={`col-span-1 lg:col-span-2 p-4 rounded-xl border flex items-center justify-between gap-4 relative overflow-hidden ${report.summary !== 'Safe' ? 'bg-rose-500/[0.04] border-rose-500/20' : 'bg-emerald-500/[0.04] border-emerald-500/20'}`}>
                            <div className="space-y-0.5 z-10">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Analysis Consensus</span>
                                <h2 className={`text-3xl font-headline font-black uppercase italic leading-none ${report.summary !== 'Safe' ? 'text-rose-500' : 'text-emerald-500'}`}>{report.summary}</h2>
                            </div>
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border ${report.summary !== 'Safe' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                                <span className={`material-symbols-outlined text-2xl ${report.summary !== 'Safe' ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>{report.summary !== 'Safe' ? 'warning' : 'verified_user'}</span>
                            </div>
                        </div>
                        {[
                            { label: 'Max Risk', value: `${(metrics.peakLevel * 100).toFixed(0)}%`, icon: 'trending_up', color: 'text-white' },
                            { label: 'Duration', value: metrics.durationText, icon: 'timer', color: 'text-sky-400' },
                            { label: 'Incidents', value: report.weapon_count + report.violence_count, icon: 'emergency', color: 'text-rose-500' }
                        ].map((m, i) => (
                            <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
                                <div className="p-1.5 bg-white/5 rounded-md"><span className={`material-symbols-outlined text-lg ${m.color}`}>{m.icon}</span></div>
                                <div>
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">{m.label}</span>
                                    <span className={`block text-lg font-black font-headline ${m.color} uppercase italic leading-tight`}>{m.value}</span>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="h-[220px] bg-slate-900/60 backdrop-blur-3xl p-4 rounded-2xl border border-slate-800 relative shadow-2xl shrink-0">
                        <div className="absolute top-2 left-4 z-10">
                            <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Threat Topology // Temporal Stream</h3>
                        </div>
                        <div className="w-full h-full pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={report.timeline} onMouseMove={(v: any) => v?.activePayload && setActivePoint(v.activePayload[0].payload)} onMouseLeave={() => setActivePoint(null)}>
                                    <defs>
                                        <linearGradient id="glowArea" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide domain={[0, 1]} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(14,165,233, 0.4)', strokeWidth: 1 }} />
                                    {activePoint && <ReferenceLine x={activePoint.time} stroke="rgba(14,165,233, 0.5)" strokeDasharray="3 3" />}
                                    <Area type="monotone" dataKey="threat_level" stroke="#f43f5e" strokeWidth={2.5} fill="url(#glowArea)" animationDuration={1500} dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Evidence Collage // Automated Extraction</h3>
                            <span className="text-[9px] font-bold text-slate-600 uppercase italic">Master Index: {report.significant_frames.length} Detections</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 pb-8">
                            {report.significant_frames.map((frame, i) => (
                                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4, scale: 1.02 }}
                                    className="relative aspect-video bg-slate-800 rounded-lg border border-slate-700 overflow-hidden group cursor-pointer shadow-lg hover:shadow-sky-500/10 hover:border-sky-500/30 transition-all">
                                    <img src={`data:image/jpeg;base64,${frame.image}`} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" alt="Evidence" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-slate-950/80 backdrop-blur-md text-white text-[7px] font-black rounded italic border border-white/5 uppercase tracking-tighter">T+{frame.time}S</div>
                                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                                        {frame.detections.map(d => (
                                            <span key={d} className="text-[7px] font-black text-rose-500 uppercase tracking-tighter bg-rose-500/20 backdrop-blur-md px-1.5 py-0.5 rounded border border-rose-500/30">{d}</span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                            {report.significant_frames.length === 0 && (
                                <div className="col-span-full h-32 border border-dashed border-slate-800 rounded-xl flex items-center justify-center bg-slate-900/40">
                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">Zero Significant Signatures Identified</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default VideoAnalysisPage;
