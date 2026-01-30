'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { IntelligentMetricCard } from '@/components/dashboard/IntelligentMetricCard';
import { MainCommandChart } from '@/components/dashboard/MainCommandChart';
import { WardPerformanceMatrix } from '@/components/dashboard/WardPerformanceMatrix';
import { LiveActivityStream } from '@/components/dashboard/LiveActivityStream';
import { AgentLeaderboard } from '@/components/dashboard/AgentLeaderboard';
import { Activity, Users, MapPin, MessageSquare, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock sparkle data for metrics
const SPARKLINE_DATA_1 = [{ value: 40 }, { value: 55 }, { value: 45 }, { value: 60 }, { value: 50 }, { value: 75 }, { value: 65 }];
const SPARKLINE_DATA_2 = [{ value: 20 }, { value: 25 }, { value: 35 }, { value: 30 }, { value: 45 }, { value: 50 }, { value: 60 }];
const SPARKLINE_DATA_3 = [{ value: 80 }, { value: 75 }, { value: 70 }, { value: 72 }, { value: 65 }, { value: 60 }, { value: 55 }];
const SPARKLINE_DATA_4 = [{ value: 5 }, { value: 2 }, { value: 8 }, { value: 4 }, { value: 0 }, { value: 1 }, { value: 3 }];

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-50/50">
            <DashboardHeader />

            <main className="container mx-auto px-4 py-6 space-y-6 max-w-[1600px]">

                {/* 1. Intelligent Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <IntelligentMetricCard
                        title="Total Check-ins"
                        value="2,842"
                        trend="12.5% vs last week"
                        trendDirection="up"
                        icon={Activity}
                        sparklineData={SPARKLINE_DATA_1}
                        color="blue"
                        targetProgress={78}
                        footerText="422 today"
                    />
                    <IntelligentMetricCard
                        title="Active Agents"
                        value="186"
                        trend="8 agents deployed"
                        trendDirection="up"
                        icon={Users}
                        sparklineData={SPARKLINE_DATA_2}
                        color="green"
                        targetProgress={92}
                        footerText="98% retention"
                    />
                    <IntelligentMetricCard
                        title="Ward Coverage"
                        value="14/85"
                        trend="Pace slowing"
                        trendDirection="down"
                        icon={MapPin}
                        sparklineData={SPARKLINE_DATA_3}
                        color="amber"
                        targetProgress={16}
                        footerText="Needs attention"
                    />
                    <IntelligentMetricCard
                        title="Incident Reports"
                        value="3"
                        trend="Low risk"
                        trendDirection="neutral"
                        icon={AlertTriangle}
                        sparklineData={SPARKLINE_DATA_4}
                        color="purple"
                        targetProgress={5}
                        footerText="All resolved"
                    />
                </div>

                {/* 2. Main Command Grid (Chart + Matrix) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                    <div className="lg:col-span-2 h-full">
                        <MainCommandChart />
                    </div>
                    <div className="h-full">
                        <WardPerformanceMatrix />
                    </div>
                </div>

                {/* 3. Lower Intelligence Grid (Stream + Leaderboard) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <LiveActivityStream />
                    </div>
                    <div>
                        <AgentLeaderboard />
                    </div>
                </div>

            </main>
        </div>
    );
}
