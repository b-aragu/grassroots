'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download, MoreHorizontal } from 'lucide-react';
import {
    ComposedChart,
    Bar,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

const data = [
    { name: 'Mon', checkins: 45, target: 50, cumulative: 45 },
    { name: 'Tue', checkins: 52, target: 50, cumulative: 97 },
    { name: 'Wed', checkins: 38, target: 50, cumulative: 135 },
    { name: 'Thu', checkins: 65, target: 50, cumulative: 200 },
    { name: 'Fri', checkins: 48, target: 50, cumulative: 248 },
    { name: 'Sat', checkins: 55, target: 50, cumulative: 303 },
    { name: 'Sun', checkins: 10, target: 50, cumulative: 313 }, // Today (partial)
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                <p className="text-slate-300 text-xs font-mono mb-1">{label}</p>
                <div className="space-y-1">
                    <p className="text-sm font-bold text-white flex items-center justify-between gap-4">
                        <span>Check-ins:</span>
                        <span className="text-green-400">{payload[0].value}</span>
                    </p>
                    <p className="text-xs text-slate-400 flex items-center justify-between gap-4">
                        <span>Target:</span>
                        <span>{payload[2].value}</span>
                    </p>
                    <div className="h-px bg-slate-700 my-1"></div>
                    <p className="text-xs text-blue-400 flex items-center justify-between gap-4 font-mono">
                        <span>Total:</span>
                        <span>{payload[1].value}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export function MainCommandChart() {
    return (
        <Card className="h-full shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100">
                <div>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">Deployment Velocity</CardTitle>
                    <p className="text-[10px] text-slate-500">WEEKLY PERFORMANCE VS TARGETS</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                        <Calendar className="h-3 w-3" /> Last 7 Days
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 pl-0">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                dy={10}
                            />
                            <YAxis
                                yAxisId="left"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 11, fill: '#64748b' }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />

                            {/* Cumulative Area */}
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="cumulative"
                                name="Cumulative Total"
                                fill="url(#colorCumulative)"
                                stroke="#3b82f6"
                                strokeWidth={2}
                            />

                            {/* Daily Bars */}
                            <Bar
                                yAxisId="left"
                                dataKey="checkins"
                                name="Daily Check-ins"
                                barSize={20}
                                fill="#22c55e"
                                radius={[4, 4, 0, 0]}
                            />

                            {/* Target Line */}
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="target"
                                name="Daily Target"
                                stroke="#f59e0b"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                dot={false}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
