import React from 'react';
import type { Threat } from '../hooks/useRealTimeAlerts';

interface LiveLogsProps {
    alerts?: Threat[];
}

const LiveLogs: React.FC<LiveLogsProps> = ({ alerts = [] }) => {
    // Show only the last 20 alerts in logs to keep it clean
    const recentAlerts = [...alerts].reverse().slice(0, 20);

    return (
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant/20 p-4 font-mono text-[11px]">
            <div className="flex items-center gap-4 mb-3 border-b border-outline-variant/10 pb-2">
                <span className="text-secondary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">terminal</span> LIVE_LOGS
                </span>
                <span className="text-outline">AI_AGENT-0.1.0-alpha</span>
                <div className="flex-1"></div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                    <span className="text-[9px] uppercase tracking-tighter text-outline-variant">Listening for telemetry...</span>
                </div>
            </div>
            <div className="space-y-1 overflow-y-auto h-32 text-on-surface-variant dark:text-on-surface-variant text-slate-700 custom-scrollbar">
                {recentAlerts.length === 0 ? (
                    <div className="flex gap-4 opacity-50 italic">
                        <span className="text-outline">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                        <span className="text-primary">SYSTEM</span>
                        <span>Inference engine initialized. Awaiting first detection...</span>
                    </div>
                ) : (
                    recentAlerts.map((log) => (
                        <div key={log.id} className="flex gap-4 hover:bg-white/5 transition-colors">
                            <span className="text-outline">
                                [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]
                            </span>
                            <span className={log.type === 'weapon' ? 'text-error font-bold' : 'text-tertiary'}>
                                {log.type.toUpperCase()}
                            </span>
                            <span>
                                Threat detected at <span className="text-on-surface font-bold">{log.location}</span>. 
                                Confidence: {(log.confidence * 100).toFixed(1)}%. Camera: {log.camera_id}
                            </span>
                        </div>
                    ))
                )}
                <div className="flex gap-4 animate-pulse">
                    <span className="text-outline">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span className="text-slate-500 dark:text-on-surface-variant">READY</span>
                    <span className="bg-slate-500 dark:bg-on-surface-variant w-1.5 h-3"></span>
                </div>
            </div>
        </div>
    );
};

export default LiveLogs;
