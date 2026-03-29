import { useOutletContext } from 'react-router-dom';
import type { Threat } from '../hooks/useRealTimeAlerts';

const IncidentsPage = () => {
    const { activeAlerts } = useOutletContext<{ activeAlerts: Threat[] }>();
    const criticalCount = activeAlerts.filter(a => a.type === 'weapon').length;
    const highCount = activeAlerts.filter(a => a.type === 'violence').length;

    return (
        <div className="p-8 max-w-[1600px] mx-auto w-full flex-1 overflow-y-auto">
            {/* Dashboard Stats Header (Bento Style) */}
            <div className="grid grid-cols-12 gap-6 mb-10">
                <div className="col-span-12 md:col-span-8 bg-surface-container-high rounded-lg p-6 border border-outline-variant/10 relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-2 block">System Pulse</span>
                        <h3 className="text-4xl font-bold font-headline tracking-tighter mb-4 text-on-surface">Active Alerts: {activeAlerts.length.toString().padStart(2, '0')}</h3>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Critical (Weapon)</p>
                                <p className="text-lg font-bold text-error">{criticalCount}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">High (Violence)</p>
                                <p className="text-lg font-bold text-tertiary">{highCount}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Queue Status</p>
                                <p className={`text-lg font-bold ${activeAlerts.length > 5 ? 'text-error' : 'text-success'}`}>
                                    {activeAlerts.length > 5 ? 'High Load' : 'Stable'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 md:col-span-4 bg-gradient-to-br from-primary to-primary-dim rounded-lg p-6 flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary/70 mb-2 block">Tactical Status</span>
                        <p className="text-xl font-bold text-on-primary-fixed leading-tight font-headline">AI Inference Engine Active. Monitoring all sectors.</p>
                    </div>
                    <div className="flex items-center gap-2 text-on-primary-fixed font-bold text-sm">
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                        <span>Multi-vector analysis active</span>
                    </div>
                </div>
            </div>

            {/* Alerts Queue Section */}
            <div className="flex items-center justify-between mb-6">
                <h4 className="font-headline text-lg font-bold tracking-tight">Active Incident Queue</h4>
            </div>

            {/* High-Density Alert Cards */}
            <div className="space-y-4">
                {activeAlerts.length === 0 ? (
                    <div className="bg-surface-container-high p-20 rounded-lg border border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center opacity-50">
                        <span className="material-symbols-outlined text-6xl mb-4">shield_moon</span>
                        <h5 className="text-xl font-bold font-headline mb-2">No Incidents Reported</h5>
                        <p className="text-sm max-w-sm">The Edge AI agent is scanning all camera vectors. No weapon or violent activity detected in the current cycle.</p>
                    </div>
                ) : (
                    activeAlerts.map((alert) => (
                        <div key={alert.id} className={`group bg-surface-container-high hover:bg-surface-container-highest transition-all duration-300 border-l-4 overflow-hidden ${
                            alert.type === 'weapon' ? 'border-error' : 'border-tertiary'
                        }`}>
                            <div className="p-5 flex flex-col lg:flex-row gap-6">
                                {/* AI Snapshot Placeholder */}
                                <div className="relative w-full lg:w-48 h-32 flex-shrink-0 bg-surface-container-lowest overflow-hidden rounded-sm group-hover:scale-[1.02] transition-transform">
                                    <div className="w-full h-full flex items-center justify-center bg-slate-900/40">
                                        <span className="material-symbols-outlined text-4xl text-white/20">videocam</span>
                                    </div>
                                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 text-[8px] font-bold uppercase tracking-tighter text-white">Live Snap</div>
                                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md text-[9px] text-white">
                                        {new Date(alert.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                                {/* Details */}
                                <div className="flex-grow">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                                                    alert.type === 'weapon' ? 'bg-error text-white' : 'bg-tertiary text-black'
                                                }`}>{alert.type === 'weapon' ? 'CRITICAL' : 'HIGH'}</span>
                                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">ID: {alert.id}</span>
                                            </div>
                                            <h5 className="text-lg font-bold font-headline text-on-surface">{alert.type.toUpperCase()} Detected at {alert.location}</h5>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-on-surface-variant uppercase block mb-1">Confidence Score</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1 bg-surface-container-lowest overflow-hidden rounded-full">
                                                    <div className={`h-full ${alert.type === 'weapon' ? 'bg-error' : 'bg-tertiary'}`} style={{ width: `${alert.confidence * 100}%` }}></div>
                                                </div>
                                                <span className={`text-sm font-bold ${alert.type === 'weapon' ? 'text-error' : 'text-tertiary'}`}>
                                                    {(alert.confidence * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-on-surface-variant max-w-2xl mb-4 line-clamp-1">
                                        Surveillance confirmation from {alert.camera_id} at {alert.location}. AI inference matched pattern for {alert.type}.
                                    </p>
                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <button className="px-5 py-2 bg-primary text-on-primary-fixed text-xs font-bold uppercase tracking-widest rounded-sm hover:brightness-110 active:scale-95 transition-all">
                                            Acknowledge
                                        </button>
                                        <button className="px-5 py-2 border border-outline-variant/50 text-on-surface text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white/5 active:scale-95 transition-all">
                                            Logs
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default IncidentsPage;
