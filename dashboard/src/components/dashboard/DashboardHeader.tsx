'use client';

import { Bell, Search, Menu, CloudRain, Clock, Radio, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function DashboardHeader() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-slate-200 text-slate-800 shadow-sm">
            {/* Top Status Strip */}
            <div className="h-8 bg-slate-100/50 flex items-center justify-between px-4 text-[10px] uppercase tracking-widest font-mono text-slate-500 border-b border-slate-200">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2 text-emerald-600 font-bold">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                        </span>
                        SYSTEM ONLINE
                    </span>
                    <span className="hidden md:inline-flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-slate-400" /> NETWORK: SECURE (AES-256)
                    </span>
                    <span className="hidden md:inline-flex items-center gap-1 text-slate-500">
                        <CloudRain className="h-3 w-3" /> NAIROBI: 24°C / LIGHT RAIN
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <Clock className="h-3 w-3" /> ELECTION COUNTDOWN: 14D 06H 42M
                    </span>
                    <span>UPTIME: 99.98%</span>
                </div>
            </div>

            {/* Main Toolbar */}
            <div className="h-16 flex items-center justify-between px-6">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-xl font-bold text-white tracking-tighter">GR</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight leading-none text-slate-900">ELECTION <span className="font-light text-slate-500">OPERATIONS CENTRE</span></h1>
                            <p className="text-[10px] text-slate-400 font-mono tracking-widest">NATIONAL TALLYING INTEGRATION v2.4</p>
                        </div>
                    </div>

                    {/* Live Ticker */}
                    <div className="hidden lg:flex items-center h-8 bg-slate-50 rounded border border-slate-200 px-3 overflow-hidden w-[450px] relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>
                        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee text-xs text-slate-600 font-mono">
                            <span className="text-emerald-600 flex items-center gap-1"><strong>✓ CHECK-IN:</strong> Agent Kennedy (Roysambu)</span>
                            <span className="text-blue-600 flex items-center gap-1"><strong>ℹ DEPLOYMENT:</strong> 40 Agents to Westlands</span>
                            <span className="text-amber-600 flex items-center gap-1"><strong>⚠ ALERT:</strong> Low coverage in Embakasi North</span>
                            <span className="text-emerald-600 flex items-center gap-1"><strong>✓ CHECK-IN:</strong> Agent Mary (Kibra)</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="hidden md:flex items-center relative">
                        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search agents, wards, data..."
                            className="h-9 w-64 bg-slate-50 border-slate-200 border rounded-full pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all hover:bg-slate-100"
                        />
                    </div>

                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full animate-pulse border-2 border-white"></span>
                    </Button>

                    <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 leading-none">Operations Dir.</p>
                            <p className="text-[10px] text-emerald-600 font-mono font-bold">LEVEL 1 ACCESS</p>
                        </div>
                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-slate-200 transition-all">
                            <AvatarImage src="/avatars/01.png" alt="@user" />
                            <AvatarFallback className="bg-slate-900 text-white font-bold">OD</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </header>
    );
}
