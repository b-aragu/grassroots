import { useState, useEffect } from 'react';
import { Agent, MOCK_AGENTS } from '../data/mock-agents';

// Define expected backend types based on controller/dto analysis
interface BackendVolunteer {
    id: string; // The UUID from backend
    name: string;
    phone: string;
    role: string;
    ward: string;
    // ... other fields
}

interface BackendCheckin {
    id: number;
    userId: string; // Correct field name from Prisma
    volunteerId?: string; // KEEP compatible if mapped differently elsewhere
    lat: number;
    lng: number;
    batteryLevel?: number;
    signalStrength?: string;
    createdAt: string;
    // ...
}

export const useAgents = () => {
    const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
    const [checkins, setCheckins] = useState<BackendCheckin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const calculateStatus = (lastCheckIn: string): Agent['status'] => {
            const checkInTime = new Date(lastCheckIn).getTime();
            const now = Date.now();
            const diffMinutes = (now - checkInTime) / (1000 * 60);

            if (diffMinutes < 15) return 'active'; // < 15 mins
            if (diffMinutes < 60) return 'idle';   // < 1 hour
            return 'offline';                      // > 1 hour
        };

        const fetchData = async () => {
            try {
                let token = localStorage.getItem('token');

                // Fallback to cookie if no token in localStorage
                if (!token && typeof document !== 'undefined') {
                    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
                    if (match) token = match[2];
                }

                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

                // Fetch volunteers and checkins in parallel
                const [volunteersRes, checkinsRes] = await Promise.all([
                    fetch('http://localhost:3333/volunteers', { headers }).catch(err => { console.warn('Failed to fetch volunteers', err); return null; }),
                    fetch('http://localhost:3333/checkins', { headers }).catch(err => { console.warn('Failed to fetch checkins', err); return null; })
                ]);

                if (!volunteersRes || !checkinsRes) {
                    throw new Error('Failed to connect to backend');
                }

                if (!volunteersRes.ok || !checkinsRes.ok) {
                    throw new Error('Backend returned error');
                }

                const volunteers: BackendVolunteer[] = await volunteersRes.json();
                const checkins: BackendCheckin[] = await checkinsRes.json();

                if (!volunteers || volunteers.length === 0) {
                    console.log('No volunteers found, using mock data');
                    setLoading(false);
                    return; // Keep initial mock data
                }

                // Group checkins by volunteerId to find the latest one for each
                const latestCheckinsMap = new Map<string, BackendCheckin>();
                checkins.forEach((c) => {
                    // Backend returns 'userId', not 'volunteerId'
                    const vId = c.userId || c.volunteerId;
                    const existing = latestCheckinsMap.get(vId);
                    if (!existing || new Date(c.createdAt) > new Date(existing.createdAt)) {
                        latestCheckinsMap.set(vId, c);
                    }
                });

                // Map backend volunteers to Agent interface
                const realAgents: Agent[] = volunteers.map((v) => {
                    const lastCheckin = latestCheckinsMap.get(v.id);

                    // Default location if no checkin (Nairobi Center fallback)
                    const coords: [number, number] = lastCheckin
                        ? [lastCheckin.lat, lastCheckin.lng]
                        : [-1.2921, 36.8219];

                    return {
                        id: v.id,
                        name: v.name || 'Unknown Agent',
                        role: (v.role as Agent['role']) || 'Polling Agent',
                        constituency: 'Unknown', // Backend 'ward' might need mapping to constituency
                        ward: v.ward || 'Pending',
                        pollingStation: 'Pending Assignment',
                        status: lastCheckin ? calculateStatus(lastCheckin.createdAt) : 'offline',
                        coordinates: coords,
                        battery: lastCheckin?.batteryLevel || 100,
                        signalStrength: (lastCheckin?.signalStrength as Agent['signalStrength']) || 'Unknown',
                        lastCheckIn: lastCheckin?.createdAt || new Date().toISOString()
                    };
                });

                console.log(`Loaded ${realAgents.length} agents from backend`);
                setAgents(realAgents);
                setCheckins(checkins); // Store full history
                setError(null);
            } catch (err) {
                console.error('Error loading agents:', err);
                setError('Failed to load live data, using offline cache.');
                // Keep the MOCK_AGENTS which was set as initial state
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Poll every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return { agents, checkins, loading, error };
};
