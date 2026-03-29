const LogExplorerPage = () => {
    return (
        <div className="flex-1 flex flex-col min-h-0 bg-background text-on-surface font-body overflow-hidden">
            <style>
                {`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    .glass-surface {
                        backdrop-filter: blur(12px);
                        background: rgba(20, 31, 56, 0.8);
                    }
                `}
            </style>

            {/* Dashboard Header & Top Filters */}
            <section className="p-8 pb-4 shrink-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="text-primary-dim font-headline font-bold uppercase tracking-[0.2em] text-xs">Operational Intelligence</span>
                        <h1 className="text-5xl font-headline font-black text-on-surface tracking-tight mt-1">LOG EXPLORER</h1>
                    </div>
                    {/* Analytics Widgets */}
                    <div className="flex gap-4">
                        <div className="bg-surface-container-high p-4 rounded-sm min-w-[140px] flex flex-col justify-between border-l-2 border-error">
                            <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Critical Errors</p>
                            <div className="flex items-end justify-between mt-2">
                                <span className="text-2xl font-headline font-bold text-error">12</span>
                                <div className="flex items-end gap-[2px]">
                                    <div className="w-1 bg-error/20 h-2"></div>
                                    <div className="w-1 bg-error h-4"></div>
                                    <div className="w-1 bg-error/40 h-3"></div>
                                    <div className="w-1 bg-error h-6"></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface-container-high p-4 rounded-sm min-w-[140px] flex flex-col justify-between border-l-2 border-primary">
                            <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Total Events</p>
                            <div className="flex items-end justify-between mt-2">
                                <span className="text-2xl font-headline font-bold text-primary">8.4k</span>
                                <div className="flex items-end gap-[2px]">
                                    <div className="w-1 bg-primary/20 h-4"></div>
                                    <div className="w-1 bg-primary h-6"></div>
                                    <div className="w-1 bg-primary h-3"></div>
                                    <div className="w-1 bg-primary/40 h-5"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Filters Bar */}
                <div className="mt-8 bg-surface-container-low p-2 rounded-sm flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1.5 rounded-sm">
                        <span className="material-symbols-outlined text-outline text-lg">calendar_today</span>
                        <span className="text-[11px] font-bold text-on-surface">LAST 24 HOURS</span>
                        <span className="material-symbols-outlined text-outline text-sm">expand_more</span>
                    </div>
                    <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1.5 rounded-sm">
                        <span className="material-symbols-outlined text-error text-lg">error</span>
                        <span className="text-[11px] font-bold text-on-surface">SEVERITY: ALL</span>
                        <span className="material-symbols-outlined text-outline text-sm">expand_more</span>
                    </div>
                    <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1.5 rounded-sm">
                        <span className="material-symbols-outlined text-outline text-lg">lan</span>
                        <span className="text-[11px] font-bold text-on-surface">SOURCE: NODE-ALL</span>
                        <span className="material-symbols-outlined text-outline text-sm">expand_more</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <div className="relative border-r border-white/5 pr-4 mr-2">
                            <input className="bg-surface-container-highest border-none rounded-sm text-[11px] py-1.5 pl-8 pr-4 w-48 focus:ring-1 focus:ring-primary text-on-surface placeholder-outline-variant" placeholder="Filter messages..." type="text" />
                            <span className="material-symbols-outlined absolute left-2 top-1.5 text-outline text-sm">filter_list</span>
                        </div>
                        <button className="bg-primary hover:bg-primary-dim text-on-primary text-[10px] font-bold px-4 py-2 rounded-sm uppercase tracking-widest transition-colors">Apply Filters</button>
                        <button className="text-outline hover:text-on-surface p-1.5 transition-colors"><span className="material-symbols-outlined">refresh</span></button>
                    </div>
                </div>
            </section>

            {/* Main Workspace: Log Table & Live Stream */}
            <section className="flex flex-1 gap-6 p-8 pt-0 min-h-0">
                {/* Central Log Explorer */}
                <div className="flex-1 flex flex-col min-w-0 bg-surface-container rounded-sm overflow-hidden h-full border border-white/5">
                    <div className="grid grid-cols-[140px_100px_140px_1fr] bg-surface-container-high px-4 py-3 border-b border-white/5 shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-outline">Timestamp</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-outline">Severity</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-outline">Source</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-outline">Message</span>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar font-body min-h-0 relative">
                        {/* Log Entries */}
                        <div className="grid grid-cols-[140px_100px_140px_1fr] px-4 py-3 hover:bg-white/5 transition-colors items-center border-b border-white/5 bg-surface-container">
                            <span className="text-[11px] text-tertiary font-medium">2023-10-24 14:22:01</span>
                            <div><span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-error-container text-on-error uppercase">CRITICAL</span></div>
                            <span className="text-[11px] text-on-surface-variant font-mono truncate mr-2">edge-node-04</span>
                            <span className="text-[11px] text-on-surface truncate pr-4">Unauthenticated packet overflow detected at port 443. Potential DDoS signature.</span>
                        </div>
                        <div className="grid grid-cols-[140px_100px_140px_1fr] px-4 py-3 hover:bg-white/5 transition-colors items-center border-b border-white/5 bg-surface-container-low">
                            <span className="text-[11px] text-tertiary font-medium">2023-10-24 14:21:58</span>
                            <div><span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-orange-950 text-orange-400 uppercase">WARNING</span></div>
                            <span className="text-[11px] text-on-surface-variant font-mono truncate mr-2">auth-service</span>
                            <span className="text-[11px] text-on-surface truncate pr-4">Repeated login failures (5) for user: admin_svc from IP 192.168.1.45</span>
                        </div>
                        <div className="grid grid-cols-[140px_100px_140px_1fr] px-4 py-3 hover:bg-white/5 transition-colors items-center border-b border-white/5 bg-surface-container">
                            <span className="text-[11px] text-tertiary font-medium">2023-10-24 14:21:45</span>
                            <div><span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary-dim uppercase">INFO</span></div>
                            <span className="text-[11px] text-on-surface-variant font-mono truncate mr-2">sys-kernel</span>
                            <span className="text-[11px] text-on-surface truncate pr-4">Routine cleanup of temporary cache buffers completed in 45ms.</span>
                        </div>
                        <div className="grid grid-cols-[140px_100px_140px_1fr] px-4 py-3 hover:bg-white/5 transition-colors items-center border-b border-white/5 bg-surface-container-low">
                            <span className="text-[11px] text-tertiary font-medium">2023-10-24 14:21:30</span>
                            <div><span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-secondary/20 text-secondary uppercase">SUCCESS</span></div>
                            <span className="text-[11px] text-on-surface-variant font-mono truncate mr-2">db-cluster-01</span>
                            <span className="text-[11px] text-on-surface truncate pr-4">Primary-Secondary synchronization successfully validated. Replication lag: 0.02s</span>
                        </div>
                        <div className="grid grid-cols-[140px_100px_140px_1fr] px-4 py-3 hover:bg-white/5 transition-colors items-center border-b border-white/5 bg-surface-container">
                            <span className="text-[11px] text-tertiary font-medium">2023-10-24 14:21:12</span>
                            <div><span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary-dim uppercase">DEBUG</span></div>
                            <span className="text-[11px] text-on-surface-variant font-mono truncate mr-2">api-v2-proxy</span>
                            <span className="text-[11px] text-on-surface truncate pr-4">Request tracing enabled for session ID: 4492-AXC-99. Header size: 1.2kb</span>
                        </div>
                        <div className="grid grid-cols-[140px_100px_140px_1fr] px-4 py-3 hover:bg-white/5 transition-colors items-center border-b border-white/5 bg-surface-container-low">
                            <span className="text-[11px] text-tertiary font-medium">2023-10-24 14:20:55</span>
                            <div><span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-orange-950 text-orange-400 uppercase">WARNING</span></div>
                            <span className="text-[11px] text-on-surface-variant font-mono truncate mr-2">edge-node-02</span>
                            <span className="text-[11px] text-on-surface truncate pr-4">Memory usage exceeding 85% threshold. Scaling group 'worker-omega' triggered.</span>
                        </div>
                        <div className="grid grid-cols-[140px_100px_140px_1fr] px-4 py-3 hover:bg-white/5 transition-colors items-center border-b border-white/5 bg-surface-container">
                            <span className="text-[11px] text-tertiary font-medium">2023-10-24 14:20:41</span>
                            <div><span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-error-container text-on-error uppercase">CRITICAL</span></div>
                            <span className="text-[11px] text-on-surface-variant font-mono truncate mr-2">sec-firewall</span>
                            <span className="text-[11px] text-on-surface truncate pr-4">Unauthorized attempt to modify kernel-level network configuration rules. Rootkit suspect.</span>
                        </div>
                        <div className="grid grid-cols-[140px_100px_140px_1fr] px-4 py-3 hover:bg-white/5 transition-colors items-center border-b border-white/5 bg-surface-container-low">
                            <span className="text-[11px] text-tertiary font-medium">2023-10-24 14:20:10</span>
                            <div><span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary-dim uppercase">INFO</span></div>
                            <span className="text-[11px] text-on-surface-variant font-mono truncate mr-2">user-svc</span>
                            <span className="text-[11px] text-on-surface truncate pr-4">Session rotated for user 'analyst_9'. OAuth token refreshed successfully.</span>
                        </div>
                        <div className="grid grid-cols-[140px_100px_140px_1fr] px-4 py-3 hover:bg-white/5 transition-colors items-center border-b border-white/5 bg-surface-container">
                            <span className="text-[11px] text-tertiary font-medium">2023-10-24 14:19:59</span>
                            <div><span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary-dim uppercase">INFO</span></div>
                            <span className="text-[11px] text-on-surface-variant font-mono truncate mr-2">telemetry-hub</span>
                            <span className="text-[11px] text-on-surface truncate pr-4">Streaming telemetry heartbeat active. All 42 nodes reporting healthy states.</span>
                        </div>
                    </div>
                    <div className="bg-surface-container-high px-4 py-2 flex items-center justify-between text-[10px] text-outline shrink-0">
                        <span>Showing 1-50 of 8,421 events</span>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span> Previous</button>
                            <span className="text-on-surface font-bold">1 / 169</span>
                            <button className="flex items-center gap-1 hover:text-on-surface transition-colors">Next <span className="material-symbols-outlined text-sm">chevron_right</span></button>
                        </div>
                    </div>
                </div>

                {/* Telemetry Sidebar */}
                <div className="hidden lg:flex w-80 flex-col gap-6 overflow-y-auto pr-2 no-scrollbar">
                    {/* System Pulse */}
                    <div className="bg-surface-container border border-white/5 p-5 rounded-sm shrink-0">
                        <h3 className="text-xs font-headline font-bold uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                            Live Telemetry
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-bold text-outline-variant mb-1">
                                    <span>CPU Utilization</span>
                                    <span className="text-on-surface">42%</span>
                                </div>
                                <div className="h-1 bg-surface-container-highest w-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '42%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-bold text-outline-variant mb-1">
                                    <span>Memory Load</span>
                                    <span className="text-on-surface">78%</span>
                                </div>
                                <div className="h-1 bg-surface-container-highest w-full overflow-hidden">
                                    <div className="h-full bg-secondary-dim" style={{ width: '78%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-bold text-outline-variant mb-1">
                                    <span>Network Latency</span>
                                    <span className="text-on-surface">12ms</span>
                                </div>
                                <div className="h-1 bg-surface-container-highest w-full overflow-hidden">
                                    <div className="h-full bg-tertiary" style={{ width: '20%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Status */}
                    <div className="bg-surface-container border border-white/5 p-5 rounded-sm shrink-0 flex flex-col">
                        <h3 className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface mb-4">Active Services</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 bg-surface-container-low border border-white/5 rounded-sm hover:border-white/20 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary text-lg">dns</span>
                                    <span className="text-[11px] font-bold">API Gateway</span>
                                </div>
                                <span className="text-[9px] font-bold text-secondary uppercase tracking-tighter bg-secondary/10 px-1.5 py-0.5 rounded-sm">Running</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-surface-container-low border border-white/5 rounded-sm hover:border-white/20 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary text-lg">shield</span>
                                    <span className="text-[11px] font-bold">Auth Engine</span>
                                </div>
                                <span className="text-[9px] font-bold text-secondary uppercase tracking-tighter bg-secondary/10 px-1.5 py-0.5 rounded-sm">Running</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-surface-container-low border border-white/5 rounded-sm hover:border-white/20 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-error text-lg">database</span>
                                    <span className="text-[11px] font-bold">DB Shadow</span>
                                </div>
                                <span className="text-[9px] font-bold text-error uppercase tracking-tighter bg-error/10 px-1.5 py-0.5 rounded-sm">Syncing</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-surface-container-low border border-white/5 rounded-sm hover:border-white/20 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary text-lg">lan</span>
                                    <span className="text-[11px] font-bold">Network Watch</span>
                                </div>
                                <span className="text-[9px] font-bold text-secondary uppercase tracking-tighter bg-secondary/10 px-1.5 py-0.5 rounded-sm">Running</span>
                            </div>
                        </div>

                        {/* Mini Asset Map Overlay Concept */}
                        <div className="mt-8 relative aspect-video bg-surface-container-lowest rounded-sm overflow-hidden border border-white/5 group">
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50"></div>
                            <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-dim shadow-[0_0_8px_rgba(5,169,227,0.8)]"></div>
                                <span className="text-[9px] uppercase font-bold tracking-widest text-primary-dim drop-shadow-md">Global Uplink</span>
                            </div>
                            <div className="w-full h-full flex items-center justify-center relative">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full border border-primary/20 animate-ping absolute -inset-0"></div>
                                    <span className="material-symbols-outlined text-primary-dim text-3xl opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_10px_rgba(5,169,227,0.5)]">public</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LogExplorerPage;
