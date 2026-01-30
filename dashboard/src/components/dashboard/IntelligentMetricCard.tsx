'use client';

import { LucideIcon, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

interface IntelligentMetricCardProps {
    title: string;
    value: string | number;
    trend: string;
    trendDirection: 'up' | 'down' | 'neutral';
    icon: LucideIcon;
    sparklineData: any[]; // { value: number }[]
    color: 'green' | 'blue' | 'purple' | 'amber';
    targetProgress?: number; // 0-100
    footerText?: string;
}

const colorMap = {
    green: {
        text: 'text-green-500',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        chart: '#22c55e',
        gradientFrom: '#22c55e',
        gradientTo: '#22c55e'
    },
    blue: {
        text: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        chart: '#3b82f6',
        gradientFrom: '#3b82f6',
        gradientTo: '#3b82f6'
    },
    purple: {
        text: 'text-purple-500',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        chart: '#a855f7',
        gradientFrom: '#a855f7',
        gradientTo: '#a855f7'
    },
    amber: {
        text: 'text-amber-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        chart: '#f59e0b',
        gradientFrom: '#f59e0b',
        gradientTo: '#f59e0b'
    },
};

export function IntelligentMetricCard({
    title,
    value,
    trend,
    trendDirection,
    icon: Icon,
    sparklineData,
    color,
    targetProgress,
    footerText
}: IntelligentMetricCardProps) {
    const colors = colorMap[color];

    return (
        <Card className="relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border-slate-200 group">
            {/* Gradient Top Border */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${colors.chart} to-transparent opacity-50`}></div>

            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
                        <div className="flex items-center gap-2">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">{value}</h3>
                            {targetProgress && (
                                <div className="relative h-6 w-6 ml-2 group/ring">
                                    <svg className="h-full w-full -rotate-90 text-slate-200" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current" strokeWidth="4"></circle>
                                        <circle cx="18" cy="18" r="16" fill="none" className={`stroke-${color}-500 transition-all duration-1000 ease-out`} strokeWidth="4" strokeDasharray={`${targetProgress}, 100`}></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-[6px] font-bold text-slate-600 opacity-0 group-hover/ring:opacity-100 transition-opacity">
                                        {targetProgress}%
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} shadow-inner`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>

                <div className="flex items-end justify-between h-12">
                    {/* Trend Indicator */}
                    <div className="flex flex-col justify-end pb-1">
                        <div className={`flex items-center text-xs font-bold ${trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-slate-500'}`}>
                            {trendDirection === 'up' && <ArrowUp className="h-3 w-3 mr-1" />}
                            {trendDirection === 'down' && <ArrowDown className="h-3 w-3 mr-1" />}
                            {trendDirection === 'neutral' && <Activity className="h-3 w-3 mr-1" />}
                            {trend}
                        </div>
                        {footerText && <p className="text-[10px] text-slate-400 mt-0.5">{footerText}</p>}
                    </div>

                    {/* Sparkline */}
                    <div className="h-12 w-24 opacity-80 group-hover:opacity-100 transition-opacity">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sparklineData}>
                                <defs>
                                    <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={colors.chart} stopOpacity={0.4} />
                                        <stop offset="100%" stopColor={colors.chart} stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={colors.chart}
                                    strokeWidth={2}
                                    fill={`url(#gradient-${color})`}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
