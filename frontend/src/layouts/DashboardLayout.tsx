import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import NotificationPanel from '../components/NotificationPanel';
import { useRealTimeAlerts } from '../hooks/useRealTimeAlerts';
import type { Threat } from '../hooks/useRealTimeAlerts';

const DashboardLayout = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<Threat[]>([]);

  // Stable alert callback
  const handleNewAlert = useCallback((newThreat: Threat) => {
      setActiveAlerts(prev => {
          // Avoid duplicates if history/ws overlap
          if (prev.find(a => a.id === newThreat.id)) return prev;
          return [newThreat, ...prev];
      });
  }, []);

  // Real-time listener for Edge AI Alerts
  const { status } = useRealTimeAlerts(handleNewAlert);

  const handleClearAlerts = useCallback(() => {
    setActiveAlerts([]);
  }, []);

  const handleGlobalReset = useCallback(() => {
    setActiveAlerts([]);
    // Optionally navigate to dashboard/reset other states
    window.location.href = '/'; 
  }, []);

  return (
    <div className="flex bg-slate-100 dark:bg-background text-on-background min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 flex flex-col relative h-screen overflow-hidden">
        <Header 
            onOpenNotifications={() => setIsNotificationOpen(true)} 
            onReset={handleGlobalReset}
            connectionStatus={status}
            alertCount={activeAlerts.length}
        />
        {/* Pass state via context to all pages */}
        <Outlet context={{ activeAlerts, status }} />
      </main>
      
      {/* Global Slide-in Notification Panel */}
      <NotificationPanel 
          isOpen={isNotificationOpen} 
          onClose={() => setIsNotificationOpen(false)} 
          onClearAll={handleClearAlerts}
          alerts={activeAlerts}
      />
    </div>
  );
};

export default DashboardLayout;
