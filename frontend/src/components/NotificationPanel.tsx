import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Threat } from '../hooks/useRealTimeAlerts';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onClearAll?: () => void;
    alerts?: Threat[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, onClearAll, alerts = [] }) => {
    // Show real alerts, newest first
    const displayAlerts = [...alerts].reverse().map(a => ({
        id: a.id,
        type: a.type === 'weapon' ? 'critical' : 'warning',
        title: `${a.type.toUpperCase()} DETECTED`,
        location: a.location,
        time: new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: a.type === 'weapon' ? 'gavel' : 'warning',
        isReal: true,
        confidence: a.confidence
    }));

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop ... (omitted for brevity) */}
                    
                    {/* Panel */}
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 w-80 h-full glass-panel bg-surface-container-high border-l border-outline-variant/30 z-[70] shadow-2xl flex flex-col"
                    >
                        <div className="p-4 border-b border-outline-variant/20 flex flex-col gap-3 bg-surface-container">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
                                    <h2 className="font-headline font-bold text-slate-800 dark:text-slate-100 tracking-wider">ALERTS LOG</h2>
                                </div>
                                <button onClick={onClose} className="p-1 hover:bg-slate-300 dark:hover:bg-white/10 rounded-sm transition-colors text-slate-500 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>
                            
                            {displayAlerts.length > 0 && (
                                <button 
                                    onClick={onClearAll}
                                    className="w-full py-2 bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-white border border-white/5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
                                    Clear History
                                </button>
                            )}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {displayAlerts.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center p-8">
                                    <span className="material-symbols-outlined text-5xl mb-2">notifications_off</span>
                                    <p className="text-xs font-bold uppercase tracking-widest text-[10px]">No New Alerts</p>
                                    <p className="text-[9px]">Awaiting telemetry from Edge AI...</p>
                                </div>
                            ) : (
                                displayAlerts.map((notification, index) => (
                                    <motion.div 
                                        key={notification.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: Math.min(index * 0.05, 0.5) }}
                                        className={`p-3 rounded-md border text-left ring-1 ring-primary/5 ${
                                            notification.type === 'critical' ? 'bg-error-container/20 border-error/30' : 'bg-secondary/10 border-secondary/30'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-1.5 rounded-sm flex items-center justify-center ${
                                                notification.type === 'critical' ? 'bg-error text-white shadow-[0_0_10px_rgba(255,113,108,0.3)]' : 'bg-secondary text-[#000000] shadow-[0_0_10px_rgba(105,246,184,0.3)]'
                                            }`}>
                                                <span className="material-symbols-outlined text-[14px]">{notification.icon}</span>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`text-[11px] font-bold uppercase tracking-tight ${
                                                        notification.type === 'critical' ? 'text-error' : 'text-secondary'
                                                    }`}>{notification.title}</h4>
                                                    <span className="text-[9px] text-slate-500 dark:text-on-surface-variant font-mono">{notification.time}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-600 dark:text-slate-300 font-mono flex items-center gap-1 opacity-80">
                                                    <span className="material-symbols-outlined text-[10px]">location_on</span>
                                                    {notification.location}
                                                </p>
                                                <p className="text-[8px] uppercase tracking-tighter text-outline-variant font-bold">
                                                    Confidence: {(notification.confidence * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>
                                        {notification.type === 'critical' && (
                                            <div className="mt-2 flex justify-end">
                                                <button className="text-[9px] px-2 py-1 bg-error hover:brightness-110 text-white rounded-sm uppercase tracking-wider font-bold transition-all">Respond</button>
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationPanel;
