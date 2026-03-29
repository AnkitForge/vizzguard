import { useState } from 'react';
import { motion } from 'framer-motion';

const LiveFeedsPage = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'focus'>('grid');
    const [focusedFeed, setFocusedFeed] = useState<number | null>(null);

    const toggleFocus = (feedId: number) => {
        if (viewMode === 'focus' && focusedFeed === feedId) {
            setViewMode('grid');
            setFocusedFeed(null);
        } else {
            setViewMode('focus');
            setFocusedFeed(feedId);
        }
    };

    return (
        <>
            <section className="p-8 space-y-8 flex-1 overflow-y-auto relative">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-bold font-headline tracking-tight text-on-surface">Live Video Feeds</h2>
                        <p className="text-on-surface-variant mt-1 font-body text-sm tracking-wide">6 Active Streams • Neural Engine: Processing 4.2k objects/sec</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        {/* View Toggles */}
                        <div className="flex bg-surface-container-high rounded-md p-1 border border-outline-variant/10">
                            <button 
                                onClick={() => { setViewMode('grid'); setFocusedFeed(null); }}
                                className={`p-2 rounded-sm flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-primary text-on-primary' : 'text-slate-500 hover:bg-white/5'}`}
                            >
                                <span className="material-symbols-outlined text-sm">grid_view</span>
                            </button>
                            <button 
                                onClick={() => viewMode === 'grid' && toggleFocus(1)}
                                className={`p-2 rounded-sm flex items-center justify-center transition-colors ${viewMode === 'focus' ? 'bg-primary text-on-primary' : 'text-slate-500 hover:bg-white/5'}`}
                            >
                                <span className="material-symbols-outlined text-sm">fullscreen</span>
                            </button>
                        </div>

                        <div className="bg-surface-container-high p-4 rounded-md flex items-center gap-4 border border-outline-variant/5">
                            <div className="space-y-1">
                                <span className="block text-[10px] font-bold uppercase text-secondary tracking-widest">Active Nodes</span>
                                <span className="block text-xl font-headline font-bold text-on-surface">14/14</span>
                            </div>
                            <div className="w-px h-8 bg-outline-variant/20"></div>
                            <div className="space-y-1">
                                <span className="block text-[10px] font-bold uppercase text-tertiary tracking-widest">System Load</span>
                                <span className="block text-xl font-headline font-bold text-on-surface">32%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Feeds Area */}
                <div className={`grid gap-6 transition-all duration-500 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {/* Feed 1: Human Detected */}
                    <motion.div 
                        layout
                        className={`group relative bg-surface-container-lowest overflow-hidden rounded-sm border ${focusedFeed === 1 ? 'border-primary' : 'border-outline-variant/10'} ${viewMode === 'focus' && focusedFeed !== 1 ? 'hidden' : 'aspect-video'}`}
                    >
                        <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" alt="CCTV Perspective" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwk-j5nQlDM2VS9u0QnA7tRrP_JheMYnoaKfaE10xNdnOkSBGYs_zngisEmdS_akla-F47jTNUg_jK0nXMIbww4bYyVWedGYzD0-bAImj25PzxrycUPTLHeAq8Xf242c9lw8PZLugcldTkK_WaN4p2af6KF0zMm_ArcoeR9aKjASaTV1qBrK4yMctovUZTZCViiQoB8uWOsH91qfMLokwxKJ_AtJk4K3bfa7bJs7k6kT28vU2k2dURMPcoDOVEynQi0jENxrSdpzI" />
                        <div className="feed-overlay-gradient absolute inset-0"></div>
                        {/* AI Overlays */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-error animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-md">CAM-01 / Perimeter North</span>
                                </div>
                                <div className="px-2 py-0.5 bg-error/90 text-[9px] font-black uppercase text-white rounded-[2px]">Human Detected</div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-xl">person</span>
                                    <div className="bg-black/40 backdrop-blur-md px-3 py-1 border-l-2 border-primary">
                                        <span className="text-[10px] font-mono text-primary-fixed">ID: ENT-8821 | Confidence: 98.4%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="text-[10px] font-mono text-on-surface-variant bg-black/40 p-1">1080P | 60FPS | H.265</div>
                                <button onClick={() => toggleFocus(1)} className="hover:text-primary transition-colors bg-black/40 p-1 rounded backdrop-blur">
                                    <span className="material-symbols-outlined text-white/80 text-xl">{viewMode === 'focus' ? 'fullscreen_exit' : 'fullscreen'}</span>
                                </button>
                            </div>
                        </div>
                        {/* Detection Box */}
                        <motion.div 
                            animate={{ opacity: [0.5, 1, 0.5], borderColor: ['rgba(255,113,108,0.5)', 'rgba(255,113,108,1)', 'rgba(255,113,108,0.5)'] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute top-[20%] left-[30%] w-[40%] h-[60%] border-2 pointer-events-none"
                        >
                            <div className="absolute -top-5 left-0 bg-error text-[8px] px-1 font-bold text-white shadow-[0_0_10px_rgba(255,113,108,0.8)]">SUBJECT_DETECTED 98.4%</div>
                        </motion.div>
                    </motion.div>

                    {/* Feed 2: Vehicle */}
                    <motion.div layout className={`group relative bg-surface-container-lowest overflow-hidden rounded-sm border border-outline-variant/10 ${viewMode === 'focus' && focusedFeed !== 2 ? 'hidden' : 'aspect-video'}`}>
                        <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Empty parking garage" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1g0HodvsChGxNqKaPystxlYo1nZKBHEAoE4vTz0wpwya2KwhbPdwCGjnVO1SHBN3tG0q5TmwXuhtlO54teuDB3h_OFN5Vbhem_Gb2F0lWCeUn9Nd7XsJBHJv__XRlmVMETdA2K_vVOeK-brYMrZn8Did4H3vWQLI4LJJW52nqjcEd_VdbgVvZqaHRbhd6zzpr43_izEMssIfi9NC3nBKZBEfX-j5o83VlcURO0J81zkVIS7-edEwdqP-pR_OOocZhjCQ3W-HqBsI" />
                        <div className="feed-overlay-gradient absolute inset-0"></div>
                        <div className="absolute inset-0 p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-secondary"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-md">CAM-02 / Level B2</span>
                                </div>
                                <div className="px-2 py-0.5 bg-secondary/80 text-[9px] font-black uppercase text-on-secondary rounded-[2px]">Clear</div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="text-[10px] font-mono text-on-surface-variant bg-black/40 p-1">1080P | 60FPS | H.265</div>
                                <button onClick={() => toggleFocus(2)} className="hover:text-primary transition-colors bg-black/40 p-1 rounded backdrop-blur">
                                    <span className="material-symbols-outlined text-white/50 text-xl">{viewMode === 'focus' ? 'fullscreen_exit' : 'fullscreen'}</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feed 3: Motion */}
                    <motion.div layout className={`group relative bg-surface-container-lowest overflow-hidden rounded-sm border border-outline-variant/10 ${viewMode === 'focus' && focusedFeed !== 3 ? 'hidden' : 'aspect-video'}`}>
                        <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Overhead wide angle" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM1Shqqwcg0RwU5HLrjXK1qpkhLdygwF80gBnv5jhHnA4ok4yGuO-GpdLSfa2lsiQoNrYZNYq_AThahDFkn3a5EP0Vfe8AUCMbQNFrgZ-0GKDfpQ7GwyxAhvU41qiFVFSJTot4Oraul2rRaG-3M7_kP9_ZwXdg7_MlLNUtKNteFa_qeu6aJQcuuDcslNdvoYRib-paKb7DJImhYz6TyrpHzv0JIyHjDY965g6wMb4yj-y-Oq6JpPrUxv44X7zm2__3R5DWc83ZuGg" />
                        <div className="feed-overlay-gradient absolute inset-0"></div>
                        <div className="absolute inset-0 p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-md">CAM-03 / Lobby West</span>
                                </div>
                                <div className="px-2 py-0.5 bg-primary/90 text-[9px] font-black uppercase text-on-primary-container rounded-[2px]">Motion Detected</div>
                            </div>
                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-2 border-l-2 border-primary w-fit">
                                <span className="material-symbols-outlined text-primary text-sm">history</span>
                                <span className="text-[9px] font-mono text-primary-fixed">Last event: 1.2s ago</span>
                            </div>
                        </div>
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute top-1/2 left-1/3 w-16 h-16 border border-primary/40 rounded-full"
                        ></motion.div>
                    </motion.div>

                    {/* Feed 4: Restricted Area */}
                    <motion.div layout className={`group relative bg-surface-container-lowest overflow-hidden rounded-sm border border-outline-variant/10 ${viewMode === 'focus' && focusedFeed !== 4 ? 'hidden' : 'aspect-video'}`}>
                        <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="High-tech data center server rack" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsq3KEv-fU57QpVbdYhnzgfaE-hHQl9dDhsOuzz9wrUetvQ6yEldMK1-UCBr9kwu1p-C8IWogp-Q8NbCQG-vmucn29o03ox6OglVIbd8CJKv07BkTMQAx2G8c5p7VPVv5CGEcYSYrgjfFc1V6CnhuK8kZ6vhlxzUsBA5LbHvE90IFsYjP5CUo7FIFnVNgIZY5orqfRCz9zTuIQg5URYlfJphOWS7vOvhq5WehCpZvz4WhFy1je278vU7OWpxq0Exv-q3tXR1zWntI" />
                        <div className="feed-overlay-gradient absolute inset-0"></div>
                        <div className="absolute inset-0 p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-secondary"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-md">CAM-04 / Server Vault</span>
                                </div>
                                <div className="px-2 py-0.5 bg-surface-container-highest/80 text-[9px] font-black uppercase text-on-surface rounded-[2px]">Encrypted</div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="bg-black/60 px-2 py-1 rounded text-[10px] text-error font-bold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">lock</span> SECURE
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feed 5: Vehicle Tracking */}
                    <motion.div layout className={`group relative bg-surface-container-lowest overflow-hidden rounded-sm border border-outline-variant/10 ${viewMode === 'focus' && focusedFeed !== 5 ? 'hidden' : 'aspect-video'}`}>
                        <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Thermal vision" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd90t3PmIyiU7nmlsXwU4V4XAnQ386ey5-2Jydo2qKHHf92Wk8dg6Wca4FrnX4Y_r5o8PLDgsm8ULmmhsTEAgR9crnEMPGFbglYpRQhoZbEisCbyDwsfcFcIJenB1zm0gCbYCUT03cw16NZkalrURDiHQBtRWGSnFvjHInaRVKJIdasJ2Th8CFFnICGnGMt-uHaFP2AgyFOvcr3MQg-dLjbxEfavXO-8y_KRc8QDHP1iJGnORkT9Fc-_fo0OqHdWfRFSZLuBU6rvc" />
                        <div className="absolute inset-0 bg-primary/5"></div>
                        <div className="feed-overlay-gradient absolute inset-0"></div>
                        <div className="absolute inset-0 p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-md">CAM-05 / Entrance A</span>
                                </div>
                                <div className="px-2 py-0.5 bg-tertiary/90 text-[9px] font-black uppercase text-on-tertiary-container rounded-[2px]">Vehicle: SUV</div>
                            </div>
                            <div className="ai-scanner-line opacity-50"></div>
                            <div className="bg-black/40 backdrop-blur-md p-2 border-l-2 border-tertiary w-fit">
                                <span className="text-[10px] font-mono text-tertiary tracking-tighter">PLATE: TX-992K-09 | AUTH: VERIFIED</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feed 6: Static / Standby */}
                    <motion.div layout className={`group relative bg-surface-container-high overflow-hidden rounded-sm border border-outline-variant/10 flex items-center justify-center ${viewMode === 'focus' && focusedFeed !== 6 ? 'hidden' : 'aspect-video'}`}>
                        <div className="text-center space-y-3">
                            <span className="material-symbols-outlined text-4xl text-outline/30">videocam_off</span>
                            <div>
                                <span className="block text-[10px] font-bold uppercase tracking-widest text-outline">CAM-06 / Loading Dock</span>
                                <span className="block text-[9px] text-outline-variant font-mono">Status: Standby / Power Save</span>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <button className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold uppercase tracking-widest text-on-surface hover:bg-primary hover:text-on-primary transition-all rounded-sm">Wake Node</button>
                        </div>
                    </motion.div>
                </div>

                {/* Lower Analytics & Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                    {/* Recent AI Detections */}
                    <div className="lg:col-span-2 bg-surface-container p-6 rounded-md border border-outline-variant/5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-headline font-bold text-lg text-on-surface">Neural Intelligence Log</h3>
                            <span className="text-[10px] font-bold uppercase text-primary tracking-widest">Real-time Stream</span>
                        </div>
                        <div className="space-y-1">
                            {/* Log Item */}
                            <div className="flex items-center justify-between p-3 hover:bg-surface-container-high transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded bg-error/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-error text-lg">person</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-on-surface">Unauthorized Entry - Perimeter North</span>
                                        <span className="block text-[10px] text-on-surface-variant">Class: Human | Zone 4 | Vector: Inward</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] font-mono text-on-surface-variant">14:02:44</span>
                                    <span className="text-[9px] font-bold text-error uppercase">Action Required</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-surface-container-low">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded bg-tertiary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-tertiary text-lg">local_shipping</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-on-surface">Authorized Vehicle - Main Gate</span>
                                        <span className="block text-[10px] text-on-surface-variant">Class: Commercial | Plate ID: 44-X-99</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] font-mono text-on-surface-variant">14:01:12</span>
                                    <span className="text-[9px] font-bold text-secondary uppercase">Verified</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 hover:bg-surface-container-high transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-lg">motion_sensor_active</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-on-surface">General Motion - Lobby West</span>
                                        <span className="block text-[10px] text-on-surface-variant">Environmental Trigger | Filtered</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] font-mono text-on-surface-variant">13:58:21</span>
                                    <span className="text-[9px] font-bold text-on-surface-variant uppercase">Logged</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Health Monitor */}
                    <div className="bg-surface-container-high p-6 rounded-md border border-outline-variant/10 flex flex-col">
                        <h3 className="font-headline font-bold text-lg text-on-surface mb-6">Hardware Status</h3>
                        <div className="space-y-6 flex-1">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-on-surface-variant">GPU Compute Cluster</span>
                                    <span className="text-on-surface">78%</span>
                                </div>
                                <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '78%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-on-surface-variant">Storage Array (VOD)</span>
                                    <span className="text-on-surface">42%</span>
                                </div>
                                <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary" style={{ width: '42%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-on-surface-variant">Network Uplink</span>
                                    <span className="text-on-surface">1.2 Gbps</span>
                                </div>
                                <div className="flex gap-1 h-1">
                                    <div className="flex-1 bg-primary"></div>
                                    <div className="flex-1 bg-primary"></div>
                                    <div className="flex-1 bg-primary"></div>
                                    <div className="flex-1 bg-primary"></div>
                                    <div className="flex-1 bg-surface-container-lowest"></div>
                                    <div className="flex-1 bg-surface-container-lowest"></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-outline-variant/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-surface-container-lowest flex items-center justify-center rounded">
                                    <span className="material-symbols-outlined text-secondary">hub</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-on-surface uppercase">Encryption Core</span>
                                    <span className="block text-[9px] text-secondary font-mono">Quantum-Resistant: Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* FAB for quick action */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>add_alert</span>
            </button>
        </>
    );
};

export default LiveFeedsPage;
