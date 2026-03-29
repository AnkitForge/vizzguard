import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Threat {
    id: string;
    type: string;
    camera_id: string;
    location: string;
    confidence: number;
    timestamp: string;
    thumbnail?: string;
}

export const useRealTimeAlerts = (onAlert: (threat: Threat) => void) => {
    const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
    const { token } = useAuth();

    useEffect(() => {
        let socket: WebSocket | null = null;
        let reconnectTimeout: ReturnType<typeof setTimeout>;

        // Fetch initial history
        const fetchHistory = async () => {
            if (!token) return;
            try {
                const response = await fetch('http://localhost:8000/api/v1/alerts/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.alerts) {
                    data.alerts.forEach((alert: Threat) => onAlert(alert));
                }
            } catch (err) {
                console.error('[!] Failed to fetch alert history:', err);
            }
        };

        const connect = () => {
            console.log('[*] Connecting to Sentinel AI Relay...');
            socket = new WebSocket('ws://localhost:8000/ws/alerts');

            socket.onopen = () => {
                console.log('[+] Connected to Sentinel AI Relay');
                setStatus('connected');
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'heartbeat') return;
                    
                    console.log('[!] Real-time Threat Alert Received:', data);
                    onAlert(data as Threat);
                } catch (err) {
                    console.error('[!] Failed to parse alert data:', err);
                }
            };

            socket.onclose = () => {
                console.warn('[!] Disconnected from Sentinel AI Relay. Retrying in 3s...');
                setStatus('connecting');
                reconnectTimeout = setTimeout(connect, 3000);
            };

            socket.onerror = (err) => {
                console.error('[!] WebSocket Error:', err);
                setStatus('error');
            };
        };

        fetchHistory();
        connect();

        return () => {
            if (socket) socket.close();
            clearTimeout(reconnectTimeout);
        };
    }, [onAlert, token]);

    return { status };
};
