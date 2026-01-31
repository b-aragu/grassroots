'use client';

import { useState } from 'react';
import { Search, Filter, Radio, AlertTriangle, Shield, Battery, Signal, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Agent } from '@/data/mock-agents';

interface AgentListSidebarProps {
    agents: Agent[];
    onSelectAgent: (agent: Agent) => void;
    selectedAgentId?: string;
}

export function AgentListSidebar({ agents, onSelectAgent, selectedAgentId }: AgentListSidebarProps) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'alerts'>('all');

    const filteredAgents = agents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) ||
            agent.pollingStation.toLowerCase().includes(search.toLowerCase()) ||
            agent.constituency.toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === 'active') return agent.status === 'active';
        if (filter === 'alerts') return agent.status === 'sos' || agent.status === 'offline';
        return true;
    });

    const getStatusColor = (status: Agent['status']) => {
        switch (status) {
            case 'active': return 'bg-emerald-500';
            case 'idle': return 'bg-amber-500';
            case 'offline': return 'bg-slate-500';
            case 'sos': return 'bg-rose-600 animate-pulse';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-200 w-full lg:max-w-md">
            {/* Header / Search */}
            <div className="p-4 space-y-4 border-b border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                    <h2 className="text-slate-800 font-bold tracking-tight flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-600" />
                        FIELD UNITS
                    </h2>
                    <Badge variant="outline" className="text-slate-500 border-slate-200 font-mono">
                        {filteredAgents.length}/{agents.length}
                    </Badge>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search unit, ward, or station..."
                        className="pl-9 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-600"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <Button
                        variant={filter === 'all' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                        className={`text-xs ${filter === 'all' ? 'bg-slate-100 text-slate-900 border-slate-200' : 'bg-transparent border-slate-200 text-slate-500 hover:text-slate-900'}`}
                    >
                        All Units
                    </Button>
                    <Button
                        variant={filter === 'active' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('active')}
                        className={`text-xs ${filter === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-transparent border-slate-200 text-slate-500 hover:text-slate-900'}`}
                    >
                        <Zap className="h-3 w-3 mr-1" /> Active
                    </Button>
                    <Button
                        variant={filter === 'alerts' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('alerts')}
                        className={`text-xs ${filter === 'alerts' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-transparent border-slate-200 text-slate-500 hover:text-slate-900'}`}
                    >
                        <AlertTriangle className="h-3 w-3 mr-1" /> Alerts
                    </Button>
                </div>
            </div>

            {/* Agent List */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50">
                <div className="flex flex-col">
                    {filteredAgents.map((agent) => (
                        <div
                            key={agent.id}
                            onClick={() => onSelectAgent(agent)}
                            className={`
                                p-4 border-b border-slate-100 cursor-pointer transition-colors
                                ${selectedAgentId === agent.id ? 'bg-white border-l-4 border-l-emerald-500 shadow-sm' : 'hover:bg-white border-l-4 border-l-transparent'}
                            `}
                        >
                            <div className="flex items-start gap-3">
                                <div className="relative">
                                    <Avatar className="h-10 w-10 border border-slate-200">
                                        <AvatarFallback className="bg-slate-100 text-slate-500 text-xs font-bold">
                                            {agent.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(agent.status)}`}></span>
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-slate-800 truncate">{agent.name}</h3>
                                        <span className="text-[10px] text-slate-400 font-mono">12:42</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                                        <Radio className="h-3 w-3 text-emerald-600" />
                                        {agent.pollingStation}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                            <Battery className={`h-3 w-3 ${agent.battery < 20 ? 'text-rose-500' : 'text-slate-400'}`} />
                                            {agent.battery}%
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                            <Signal className="h-3 w-3 text-slate-400" />
                                            {agent.signalStrength}
                                        </div>
                                        <Badge variant="outline" className="text-[9px] h-4 border-slate-200 text-slate-500 px-1 py-0 ml-auto uppercase tracking-wider bg-white">
                                            {agent.constituency}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredAgents.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            <p>No units found matching criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
