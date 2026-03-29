const EmergencyOperationsPage = () => {
    return (
        <div className="flex-1 flex flex-col p-6 gap-6 bg-surface overflow-y-auto relative">
            <style>
                {`
                    .scanline {
                        background: linear-gradient(to bottom, rgba(59, 191, 250, 0) 0%, rgba(59, 191, 250, 0.05) 50%, rgba(59, 191, 250, 0) 100%);
                        background-size: 100% 4px;
                    }
                `}
            </style>

            {/* Level 1 Emergency Banner */}
            <section className="w-full bg-error-container/20 border-l-4 border-error p-5 flex items-center justify-between relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-error/10 to-transparent pointer-events-none"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="bg-error p-3 rounded-sm">
                        <span className="material-symbols-outlined text-on-error text-3xl font-bold">warning</span>
                    </div>
                    <div>
                        <h1 className="font-headline text-3xl font-black tracking-tighter text-error uppercase">LEVEL 1 EMERGENCY: SECTOR_07 BREACH</h1>
                        <p className="font-label text-sm text-on-error-container opacity-80 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                            MULTIPLE UNAUTHORIZED ENTRIES DETECTED | THERMAL ANOMALIES CONFIRMED
                        </p>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-4 relative z-10">
                    <div className="text-right">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-error">Elapsed Time</div>
                        <div className="font-headline text-2xl font-light text-on-surface">00:04:22:81</div>
                    </div>
                    <button className="bg-error px-6 py-3 font-headline text-sm font-bold text-on-error rounded-sm hover:scale-[0.98] transition-transform">
                        EVACUATE NON-COMBATANTS
                    </button>
                </div>
            </section>

            <div className="grid grid-cols-12 gap-6 flex-1 h-full min-h-0">
                {/* Left Column: System Lockdown Controls */}
                <section className="col-span-12 xl:col-span-3 flex flex-col gap-4">
                    <div className="bg-surface-container-high p-5 flex flex-col h-full border-t border-error/30">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-headline text-sm font-bold tracking-widest text-slate-400 uppercase">System Lockdown</h2>
                            <span className="material-symbols-outlined text-error-dim">security</span>
                        </div>
                        <div className="space-y-4">
                            <button className="w-full group relative overflow-hidden bg-error-container text-white p-6 rounded-sm text-left transition-all active:scale-95">
                                <div className="relative z-10">
                                    <div className="font-headline font-black text-xl mb-1">INITIATE LOCKDOWN</div>
                                    <div className="text-[10px] opacity-70 font-mono tracking-widest">PROTOCOL: OMEGA_ZERO</div>
                                </div>
                                <span className="material-symbols-outlined absolute right-4 bottom-4 text-5xl opacity-20 group-hover:scale-110 transition-transform">lock</span>
                            </button>
                            <button className="w-full group relative overflow-hidden bg-surface-container-highest border border-outline-variant hover:border-primary text-on-surface p-6 rounded-sm text-left transition-all active:scale-95">
                                <div className="relative z-10">
                                    <div className="font-headline font-black text-xl mb-1 text-primary">BIO-METRIC PURGE</div>
                                    <div className="text-[10px] opacity-70 font-mono tracking-widest">SENSORS: DE-AUTH ALL</div>
                                </div>
                                <span className="material-symbols-outlined absolute right-4 bottom-4 text-5xl opacity-10 group-hover:text-primary transition-colors">fingerprint</span>
                            </button>
                            <button className="w-full group relative overflow-hidden bg-surface-container-highest border border-outline-variant hover:border-primary text-on-surface p-6 rounded-sm text-left transition-all active:scale-95">
                                <div className="relative z-10">
                                    <div className="font-headline font-black text-xl mb-1 text-primary">SIGNAL JAMMER</div>
                                    <div className="text-[10px] opacity-70 font-mono tracking-widest">FREQ: WIDE-BAND BLOCK</div>
                                </div>
                                <span className="material-symbols-outlined absolute right-4 bottom-4 text-5xl opacity-10 group-hover:text-primary transition-colors">wifi_off</span>
                            </button>
                        </div>
                        <div className="mt-auto pt-6 border-t border-outline-variant/30">
                            <div className="flex justify-between text-[10px] font-bold tracking-widest text-slate-500 mb-2 uppercase">Barrier Integrity</div>
                            <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                                <div className="bg-error w-[42%] h-full"></div>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-xs text-error font-mono">
                                <span>SECTOR_07_DOOR_01</span>
                                <span className="font-bold">COMPROMISED</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Center Section: Tactical Live Feed */}
                <section className="col-span-12 lg:col-span-8 xl:col-span-6 flex flex-col gap-4">
                    <div className="bg-surface-container-highest relative flex-1 flex flex-col group overflow-hidden border border-white/5">
                        {/* Overlay Controls */}
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                            <div className="bg-surface-container-lowest/80 backdrop-blur px-3 py-1 text-[10px] font-mono text-primary border border-primary/30 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                CAM_SEC_07_A
                            </div>
                            <div className="bg-surface-container-lowest/80 backdrop-blur px-3 py-1 text-[10px] font-mono text-secondary border border-secondary/30">
                                AI_TRACKING: ON
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <button className="bg-error/20 hover:bg-error/40 p-2 border border-error/50 text-error transition-all">
                                <span className="material-symbols-outlined text-sm">videocam_off</span>
                            </button>
                        </div>

                        {/* Main Video Sim */}
                        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
                            <img alt="Tactical live feed" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale brightness-50" data-alt="CCTV security footage of a high-tech server room hallway with thermal heat signatures and neon digital UI overlays for object detection" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeNMxPP16ee49E8uvafe22XHX9g_Ziw5UbiCfeY_VYqHyuQxuS4RTws9Aqnf0ThLLj3xyQpYh_1plrF9GZjdI5quprWgyhWbq-ZMsJlo0iX2bE7Zu-2qIHe15iSBJncdckYJzDVHjGlsF64n6cJxUBAe4Ox9uAl45KLrbrLNX0X9RyjjJI_sD49CSyrhqi41eZpnn3CPVNi4q2JHT2tqPSnBL_xrcyOkk9sj36rcTtVbiuBTdN8fWaiB27kp4TfcYaas5qTJxyP54" />
                            
                            {/* Thermal/AI Overlays */}
                            <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
                            <div className="absolute top-1/4 left-1/3 w-32 h-48 border-2 border-error/50 flex flex-col justify-between p-1">
                                <div className="text-[8px] font-mono bg-error text-white w-fit px-1">TARGET_01: HOSTILE</div>
                                <div className="text-[8px] font-mono text-error text-right">HEAT_SIG: 38.2°C</div>
                            </div>
                            <div className="absolute bottom-1/3 right-1/4 w-40 h-56 border-2 border-primary/50 flex flex-col justify-between p-1">
                                <div className="text-[8px] font-mono bg-primary text-on-primary w-fit px-1">SENTINEL_DRONE_04</div>
                                <div className="text-[8px] font-mono text-primary text-right">STATUS: INTERCEPTING</div>
                            </div>

                            {/* HUD Elements */}
                            <div className="absolute inset-0 border-[20px] border-transparent p-4 flex flex-col justify-between pointer-events-none">
                                <div className="flex justify-between items-start opacity-50">
                                    <div className="w-8 h-8 border-t-2 border-l-2 border-white"></div>
                                    <div className="w-8 h-8 border-t-2 border-r-2 border-white"></div>
                                </div>
                                <div className="flex justify-between items-end opacity-50">
                                    <div className="w-8 h-8 border-b-2 border-l-2 border-white"></div>
                                    <div className="w-8 h-8 border-b-2 border-r-2 border-white"></div>
                                </div>
                            </div>
                        </div>

                        {/* Feed Footer */}
                        <div className="bg-surface-container-high p-4 flex items-center justify-between border-t border-white/5">
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="text-[8px] text-slate-500 uppercase font-bold">Zoom</div>
                                    <div className="text-xs font-headline">400%</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[8px] text-slate-500 uppercase font-bold">Exposure</div>
                                    <div className="text-xs font-headline">+0.5 EV</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-400">THERMAL_OVERLAY</span>
                                <div className="w-10 h-5 bg-primary/20 rounded-full relative p-1 cursor-pointer">
                                    <div className="w-3 h-3 bg-primary rounded-full float-right"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Column: Unit Deployment */}
                <section className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-4">
                    <div className="bg-surface-container-high p-5 h-full flex flex-col">
                        <h2 className="font-headline text-sm font-bold tracking-widest text-slate-400 uppercase mb-4">Unit Deployment</h2>
                        {/* Mini Map */}
                        <div className="w-full aspect-square bg-surface-container-lowest border border-outline-variant relative mb-6 overflow-hidden">
                            <img alt="Tactical Map" className="absolute inset-0 w-full h-full object-cover opacity-20 contrast-125" data-alt="Technical blueprint and architectural floorplan of a futuristic facility with blue and red highlighted zones for tactical planning" data-location="Sector 07 Floorplan" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSDgkKdrgYvWPz3jHwTYxfHjMzJXmI3m6RicqUlbWPK_U4H-vSwy-6m_yRKfuvrxUhDz0e3NsElkfeiXPmzPOwPqc2k_Na6RPiExMHzF6ZZ-ajvgfx_JHmZYJ5fbMqfnAIPgmVkBkCGRQDqBdUPzaQg_aTGhr35_iM8tVJxUhZ_Qa9qCMXcVTRUku31-7t9ZtJ36pO_daIm1pfNu83brvsZLtmJTt-px7j5vMyAyur9n3W1QuOLZHPDRqIilv8__oQVLsMVHVw_s4" />
                            {/* Map Markers */}
                            <div className="absolute top-[40%] left-[30%] flex flex-col items-center">
                                <div className="w-2 h-2 bg-primary shadow-[0_0_10px_#3bbffa]"></div>
                                <span className="text-[8px] font-mono text-primary mt-1">ALPHA</span>
                            </div>
                            <div className="absolute top-[65%] left-[55%] flex flex-col items-center">
                                <div className="w-2 h-2 bg-primary shadow-[0_0_10px_#3bbffa]"></div>
                                <span className="text-[8px] font-mono text-primary mt-1">BRAVO</span>
                            </div>
                            <div className="absolute top-[20%] right-[20%] flex flex-col items-center">
                                <div className="w-3 h-3 bg-error shadow-[0_0_10px_#ff716c] rotate-45"></div>
                                <span className="text-[8px] font-mono text-error mt-1">HOSTILE</span>
                            </div>
                        </div>

                        {/* Teams List */}
                        <div className="space-y-3 overflow-y-auto pr-2">
                            <div className="bg-surface-container-highest p-3 border-l-2 border-secondary flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-secondary/10 p-2 rounded-sm text-secondary">
                                        <span className="material-symbols-outlined text-sm">groups</span>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold font-headline">TEAM_ALPHA</div>
                                        <div className="text-[9px] text-secondary uppercase font-mono tracking-tighter">ENGAGED / SECTOR_07_B</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[8px] text-slate-500">VITALS</div>
                                    <div className="text-[10px] text-secondary font-mono">100%</div>
                                </div>
                            </div>
                            <div className="bg-surface-container-highest p-3 border-l-2 border-primary flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-sm text-primary">
                                        <span className="material-symbols-outlined text-sm">groups</span>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold font-headline">TEAM_BRAVO</div>
                                        <div className="text-[9px] text-primary uppercase font-mono tracking-tighter">RE-POSITIONING / HALLWAY_C</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[8px] text-slate-500">VITALS</div>
                                    <div className="text-[10px] text-primary font-mono">94%</div>
                                </div>
                            </div>
                            <div className="bg-surface-container-highest p-3 border-l-2 border-slate-700 opacity-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-700 p-2 rounded-sm text-slate-400">
                                        <span className="material-symbols-outlined text-sm">groups</span>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold font-headline">TEAM_CHARLIE</div>
                                        <div className="text-[9px] text-slate-500 uppercase font-mono tracking-tighter">STANDBY / GARAGE</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="mt-auto w-full border border-primary/30 text-primary py-3 font-headline text-[10px] font-bold tracking-widest uppercase hover:bg-primary/5 transition-colors">
                            REQUEST REINFORCEMENTS
                        </button>
                    </div>
                </section>
            </div>

            {/* Bottom Section: Critical Incident Log */}
            <section className="h-40 bg-surface-container-lowest border border-outline-variant/30 flex flex-col">
                <div className="px-4 py-2 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container">
                    <div className="flex items-center gap-4">
                        <h2 className="font-headline text-[10px] font-bold tracking-widest text-slate-400 uppercase">Critical Incident Log</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                            <span className="text-[10px] font-mono text-error">LIVE_TELEMETRY_SYNC</span>
                        </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">NODE_772_LOG_STREAM</div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed space-y-1">
                    <div className="flex gap-4 text-error">
                        <span className="opacity-50">[14:02:11:04]</span>
                        <span className="font-bold">CRITICAL:</span>
                        <span>SECTOR_07_DOOR_01 BYPASS DETECTED. AUTHORIZATION_CODE: INVALID.</span>
                    </div>
                    <div className="flex gap-4 text-primary">
                        <span className="opacity-50">[14:02:15:22]</span>
                        <span className="font-bold">INFO:</span>
                        <span>DRONE_SQUAD_04 DEPLOYED FROM HANGAR_B. ESTIMATED INTERCEPT: 15 SEC.</span>
                    </div>
                    <div className="flex gap-4 text-secondary">
                        <span className="opacity-50">[14:02:22:11]</span>
                        <span className="font-bold">STATUS:</span>
                        <span>TEAM_ALPHA EN-ROUTE TO SECTOR_07_B. WEAPONS FREE AUTHORIZED.</span>
                    </div>
                    <div className="flex gap-4 text-on-surface/60">
                        <span className="opacity-50">[14:02:28:44]</span>
                        <span className="font-bold">SYSTEM:</span>
                        <span>INITIALIZING BIO-METRIC SCANNER GRID IN ADJACENT SECTORS...</span>
                    </div>
                    <div className="flex gap-4 text-error">
                        <span className="opacity-50">[14:02:35:01]</span>
                        <span className="font-bold">ALERT:</span>
                        <span>THERMAL ANOMALY IN SECTOR_07_VENT_C4. POSSIBLE MULTI-VECTOR BREACH.</span>
                    </div>
                    <div className="flex gap-4 text-primary">
                        <span className="opacity-50">[14:02:41:18]</span>
                        <span className="font-bold">INFO:</span>
                        <span>TEAM_BRAVO RE-POSITIONING TO REAR ACCESS HALLWAY_C.</span>
                    </div>
                    <div className="flex gap-4 text-secondary">
                        <span className="opacity-50">[14:02:50:09]</span>
                        <span className="font-bold">STATUS:</span>
                        <span>PERIMETER SHIELDS AT 88%. STABILIZING...</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EmergencyOperationsPage;
