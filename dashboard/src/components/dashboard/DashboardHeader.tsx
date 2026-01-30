'use client';

import { Bell, Search, Menu, CloudRain, Clock, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function DashboardHeader() {
    return (
        <header className="sticky top-0 z-50 w-full bg-slate-900 text-white border-b border-slate-800 shadow-2xl">
            {/* Top Status Strip */}
            <div className="h-8 bg-slate-950 flex items-center justify-between px-4 text-[10px] uppercase tracking-widest font-mono text-slate-400">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2 text-green-500">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        SYSTEM ONLINE
                    </span>
                    <span className="hidden md:inline-flex items-center gap-1">
                        <Radio className="h-3 w-3" /> NETWORK: SECURE (AES-256)
                    </span>
                    <span className="hidden md:inline-flex items-center gap-1 text-blue-400">
                        <CloudRain className="h-3 w-3" /> NAIROBI: 24°C / LIGHT RAIN
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1 text-amber-500">
                        <Clock className="h-3 w-3" /> ELECTION COUNTDOWN: 14D 06H 42M
                    </span>
                    <span>UPTIME: 99.98%</span>
                </div>
            </div>

            {/* Main Toolbar */}
            <div className="h-16 flex items-center justify-between px-6 backdrop-blur-md bg-opacity-90">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-lg shadow-green-900/20">
                            <span className="text-xl font-bold text-white tracking-tighter">GR</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold tracking-tight leading-none text-white">COMMAND CENTER</h1>
                            <p className="text-[10px] text-slate-400 font-mono tracking-widest">INTELLIGENCE PLATFORM V2.4</p>
                        </div>
                    </div>

                    {/* Live Ticker */}
                    <div className="hidden lg:flex items-center h-8 bg-slate-800/50 rounded border border-slate-700/50 px-3 overflow-hidden w-[400px] relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>
                        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee text-xs text-slate-300 font-mono">
                            <span className="text-green-400">★ NEW CHECK-IN: Agent Kennedy (Roysambu)</span>
                            <span className="text-blue-400">ℹ DEPLOYMENT: 40 Agents to Westlands</span>
                            <span className="text-amber-400">⚠ ALERT: Low coverage in Embakasi North</span>
                            <span className="text-green-400">★ NEW CHECK-IN: Agent Mary (Kibra)</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="hidden md:flex items-center relative">
                        <Search className="absolute left-3 h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search agents, wards, data..."
                            className="h-9 w-64 bg-slate-800 border-slate-700 rounded-full pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                        />
                    </div>

                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse border border-slate-900"></span>
                    </Button>

                    <div className="h-8 w-[1px] bg-slate-800 mx-2"></div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white leading-none">Campaign Mgr.</p>
                            <p className="text-[10px] text-green-500 font-mono">LEVEL 1 ACCESS</p>
                        </div>
                        <Avatar className="h-9 w-9 border-2 border-slate-700">
                            <AvatarImage src="/avatars/01.png" alt="@user" />
                            <AvatarFallback className="bg-slate-800 text-slate-200 font-bold">CM</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </header>
    );
}
