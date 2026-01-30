'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Maximize2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Ward {
    id: string;
    name: string;
    coverage: number; // 0-100
    status: 'critical' | 'warning' | 'good' | 'neutral';
}

const MOCK_WARDS: Ward[] = Array.from({ length: 85 }, (_, i) => {
    // Use a deterministic "random" based on index to ensure server/client match
    const pseudoRandom = Math.abs(Math.sin(i * 12.34) * 10000) % 100;
    const coverage = Math.floor(pseudoRandom);

    let status: Ward['status'] = 'neutral';
    if (coverage < 30) status = 'critical';
    else if (coverage < 70) status = 'warning';
    else status = 'good';

    return {
        id: `W-${i}`,
        name: `Ward ${i + 1}`,
        coverage,
        status
    };
});

export function WardPerformanceMatrix() {
    const getStatusColor = (status: Ward['status']) => {
        switch (status) {
            case 'good': return 'bg-emerald-500 hover:bg-emerald-400';
            case 'warning': return 'bg-amber-400 hover:bg-amber-300';
            case 'critical': return 'bg-rose-500 hover:bg-rose-400';
            default: return 'bg-slate-200 hover:bg-slate-300';
        }
    };

    return (
        <Card className="h-full shadow-sm hover:shadow-md transition-shadow border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-slate-100">
                <div className="space-y-0.5">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">Ward Coverage Matrix</CardTitle>
                    <p className="text-[10px] text-slate-500">REAL-TIME COVERAGE INTENSITY • 85 WARDS</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-6 w-6">
                        <Filter className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-6 w-6">
                        <Maximize2 className="h-3 w-3" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <TooltipProvider>
                    <div className="grid grid-cols-10 gap-1.5 auto-rows-fr">
                        {MOCK_WARDS.map((ward) => (
                            <Tooltip key={ward.id}>
                                <TooltipTrigger asChild>
                                    <div
                                        className={`
                                            aspect-square rounded-sm cursor-pointer transition-all duration-200 
                                            ${getStatusColor(ward.status)}
                                            hover:scale-110 hover:shadow-lg hover:z-10
                                        `}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 border-slate-800 text-white p-2">
                                    <p className="font-bold text-xs">{ward.name}</p>
                                    <p className="text-[10px] text-slate-400">Coverage: <span className={ward.coverage > 50 ? 'text-green-400' : 'text-red-400'}>{ward.coverage}%</span></p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>

                <div className="flex items-center justify-between mt-4 text-[10px] text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> HIGH</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-full"></div> MED</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> CRITICAL</span>
                    </div>
                    <span>85/85 ACTIVE</span>
                </div>
            </CardContent>
        </Card>
    );
}
