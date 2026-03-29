import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    
    // Function to compute NavLink classes based on active state
    const linkClasses = ({ isActive }: { isActive: boolean }) => {
        const baseClasses = "flex items-center gap-3 px-4 py-3 group transition-all duration-200 ease-in-out font-medium ";
        const activeClasses = "bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-r-2 border-sky-600 dark:border-sky-400";
        const inactiveClasses = "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/5";
        
        return baseClasses + (isActive ? activeClasses : inactiveClasses);
    };

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col border-r border-slate-200 dark:border-slate-800/50 bg-slate-100 dark:bg-[#060d20] transition-all duration-200 ease-in-out z-50">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dim rounded-sm flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-slate-900 dark:text-slate-50 font-headline leading-tight">Omni Core</h1>
                        <p className="text-[10px] uppercase tracking-widest text-secondary font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary block"></span>
                            System: Online
                        </p>
                    </div>
                </div>
                <nav className="space-y-1">
                    <NavLink to="/threat-map" className={linkClasses}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                        <span className="font-label">Threat Map</span>
                    </NavLink>
                    <NavLink to="/live-feeds" className={linkClasses}>
                        <span className="material-symbols-outlined">sensors</span>
                        <span className="font-label">Live Feeds</span>
                    </NavLink>
                    <NavLink to="/cameras" className={linkClasses}>
                        <span className="material-symbols-outlined">videocam</span>
                        <span className="font-label">Cameras</span>
                    </NavLink>
                    <NavLink to="/incidents" className={linkClasses}>
                        <span className="material-symbols-outlined">warning</span>
                        <span className="font-label">Incidents</span>
                    </NavLink>
                    <NavLink to="/video-analysis" className={linkClasses}>
                        <span className="material-symbols-outlined">analytics</span>
                        <span className="font-label">Video Analyst</span>
                    </NavLink>
                </nav>
            </div>
            <div className="mt-auto p-6 space-y-4">
                <NavLink to="/emergency" className="w-full py-3 block text-center bg-error-container text-white text-xs font-bold uppercase tracking-tighter rounded-sm hover:brightness-110 transition-all active:scale-95">
                    Emergency Ops
                </NavLink>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800/50 flex flex-col gap-2">
                    <NavLink className="flex items-center gap-3 px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm " to="/support">
                        <span className="material-symbols-outlined text-lg">help</span>
                        <span>Support</span>
                    </NavLink>
                    <NavLink className="flex items-center gap-3 px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors text-sm" to="/logs">
                        <span className="material-symbols-outlined text-lg">terminal</span>
                        <span>Logs</span>
                    </NavLink>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
