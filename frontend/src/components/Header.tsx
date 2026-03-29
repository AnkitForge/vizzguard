import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    onOpenNotifications?: () => void;
    onReset?: () => void;
    connectionStatus?: 'connecting' | 'connected' | 'error';
    alertCount?: number;
}

const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onReset, connectionStatus = 'connecting', alertCount = 0 }) => {
    const { logout, user } = useAuth();
    
    return (
        <header className="flex justify-between items-center w-full px-6 h-16 bg-slate-50/80 dark:bg-[#060d20]/80 backdrop-blur-xl docked full-width top-0 sticky z-40">
            <div className="flex items-center gap-4">
                <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-100 font-headline">Sentinel Omni</span>
                <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-sm">
                    <div className={`w-2 h-2 rounded-full ${
                        connectionStatus === 'connected' ? 'bg-success animate-pulse' :
                        connectionStatus === 'connecting' ? 'bg-warning animate-pulse' : 'bg-error'
                    }`} title={`Edge AI: ${connectionStatus}`}></div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Edge-{connectionStatus === 'connected' ? '01' : 'OFFLINE'}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {/* Reset System Button */}
                <button
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-sm transition-all active:scale-90 group relative"
                    onClick={onReset}
                    title="Reset Surveillance Process"
                >
                    <span className="material-symbols-outlined">restart_alt</span>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-[8px] font-black text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest border border-white/10 shadow-2xl">Reset Process</span>
                </button>
                <button 
                    onClick={onOpenNotifications}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-sm transition-all active:scale-90 relative"
                >
                    <span className="material-symbols-outlined">notifications</span>
                    {alertCount > 0 && (
                        <>
                            <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-error rounded-full animate-ping opacity-75"></span>
                            <span className="absolute top-2 right-2 min-w-[14px] h-[14px] bg-error text-white text-[8px] font-bold flex items-center justify-center rounded-full px-0.5">{alertCount > 99 ? '99+' : alertCount}</span>
                        </>
                    )}
                </button>
                <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-sm transition-all active:scale-90">
                    <span className="material-symbols-outlined">settings</span>
                </button>
                <button 
                    onClick={logout}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-sm transition-all active:scale-90"
                    title="Logout"
                >
                    <span className="material-symbols-outlined">logout</span>
                </button>
                <div className="ml-2 w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 flex items-center justify-center bg-primary/20 text-primary font-bold text-xs">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
            </div>
        </header>
    );
};

export default Header;
