const SupportPage = () => {
    return (
        <div className="p-8 max-w-[1600px] mx-auto w-full flex-1 overflow-y-auto scan-line">
            <style>
                {`
                    .glass-panel {
                        background: rgba(26, 37, 64, 0.4);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(59, 191, 250, 0.1);
                    }
                    .holographic-glow {
                        box-shadow: 0 0 20px rgba(59, 191, 250, 0.2);
                        background: linear-gradient(135deg, rgba(59, 191, 250, 0.15) 0%, rgba(5, 169, 227, 0.05) 100%);
                    }
                    .scan-line {
                        background: linear-gradient(to bottom, transparent 50%, rgba(59, 191, 250, 0.05) 50%);
                        background-size: 100% 4px;
                    }
                    .standard-card {
                        transition: all 0.2s ease-in-out;
                    }
                    .standard-card:hover {
                        background: rgba(26, 37, 64, 0.6);
                        border-color: rgba(59, 191, 250, 0.3);
                        transform: translateY(-2px);
                    }
                `}
            </style>
            
            {/* Hero Header */}
            <header className="mb-12">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-[1px] w-12 bg-primary"></div>
                    <span className="text-secondary font-headline text-xs tracking-[0.3em] uppercase">Tactical Support Node</span>
                </div>
                <h1 className="text-5xl font-headline font-bold tracking-tighter text-on-surface mb-4">
                    KINETIC <span className="text-primary">HELP CENTER</span>
                </h1>
                <p className="text-on-surface-variant max-w-2xl font-body leading-relaxed">
                    Integrated intelligence portal for the Sentinel Omni 3D ecosystem. Real-time neural core support and diagnostic protocols for elite operators.
                </p>
            </header>

            {/* Clean 2D Help Hub */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 py-12">
                {/* System Documentation */}
                <div className="standard-card glass-panel p-8 relative overflow-hidden group cursor-pointer border-t-2 border-primary/40">
                    <div className="absolute -right-4 -top-4 text-primary/5 text-9xl font-headline select-none pointer-events-none">DOC</div>
                    <span className="material-symbols-outlined text-4xl text-primary mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
                    <h3 className="text-2xl font-headline font-bold text-on-surface mb-3">System Documentation</h3>
                    <p className="text-on-surface-variant text-sm font-body mb-6">Master every module of the Omni 3D suite with technical blueprints and deployment guides.</p>
                    <div className="flex items-center text-primary text-xs font-bold tracking-widest uppercase gap-2 group-hover:gap-4 transition-all">
                        Access Archives <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                    </div>
                </div>

                {/* Diagnostics Hub */}
                <div className="standard-card glass-panel p-8 relative overflow-hidden group cursor-pointer border-t-2 border-secondary/40">
                    <div className="absolute -right-4 -top-4 text-secondary/5 text-9xl font-headline select-none pointer-events-none">DIAG</div>
                    <span className="material-symbols-outlined text-4xl text-secondary mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                    <h3 className="text-2xl font-headline font-bold text-on-surface mb-3">Diagnostics Hub</h3>
                    <p className="text-on-surface-variant text-sm font-body mb-6">Run deep-packet inspection on your mesh network and calibrate neural sensor arrays.</p>
                    <div className="flex items-center text-secondary text-xs font-bold tracking-widest uppercase gap-2 group-hover:gap-4 transition-all">
                        Initiate Scan <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                    </div>
                </div>

                {/* Operator Support */}
                <div className="standard-card glass-panel p-8 relative overflow-hidden group cursor-pointer border-t-2 border-tertiary/40">
                    <div className="absolute -right-4 -top-4 text-tertiary/5 text-9xl font-headline select-none pointer-events-none">OPS</div>
                    <span className="material-symbols-outlined text-4xl text-tertiary mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>headset_mic</span>
                    <h3 className="text-2xl font-headline font-bold text-on-surface mb-3">Operator Support</h3>
                    <p className="text-on-surface-variant text-sm font-body mb-6">Direct uplink to Level 4 tactical engineers for immediate mission-critical troubleshooting.</p>
                    <div className="flex items-center text-tertiary text-xs font-bold tracking-widest uppercase gap-2 group-hover:gap-4 transition-all">
                        Establish Link <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Interactive Knowledge Base (Left/Center) */}
                <div className="xl:col-span-3 space-y-8">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-headline font-bold tracking-wide uppercase text-on-surface">Knowledge Matrix</h2>
                        <div className="relative w-72">
                            <input className="w-full bg-surface-container-high border-none text-xs font-headline tracking-widest p-3 pr-10 focus:ring-1 focus:ring-primary" placeholder="QUERY DATABASE..." type="text" />
                            <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-500 text-lg">search</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* KB Card 1 */}
                        <div className="bg-surface-container-low p-5 hover:bg-surface-container hover:shadow-lg transition-all border-l-2 border-primary group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <span className="material-symbols-outlined text-primary">hub</span>
                                <span className="text-[10px] font-bold text-slate-500 font-headline uppercase">PROTO-09</span>
                            </div>
                            <h4 className="text-sm font-headline font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">Neural Core Calibration</h4>
                            <p className="text-xs text-on-surface-variant leading-relaxed">Optimization algorithms for low-latency feedback loops.</p>
                        </div>
                        {/* KB Card 2 */}
                        <div className="bg-surface-container-low p-5 hover:bg-surface-container hover:shadow-lg transition-all border-l-2 border-secondary group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <span className="material-symbols-outlined text-secondary">lan</span>
                                <span className="text-[10px] font-bold text-slate-500 font-headline uppercase">NET-X2</span>
                            </div>
                            <h4 className="text-sm font-headline font-bold text-on-surface mb-2 group-hover:text-secondary transition-colors">Network Mesh Protocols</h4>
                            <p className="text-xs text-on-surface-variant leading-relaxed">Secure tunneling through high-interference environmental zones.</p>
                        </div>
                        {/* KB Card 3 */}
                        <div className="bg-surface-container-low p-5 hover:bg-surface-container hover:shadow-lg transition-all border-l-2 border-tertiary group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <span className="material-symbols-outlined text-tertiary">layers</span>
                                <span className="text-[10px] font-bold text-slate-500 font-headline uppercase">UI-3D</span>
                            </div>
                            <h4 className="text-sm font-headline font-bold text-on-surface mb-2 group-hover:text-tertiary transition-colors">3D UI Troubleshooting</h4>
                            <p className="text-xs text-on-surface-variant leading-relaxed">Resolving viewport clipping and parallax misalignment.</p>
                        </div>
                        {/* KB Card 4 */}
                        <div className="bg-surface-container-low p-5 hover:bg-surface-container hover:shadow-lg transition-all border-l-2 border-error group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <span className="material-symbols-outlined text-error">encrypted</span>
                                <span className="text-[10px] font-bold text-slate-500 font-headline uppercase">SEC-INF</span>
                            </div>
                            <h4 className="text-sm font-headline font-bold text-on-surface mb-2 group-hover:text-error transition-colors">Cryptographic Handshakes</h4>
                            <p className="text-xs text-on-surface-variant leading-relaxed">Manual override for failed hardware security modules.</p>
                        </div>
                        {/* KB Card 5 */}
                        <div className="bg-surface-container-low p-5 hover:bg-surface-container hover:shadow-lg transition-all border-l-2 border-primary-container group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <span className="material-symbols-outlined text-primary-container">sensors</span>
                                <span className="text-[10px] font-bold text-slate-500 font-headline uppercase">SNS-ARR</span>
                            </div>
                            <h4 className="text-sm font-headline font-bold text-on-surface mb-2 group-hover:text-primary-container transition-colors">Sensor Array Fusion</h4>
                            <p className="text-xs text-on-surface-variant leading-relaxed">Merging multi-spectral data into a unified tactical view.</p>
                        </div>
                        {/* KB Card 6 */}
                        <div className="bg-surface-container-low p-5 hover:bg-surface-container hover:shadow-lg transition-all border-l-2 border-slate-600 group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <span className="material-symbols-outlined text-slate-400">terminal</span>
                                <span className="text-[10px] font-bold text-slate-500 font-headline uppercase">CMD-LOG</span>
                            </div>
                            <h4 className="text-sm font-headline font-bold text-on-surface mb-2 group-hover:text-slate-300 transition-colors">Legacy Command Bridge</h4>
                            <p className="text-xs text-on-surface-variant leading-relaxed">Backwards compatibility for Mark II Sentinel hardware.</p>
                        </div>
                    </div>

                    {/* Priority Channels */}
                    <div className="pt-8">
                        <h2 className="text-xl font-headline font-bold tracking-wide uppercase text-on-surface mb-6">Priority Support Channels</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button className="holographic-glow flex items-center justify-center gap-4 py-4 px-6 border border-primary/20 group hover:border-primary/50 transition-all">
                                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">verified_user</span>
                                <div className="text-left">
                                    <div className="text-[10px] text-primary/70 font-headline font-bold tracking-[0.2em] uppercase">Emergency Uplink</div>
                                    <div className="text-sm font-headline font-bold text-on-surface">Level 5 Assistance</div>
                                </div>
                            </button>
                            <button className="holographic-glow flex items-center justify-center gap-4 py-4 px-6 border border-secondary/20 group hover:border-secondary/50 transition-all">
                                <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">podium</span>
                                <div className="text-left">
                                    <div className="text-[10px] text-secondary/70 font-headline font-bold tracking-[0.2em] uppercase">Tactical Comms</div>
                                    <div className="text-sm font-headline font-bold text-on-surface">Live Incident Support</div>
                                </div>
                            </button>
                            <button className="holographic-glow flex items-center justify-center gap-4 py-4 px-6 border border-error/20 group hover:border-error/50 transition-all">
                                <span className="material-symbols-outlined text-error group-hover:scale-110 transition-transform">bug_report</span>
                                <div className="text-left">
                                    <div className="text-[10px] text-error/70 font-headline font-bold tracking-[0.2em] uppercase">Threat Reporting</div>
                                    <div className="text-sm font-headline font-bold text-on-surface">System Bug Entry</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* System Diagnostics Terminal (Right Sidebar) */}
                <aside className="space-y-6">
                    <div className="bg-surface-container-high p-6 border border-primary/10">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                            <h2 className="text-sm font-headline font-bold tracking-widest text-on-surface uppercase">TELEMETRY_LIVE</h2>
                        </div>
                        <div className="space-y-6">
                            {/* Stat 1 */}
                            <div>
                                <div className="flex justify-between text-[10px] font-headline font-bold uppercase text-slate-500 mb-2">
                                    <span>Neural Stability</span>
                                    <span className="text-secondary">99.4%</span>
                                </div>
                                <div className="w-full h-1 bg-surface-container-lowest overflow-hidden">
                                    <div className="bg-secondary h-full w-[99.4%]" style={{boxShadow: '0 0 8px rgba(105,246,184,0.5)'}}></div>
                                </div>
                            </div>
                            {/* Stat 2 */}
                            <div>
                                <div className="flex justify-between text-[10px] font-headline font-bold uppercase text-slate-500 mb-2">
                                    <span>Mesh Latency</span>
                                    <span className="text-primary">12ms</span>
                                </div>
                                <div className="w-full h-1 bg-surface-container-lowest overflow-hidden">
                                    <div className="bg-primary h-full w-[15%]" style={{boxShadow: '0 0 8px rgba(59,191,250,0.5)'}}></div>
                                </div>
                            </div>
                            {/* Stat 3 */}
                            <div>
                                <div className="flex justify-between text-[10px] font-headline font-bold uppercase text-slate-500 mb-2">
                                    <span>Support Overhead</span>
                                    <span className="text-tertiary">42.8%</span>
                                </div>
                                <div className="w-full h-1 bg-surface-container-lowest overflow-hidden">
                                    <div className="bg-tertiary h-full w-[42.8%]" style={{boxShadow: '0 0 8px rgba(151,153,255,0.5)'}}></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-sky-500/10">
                            <h3 className="text-[10px] font-headline font-bold text-slate-500 uppercase mb-4 tracking-widest">Incident Log</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="text-[10px] text-slate-600 font-mono mt-0.5">08:42</div>
                                    <div className="text-[10px] text-on-surface uppercase leading-tight">Sector 7 Calibration Verified</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="text-[10px] text-slate-600 font-mono mt-0.5">09:15</div>
                                    <div className="text-[10px] text-on-surface uppercase leading-tight">User 009 established Uplink</div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="text-[10px] text-slate-600 font-mono mt-0.5">10:02</div>
                                    <div className="text-[10px] text-error uppercase leading-tight font-bold">Latency Spike in Mesh Hub A</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Support Map Visualizer */}
                    <div className="bg-surface-container-high aspect-square border border-primary/10 relative overflow-hidden group">
                        <img className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen group-hover:scale-105 transition-transform duration-1000" alt="Digital blue circuit board and mesh network glowing in deep navy space with holographic data points" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtod_duJXjVFWVSoSxVpkUTpXh0IT-wKBFljYxtUZ9nMVD8y_LGpqMSsIQ_ApVjdkaNbyfMpZKUGN35CbD4UH_wMIf84gDl8JmtE0FULhehCJ5mjW8_SXGAeGQKALVXa6RDEXIaxBVnc27voH85V_o-THJ4nbBfubQ_hfkrO8N0r8j-bOf9A_mJTkSn1z73f4LBsmy71vJTVOgDFko2FwL4Bns6cP40MXFrUZvTeKUJL9DSrKsAiSfgBC57iP6kicRrGi8y4OkgDM" />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                            <div className="text-[10px] font-headline font-bold tracking-[0.2em] text-primary uppercase">Global Node Visualizer</div>
                            <div className="text-xs text-on-surface-variant">Active Regions: 124</div>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-1">
                            <div className="w-1 h-1 bg-secondary rounded-full"></div>
                            <div className="w-1 h-1 bg-secondary rounded-full"></div>
                            <div className="w-1 h-1 bg-secondary/30 rounded-full"></div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default SupportPage;
