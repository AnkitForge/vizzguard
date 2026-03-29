import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Detection {
    type: string;
    label: string;
    confidence: number;
    bbox?: number[]; // [xmin, ymin, xmax, ymax]
}

interface LiveAnalysis {
    threat_level: number;
    detections: Detection[];
    timestamp: string;
}

const CamerasPage = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLCanvasElement>(null);
    const [cameraActive, setCameraActive] = useState(false);
    
    // Live Detection States
    const [liveResult, setLiveResult] = useState<LiveAnalysis | null>(null);
    const [alertCount, setAlertCount] = useState(0);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { token } = useAuth();

    // Recording States
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720 },
                    audio: false
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setCameraActive(true);
                }
            } catch (err: any) {
                console.error(err.message || 'Camera access error');
            }
        };

        startCamera();
        return () => stream?.getTracks().forEach(t => t.stop());
    }, []);

    // Live Analysis Loop
    useEffect(() => {
        if (!cameraActive) return;

        const interval = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (!context) return;
            
            // Capture Frame
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frameBase64 = canvas.toDataURL('image/jpeg', 0.6);

            try {
                setIsAnalyzing(true);
                const response = await fetch('http://localhost:8000/api/v1/analyze/live', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ frame: frameBase64 })
                });

                const data = await response.json();
                if (!data.error) {
                    setLiveResult(data);
                    
                    // Trigger Alert Modal
                    if (data.threat_level > 0.7) {
                        setAlertCount(prev => prev + 1);
                        setShowAlertModal(true);
                    }
                }
            } catch (err) {
                console.error("Live Analysis Failed:", err);
            } finally {
                setIsAnalyzing(false);
            }
        }, 1200); 

        return () => clearInterval(interval);
    }, [cameraActive, isAnalyzing, token]);

    // Bounding Box Drawing Logic
    useEffect(() => {
        if (!overlayRef.current || !videoRef.current || !liveResult) return;

        const canvas = overlayRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear previous
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sync canvas size to video display size
        canvas.width = video.offsetWidth;
        canvas.height = video.offsetHeight;

        const scaleX = canvas.width / video.videoWidth;
        const scaleY = canvas.height / video.videoHeight;

        liveResult.detections.forEach(det => {
            if (det.bbox) {
                const [x1, y1, x2, y2] = det.bbox;
                const width = (x2 - x1) * scaleX;
                const height = (y2 - y1) * scaleY;
                const tx = x1 * scaleX;
                const ty = y1 * scaleY;

                // Style based on threat
                const isThreat = det.type === 'weapon' || det.type === 'violence';
                ctx.strokeStyle = isThreat ? '#f43f5e' : '#0ea5e9';
                ctx.lineWidth = 3;
                ctx.setLineDash(isThreat ? [] : [5, 5]);
                
                // Draw Square
                ctx.strokeRect(tx, ty, width, height);

                // Label Background
                ctx.fillStyle = isThreat ? '#f43f5e' : '#0ea5e9';
                ctx.fillRect(tx, ty - 25, ctx.measureText(det.label).width + 20, 25);

                // Label Text
                ctx.fillStyle = 'white';
                ctx.font = 'bold 12px Inter';
                ctx.fillText(`${det.label} ${(det.confidence * 100).toFixed(0)}%`, tx + 5, ty - 8);
            }
        });
    }, [liveResult]);

    // Recording Controls
    const startRecording = () => {
        if (!videoRef.current?.srcObject) return;
        
        const stream = videoRef.current.srcObject as MediaStream;
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        
        recordedChunksRef.current = [];
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };
        
        recorder.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sentinel-forensic-${new Date().getTime()}.webm`;
            a.click();
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    // Derived Metrics 
    const currentRisk = liveResult?.threat_level || 0;
    const aiStatus = liveResult?.detections?.[0]?.label || (cameraActive ? 'Scanning...' : 'Offline');
    const aiConfidence = liveResult?.detections?.length ? Math.max(...liveResult.detections.map(d => d.confidence)) : 0;

    return (
        <div className="p-8 max-w-[1700px] mx-auto space-y-8 flex-1 overflow-y-auto w-full relative">
            
            {/* Alert Modal Overlay */}
            <AnimatePresence>
                {showAlertModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-lg bg-rose-950/20 border-2 border-rose-500 rounded-sm p-10 text-center shadow-[0_0_100px_rgba(244,63,94,0.3)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 animate-pulse"></div>
                            <div className="w-24 h-24 bg-rose-500/20 rounded-sm flex items-center justify-center mx-auto mb-8 border border-rose-500/40">
                                <span className="material-symbols-outlined text-6xl text-rose-500 animate-pulse">warning</span>
                            </div>
                            <h2 className="text-4xl font-headline font-black text-white uppercase italic tracking-tight mb-4">CRITICAL THREAT ALERT</h2>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-10">Unusual Activity Detected in Primary Array Feed</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="p-4 bg-white/5 rounded-sm border border-white/10">
                                    <span className="text-[10px] font-black text-rose-500 uppercase block mb-1">DETECTION</span>
                                    <span className="text-lg font-black text-white uppercase">{liveResult?.detections?.[0]?.label || 'UNSPECIFIED'}</span>
                                </div>
                                <div className="p-4 bg-white/5 rounded-sm border border-white/10">
                                    <span className="text-[10px] font-black text-rose-500 uppercase block mb-1">RISK LEVEL</span>
                                    <span className="text-lg font-black text-white uppercase">{(currentRisk * 100).toFixed(0)}%</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowAlertModal(false)}
                                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-[0.2em] rounded-sm transition-all active:scale-95 shadow-lg shadow-rose-500/20"
                            >
                                Acknowledge & Respond
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight font-headline text-white uppercase italic leading-none">Live Neural Surveillance</h1>
                    <p className="text-slate-500 mt-2 font-black uppercase tracking-[0.3em] text-[10px]">Real-time Array Analysis · Threat Mitigation Unit</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2.5 bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-800 hover:bg-slate-800 transition-all flex items-center gap-2 rounded-sm">
                        <span className="material-symbols-outlined text-lg">settings</span> Node Config
                    </button>
                    <button className="px-8 py-2.5 bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 rounded-sm">
                        <span className="material-symbols-outlined text-lg">add_circle</span> Deploy Node
                    </button>
                </div>
            </header>

            <canvas ref={canvasRef} className="hidden" />

            {/* Main Control Grid */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* ── LIVE VIDEO FEED ── */}
                <div className="md:col-span-2 md:row-span-2 bg-black rounded-sm overflow-hidden border border-white/5 relative aspect-video shadow-2xl group cursor-crosshair">
                    <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transition-all duration-1000 ${currentRisk > 0.6 ? 'sepia-[0.3] saturate-150 contrast-125' : 'grayscale-[0.2]'}`} />
                    
                    {/* Bounding Box Overlay */}
                    <canvas ref={overlayRef} className="absolute inset-0 z-30 pointer-events-none" />
                    
                    {/* Viewport Overlay */}
                    <div className="absolute inset-0 pointer-events-none border-[20px] border-white/5 opacity-40"></div>
                    
                    {/* HUD - TOP */}
                    <div className="absolute top-6 left-6 flex gap-3 z-40">
                        <span className={`px-3 py-1.5 backdrop-blur-xl text-[9px] font-black text-white flex items-center gap-2 uppercase tracking-widest rounded-sm border ${currentRisk > 0.5 ? 'bg-rose-500/80 border-rose-500' : 'bg-emerald-500/80 border-emerald-500'}`}>
                            <span className={`w-2 h-2 rounded-sm bg-white ${cameraActive ? 'animate-pulse' : ''}`}></span>
                            {cameraActive ? (currentRisk > 0.5 ? 'CRITICAL FEED' : 'LIVE STREAM') : 'SIGNAL LOST'}
                        </span>
                        {isRecording && (
                            <motion.span 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="px-3 py-1.5 bg-rose-600/90 text-[9px] font-black text-white flex items-center gap-2 uppercase tracking-widest rounded-sm animate-pulse z-40"
                            >
                                <span className="w-2 h-2 rounded-sm bg-white"></span>
                                REC FORENSIC
                            </motion.span>
                        )}
                    </div>

                    {/* RECORD BUTTON */}
                    <div className="absolute top-6 right-6 z-40">
                        <button 
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`w-12 h-12 rounded-sm flex items-center justify-center transition-all ${isRecording ? 'bg-white text-rose-600' : 'bg-rose-600 text-white hover:scale-110 shadow-lg shadow-rose-600/40'}`}
                        >
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isRecording ? "'FILL' 1" : "'FILL' 0" }}>
                                {isRecording ? 'stop_circle' : 'fiber_manual_record'}
                            </span>
                        </button>
                    </div>

                    {/* HUD - RISK BAR BOTTOM */}
                    <div className="absolute bottom-6 left-6 right-6 z-40 space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-black font-headline text-white uppercase italic tracking-tight">Primary Perimeter Node</h3>
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${currentRisk > 0.5 ? 'text-rose-500' : 'text-sky-400'}`}>
                                    <span className="material-symbols-outlined text-xs">analytics</span>
                                    {isAnalyzing ? 'Processing Frame Signature...' : `Neural Confidence: ${(aiConfidence * 100).toFixed(0)}%`}
                                </p>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                animate={{ width: `${currentRisk * 100}%` }}
                                className={`h-full ${currentRisk > 0.5 ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-sky-400 shadow-[0_0_15px_#0ea5e9]'}`} 
                            />
                        </div>
                    </div>
                </div>

                {/* ── TELEMETRY CARDS ── */}
                
                {/* 1. REAL-TIME RISK LEVEL */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-sm flex flex-col justify-between group hover:border-rose-500/30 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Risk level</p>
                            <h4 className={`text-4xl font-black font-headline mt-2 uppercase italic ${currentRisk > 0.6 ? 'text-rose-500' : 'text-white'}`}>{(currentRisk * 100).toFixed(0)}%</h4>
                        </div>
                        <div className="p-3 bg-white/5 rounded-sm"><span className="material-symbols-outlined text-sky-400">monitoring</span></div>
                    </div>
                    <div className="mt-8 space-y-3">
                        <div className="h-1 bg-white/5 rounded-none overflow-hidden">
                            <motion.div animate={{ width: `${currentRisk * 100}%` }} className={`h-full ${currentRisk > 0.5 ? 'bg-rose-500' : 'bg-sky-400'}`} />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Topology: Real-time</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{currentRisk > 0.5 ? 'ELEVATED' : 'NOMINAL'}</span>
                        </div>
                    </div>
                </div>

                {/* 2. AI VERDICT SIGNATURE */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-sm flex flex-col justify-between group hover:border-sky-500/30 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Verdict Signature</p>
                            <h4 className="text-2xl font-black font-headline mt-3 text-white uppercase italic leading-tight">{aiStatus}</h4>
                        </div>
                        <div className="p-3 bg-white/5 rounded-sm"><span className="material-symbols-outlined text-emerald-400">psychology_alt</span></div>
                    </div>
                    <div className="mt-8">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Last Neural Check</p>
                        <p className="text-[10px] font-black text-white uppercase italic tracking-widest">{new Date().toLocaleTimeString()}</p>
                    </div>
                </div>

                {/* 3. SESSION ALERT COUNT */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-sm flex flex-col justify-between group hover:border-amber-500/30 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Session Alerts Logged</p>
                            <h4 className="text-4xl font-black font-headline mt-2 text-white uppercase italic">{alertCount.toString().padStart(2, '0')}</h4>
                        </div>
                        <div className="p-3 bg-white/5 rounded-sm"><span className="material-symbols-outlined text-rose-500">emergency_home</span></div>
                    </div>
                    <div className="mt-8">
                         <button className="text-[9px] font-black text-slate-400 border border-white/10 px-4 py-2 hover:bg-white/5 transition-all rounded-sm uppercase tracking-[0.2em] w-full">
                            Export Incident Log
                        </button>
                    </div>
                </div>

                {/* 4. NEURAL CONFIDENCE INDEX */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-sm flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Neural Confidence</p>
                            <h4 className="text-4xl font-black font-headline mt-2 text-white uppercase italic">{(aiConfidence * 100).toFixed(0)}%</h4>
                        </div>
                        <div className="p-3 bg-white/5 rounded-sm"><span className="material-symbols-outlined text-emerald-400">model_training</span></div>
                    </div>
                    <div className="mt-8 text-right">
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-2 py-1 rounded-sm">V_3.1 Optimized</span>
                    </div>
                </div>
            </section>

            {/* Telemetry Log Table */}
            <section className="space-y-6 pt-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black font-headline text-white uppercase italic leading-none">Node Telemetry Logs</h2>
                    <div className="flex gap-2">
                        <button className="px-5 py-2 bg-slate-900 text-slate-500 text-[9px] font-black border border-slate-800 rounded-sm uppercase tracking-widest hover:text-white transition-all">Filter</button>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Sensor ID</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Stream Status</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Neural Sync</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Bitrate</th>
                                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">Diagnostic</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="hover:bg-white/[0.01] transition-all">
                                <td className="px-6 py-6 font-black text-white text-sm">DEV-CAM-LOCAL</td>
                                <td className="px-6 py-6">
                                    <span className={`px-2 py-1 text-[8px] font-black uppercase rounded-sm border ${cameraActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                        {cameraActive ? 'Streaming' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="px-6 py-6 text-xs font-black text-slate-400 uppercase italic">{(aiConfidence * 100).toFixed(0)}% MATCH</td>
                                <td className="px-6 py-6 text-xs font-bold text-slate-300">8.4 MBPS</td>
                                <td className="px-6 py-6 text-right">
                                    <button className="text-slate-500 hover:text-sky-400 transition-all"><span className="material-symbols-outlined text-xl">dataset</span></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default CamerasPage;
