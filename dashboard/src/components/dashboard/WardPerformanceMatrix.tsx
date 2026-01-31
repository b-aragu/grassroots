'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Maximize2, Map, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Ward {
    id: string;
    name: string;
    constituency: string;
    coverage: number; // 0-100
    status: 'critical' | 'warning' | 'good' | 'neutral';
    agents: number;
}

import { Agent } from '@/hooks/useAgents';

// Keep static structure for Nairobi context
const CONSTITUENCIES = ['Roysambu', 'Kasarani', 'Westlands', 'Langata', 'Dagoretti North'];
const WARD_NAMES = {
    'Roysambu': ['Githurai', 'Kahawa West', 'Zimmerman', 'Roysambu', 'Kahawa'],
    'Kasarani': ['Clay City', 'Mwiki', 'Kasarani', 'Njiru', 'Ruai'],
    'Westlands': ['Kitisuru', 'Parklands', 'Karura', 'Kangemi', 'Mountain View'],
    'Langata': ['Karen', 'Nairobi West', 'Mugumoini', 'South C', 'Nyayo Highrise'],
    'Dagoretti North': ['Kilimani', 'Kawangware', 'Gatina', 'Kileleshwa', 'Kabiro']
};

export function WardPerformanceMatrix({ agents = [] }: { agents?: Agent[] }) {

    // Process real agents into ward stats
    const wardStats: Record<string, Ward> = {};

    // Initialize all known wards with 0
    CONSTITUENCIES.forEach(constituency => {
        const wards = WARD_NAMES[constituency as keyof typeof WARD_NAMES] || [];
        wards.forEach((wardName, i) => {
            wardStats[wardName] = {
                id: `W-${constituency.substring(0, 3)}-${i}`,
                name: wardName,
                constituency,
                coverage: 0,
                status: 'neutral',
                agents: 0
            };
        });
    });

    // Populate with real data
    agents.forEach(agent => {
        if (agent.ward && wardStats[agent.ward]) {
            wardStats[agent.ward].agents += 1;
        }
    });

    // Calculate coverage/status based on agent count (heuristic for now)
    // e.g. 1 agent = 20% coverage, 3+ = 100%
    Object.values(wardStats).forEach(ward => {
        const coverage = Math.min(ward.agents * 33, 100);
        ward.coverage = coverage;
        if (coverage === 0) ward.status = 'critical';
        else if (coverage < 60) ward.status = 'warning';
        else ward.status = 'good';
    });

    const allWards = Object.values(wardStats);

    const getStatusColor = (status: Ward['status']) => {
        switch (status) {
            case 'good': return 'bg-emerald-500/90 border-emerald-600/50 hover:bg-emerald-400';
            case 'warning': return 'bg-amber-400/90 border-amber-500/50 hover:bg-amber-300';
            case 'critical': return 'bg-rose-500/90 border-rose-600/50 hover:bg-rose-400';
            default: return 'bg-slate-100 border-slate-200 hover:bg-slate-200'; // Lighter neutral
        }
    };

    // Group wards by constituency for the matrix
    const groupedWards = allWards.reduce((acc, ward) => {
        if (!acc[ward.constituency]) acc[ward.constituency] = [];
        acc[ward.constituency].push(ward);
        return acc;
    }, {} as Record<string, Ward[]>);

    return (
        <Card className="h-full shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-slate-100 bg-slate-50/50">
                <div className="space-y-0.5">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                        <Map className="h-4 w-4 text-slate-500" />
                        Ward Coverage Matrix
                    </CardTitle>
                    <p className="text-[10px] text-slate-500 font-mono">NAIROBI COUNTY • {allWards.length} WARDS TRACKED</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 mr-4 text-[10px] font-mono text-slate-500">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-sm"></div> &gt;75%</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-sm"></div> 40-75%</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-500 rounded-sm"></div> &lt;40%</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4 overflow-y-auto max-h-[400px]">
                {Object.entries(groupedWards).map(([constituency, wards]) => (
                    <div key={constituency} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide border-l-2 border-slate-300 pl-2">
                                {constituency}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono">{wards.length} Wards</span>
                        </div>
                        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                            <TooltipProvider>
                                {wards.map((ward) => (
                                    <Tooltip key={ward.id}>
                                        <TooltipTrigger asChild>
                                            <div
                                                className={`
                                                    aspect-[4/3] rounded border shadow-sm cursor-pointer transition-all duration-200 
                                                    ${getStatusColor(ward.status)}
                                                    hover:scale-105 hover:shadow-md hover:z-10 group relative overflow-hidden
                                                `}
                                            >
                                                {/* Mini heatmap indicator inside the box */}
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
                                                    <div className="h-full bg-white/30" style={{ width: `${ward.coverage}%` }}></div>
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="bg-slate-900/95 backdrop-blur border-slate-700 text-white p-3 shadow-xl z-50">
                                            <div className="space-y-1">
                                                <p className="font-bold text-sm text-white flex items-center justify-between gap-4">
                                                    {ward.name}
                                                    {ward.status === 'good' && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                                                    {ward.status === 'critical' && <AlertCircle className="h-3 w-3 text-rose-400" />}
                                                </p>
                                                <div className="h-px bg-white/10 my-2"></div>
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                                    <span className="text-slate-400">Coverage:</span>
                                                    <span className={`font-mono ${ward.coverage > 75 ? 'text-emerald-400' : ward.coverage < 40 ? 'text-rose-400' : 'text-amber-400'}`}>
                                                        {ward.coverage}%
                                                    </span>
                                                    <span className="text-slate-400">Agents:</span>
                                                    <span className="font-mono text-white">{ward.agents}</span>
                                                    <span className="text-slate-400">Status:</span>
                                                    <span className="uppercase text-[10px]">{ward.status}</span>
                                                </div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </TooltipProvider>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
