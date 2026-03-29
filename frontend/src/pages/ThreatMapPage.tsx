import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import MapDashboard from '../components/MapDashboard';
import ActiveIncidents from '../components/ActiveIncidents';
import AnalyticsPanel from '../components/AnalyticsPanel';
import type { Threat } from '../hooks/useRealTimeAlerts';

const ThreatMapPage = () => {
    const [showAnalytics, setShowAnalytics] = useState(false);
    const { activeAlerts } = useOutletContext<{ activeAlerts: Threat[] }>();

    return (
        <div className="flex-1 flex overflow-hidden relative h-full">
            <MapDashboard />
            <ActiveIncidents alerts={activeAlerts} />

            {/* Analytics Toggle FAB */}
            <button 
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all shadow-2xl active:scale-95 ${
                    showAnalytics 
                        ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(59,191,250,0.4)]' 
                        : 'bg-surface-container-high/90 text-on-surface border border-outline-variant/20 backdrop-blur-md hover:bg-surface-container-highest'
                }`}
            >
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                {showAnalytics ? 'Hide Analytics' : 'Threat Analytics'}
            </button>

            {/* Analytics Overlay */}
            <AnalyticsPanel 
                isOpen={showAnalytics} 
                onClose={() => setShowAnalytics(false)} 
                alerts={activeAlerts}
            />
        </div>
    );
};

export default ThreatMapPage;
