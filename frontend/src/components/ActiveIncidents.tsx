import React from 'react';
import type { Threat } from '../hooks/useRealTimeAlerts';

interface ActiveIncidentsProps {
    alerts?: Threat[];
}

const ActiveIncidents: React.FC<ActiveIncidentsProps> = ({ alerts = [] }) => {
    const criticalCount = alerts.filter(a => a.type === 'weapon').length;
    const highCount = alerts.filter(a => a.type === 'violence').length;

    return (
        <aside className="w-80 bg-slate-50 dark:bg-surface-container flex flex-col border-l border-slate-200 dark:border-outline-variant/10 z-20">
            <div className="p-5 border-b border-slate-200 dark:border-outline-variant/10">
                <div className="flex justify-between items-center mb-1">
                    <h2 className="font-headline font-bold text-lg tracking-tight text-slate-900 dark:text-white">Active Incidents</h2>
                    <div className="flex gap-1">
                        {criticalCount > 0 && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 bg-error/20 text-error rounded-sm">CRITICAL</span>
                        )}
                        {highCount > 0 && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 bg-tertiary/20 text-tertiary rounded-sm">HIGH</span>
                        )}
                    </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-on-surface-variant">Real-time threat intelligence feed</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {alerts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 text-center p-8">
                        <span className="material-symbols-outlined text-4xl mb-2">shield_check</span>
                        <p className="text-xs font-bold uppercase tracking-widest">No Active Threats</p>
                        <p className="text-[10px]">Scanning security vectors...</p>
                    </div>
                ) : (
                    alerts.map((alert) => (
                        <div key={alert.id} className={`bg-white dark:bg-surface-container-high p-4 rounded-sm border-l-4 hover:bg-slate-50 dark:hover:bg-surface-container-highest transition-colors cursor-pointer shadow-sm dark:shadow-none group ${
                            alert.type === 'weapon' ? 'border-error' : 'border-tertiary'
                        }`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold uppercase ${
                                    alert.type === 'weapon' ? 'text-error' : 'text-tertiary'
                                }`}>{alert.type} detected</span>
                                <span className="text-[10px] text-slate-400 dark:text-outline">
                                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold font-headline mb-1 text-slate-900 dark:text-on-surface group-hover:text-primary transition-colors">
                                {alert.location}
                            </h4>
                            <p className="text-[11px] text-slate-600 dark:text-on-surface-variant leading-relaxed mb-3">
                                Confidence: {(alert.confidence * 100).toFixed(1)}% | Camera: {alert.camera_id}
                            </p>
                            <div className="flex gap-2">
                                <button className={`px-3 py-1 text-[10px] font-bold text-white rounded-sm hover:brightness-120 ${
                                    alert.type === 'weapon' ? 'bg-error' : 'bg-tertiary'
                                }`}>RESPOND</button>
                                <button className="px-3 py-1 border border-slate-300 dark:border-outline-variant text-[10px] font-bold text-slate-600 dark:text-on-surface rounded-sm hover:bg-slate-100 dark:hover:bg-white/5">DISMISS</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 bg-white dark:bg-surface-container-high border-t border-slate-200 dark:border-outline-variant/10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-none">
                <div className="flex items-center justify-between text-[11px] font-bold mb-3">
                    <span className="text-slate-700 dark:text-on-surface">BANDWIDTH UTILIZATION</span>
                    <span className="text-primary">Gbit/s</span>
                </div>
                <div className="flex items-end gap-1 h-12">
                    <div className="flex-1 bg-primary/20 h-1/2 rounded-t-[1px]"></div>
                    <div className="flex-1 bg-primary/30 h-2/3 rounded-t-[1px]"></div>
                    <div className="flex-1 bg-primary/40 h-3/4 rounded-t-[1px]"></div>
                    <div className="flex-1 bg-primary/20 h-1/3 rounded-t-[1px]"></div>
                    <div className="flex-1 bg-primary h-full rounded-t-[1px]"></div>
                    <div className="flex-1 bg-primary/60 h-4/5 rounded-t-[1px]"></div>
                    <div className="flex-1 bg-primary/30 h-1/2 rounded-t-[1px]"></div>
                </div>
            </div>
        </aside>
    );
};

export default ActiveIncidents;
