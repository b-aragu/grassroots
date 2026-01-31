'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AgentListSidebar } from '@/components/dashboard/map/AgentListSidebar';
import { MOCK_AGENTS, Agent } from '@/data/mock-agents';
import { Button } from '@/components/ui/button';
import { Layers, Maximize2, RefreshCw } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAgents } from '@/hooks/useAgents';

// Dynamically import the Map component to avoid SSR issues
const TacticalMap = dynamic(() => import('@/components/dashboard/map/TacticalMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-900 flex items-center justify-center text-slate-500 animate-pulse">Initializing Tactical Grid...</div>
});

export default function MapPage() {
    const { agents, loading, error } = useAgents();
    const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(undefined);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [showBoundaries, setShowBoundaries] = useState(true);

    // If hook is loading (initial fetch), agents will be MOCK_AGENTS from hook initial state anyway
    // But once real data comes, it updates.

    const handleSelectAgent = (agent: any) => {
        setSelectedAgentId(agent.id === selectedAgentId ? undefined : agent.id);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden">
            {/* Tactical Header */}
            <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
                    <span className="text-emerald-600 font-bold">LIVE OPS</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-700 font-semibold">NAIROBI COUNTY</span>
                    <span className="text-slate-300">/</span>
                    <span>ALL UNITS</span>
                    {error && <span className="text-amber-500 ml-2 text-[10px]">(OFFLINE MODE)</span>}
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
                                <Layers className="h-3 w-3 mr-2 text-slate-500" /> Layers
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-white border-slate-200 text-slate-700 shadow-md">
                            <DropdownMenuCheckboxItem
                                checked={showBoundaries}
                                onCheckedChange={setShowBoundaries}
                                className="focus:bg-slate-100"
                            >
                                IEBC Constituencies
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={showHeatmap}
                                onCheckedChange={setShowHeatmap}
                                className="focus:bg-slate-100"
                            >
                                Coverage Heatmap
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                        <RefreshCw className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                        <Maximize2 className="h-3 w-3" />
                    </Button>
                </div>
            </header>

            {/* Split Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Drawer / Sidebar */}
                <div className="w-full lg:w-[400px] shrink-0 h-full z-10 lg:relative absolute pointer-events-none lg:pointer-events-auto flex flex-col justify-end lg:justify-start">
                    {/* On Desktop, acts as Sidebar. On Mobile, we need a wrapper or it takes full width at bottom.
                        For now, simple responsive hiding logic is built into CSS or we stick to desktop-first split.
                        The existing AgentListSidebar is designed to be full-height, so we'll wrap it.
                    */}
                    <div className="h-[60%] lg:h-full w-full bg-white pointer-events-auto shadow-xl lg:shadow-none border-t lg:border-t-0 border-slate-200 lg:border-r">
                        <AgentListSidebar
                            agents={agents}
                            onSelectAgent={handleSelectAgent}
                            selectedAgentId={selectedAgentId}
                        />
                    </div>
                </div>

                {/* Main Map Area */}
                <div className="flex-1 relative bg-slate-100">
                    <TacticalMap
                        agents={agents}
                        selectedAgentId={selectedAgentId}
                        onSelectAgent={handleSelectAgent}
                        showHeatmap={showHeatmap}
                        showBoundaries={showBoundaries}
                    />
                </div>
            </div>
        </div>
    );
}
