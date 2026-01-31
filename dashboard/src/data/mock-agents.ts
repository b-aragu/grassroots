import { Agent } from './types';

// Define Agent interface here if not imported, or import it. 
// For now, I'll redefine it here to ensure it matches, or better, export it from a types file.
// But to match existing structure, I will keep the interface here.

export interface Agent {
    id: string;
    name: string;
    role: 'Polling Agent' | 'Supervisor' | 'Logistics' | 'Security';
    constituency: string;
    ward: string;
    pollingStation: string;
    status: 'active' | 'idle' | 'offline' | 'sos';
    coordinates: [number, number]; // [lat, lng]
    battery: number;
    signalStrength: 'Strong' | 'Good' | 'Weak' | 'No Signal';
    lastCheckIn: string; // ISO string
}

const NAIROBI_CENTER: [number, number] = [-1.2921, 36.8219];

// Static list to prevent hydration mismatch (server vs client random numbers)
export const MOCK_AGENTS: Agent[] = [
    {
        id: 'AGT-1001',
        name: 'Agent Kamau B.',
        role: 'Supervisor',
        constituency: 'Kasarani',
        ward: 'Ward 1',
        pollingStation: 'Station 86 Primary',
        status: 'active',
        coordinates: [-1.2200, 36.8900],
        battery: 45,
        signalStrength: '4G',
        lastCheckIn: new Date().toISOString()
    },
    {
        id: 'AGT-1002',
        name: 'Agent Ochieng F.',
        role: 'Polling Agent',
        constituency: 'Roysambu',
        ward: 'Ward 2',
        pollingStation: 'Station 23 Primary',
        status: 'active',
        coordinates: [-1.2150, 36.8850],
        battery: 96,
        signalStrength: '4G',
        lastCheckIn: new Date().toISOString()
    },
    {
        id: 'AGT-1003',
        name: 'Agent Wanjiku E.',
        role: 'Polling Agent',
        constituency: 'Langata',
        ward: 'Ward 3',
        pollingStation: 'Station 62 Primary',
        status: 'idle',
        coordinates: [-1.3200, 36.7700],
        battery: 54,
        signalStrength: '3G',
        lastCheckIn: new Date().toISOString()
    },
    {
        id: 'AGT-1004',
        name: 'Agent Njoroge R.',
        role: 'Polling Agent',
        constituency: 'Dagoretti North',
        ward: 'Ward 4',
        pollingStation: 'Station 6 Primary',
        status: 'active',
        coordinates: [-1.2800, 36.7500],
        battery: 74,
        signalStrength: '4G',
        lastCheckIn: new Date().toISOString()
    },
    {
        id: 'AGT-1005',
        name: 'Agent Auma M.',
        role: 'Polling Agent',
        constituency: 'Kibra',
        ward: 'Ward 2',
        pollingStation: 'Station 87 Primary',
        status: 'active',
        coordinates: [-1.3150, 36.7850],
        battery: 49,
        signalStrength: '4G',
        lastCheckIn: new Date().toISOString()
    },
    {
        id: 'AGT-1006',
        name: 'Agent Odhiambo C.',
        role: 'Logistics',
        constituency: 'Roysambu',
        ward: 'Ward 1',
        pollingStation: 'Station 93 Primary',
        status: 'active',
        coordinates: [-1.2180, 36.8820],
        battery: 51,
        signalStrength: '4G',
        lastCheckIn: new Date().toISOString()
    },
    {
        id: 'AGT-1007',
        name: 'Agent Wanjiku S.',
        role: 'Polling Agent',
        constituency: 'Westlands',
        ward: 'Ward 5',
        pollingStation: 'Station 55 Primary',
        status: 'active',
        coordinates: [-1.2650, 36.8000],
        battery: 86,
        signalStrength: '4G',
        lastCheckIn: new Date().toISOString()
    },
    {
        id: 'AGT-1008',
        name: 'Agent Odhiambo U.',
        role: 'Polling Agent',
        constituency: 'Embakasi East',
        ward: 'Ward 3',
        pollingStation: 'Station 57 Primary',
        status: 'active',
        coordinates: [-1.2900, 36.9000],
        battery: 64,
        signalStrength: '4G',
        lastCheckIn: new Date().toISOString()
    },
    // Generate a few more deterministically if needed, but this is enough to stop the crash
];
