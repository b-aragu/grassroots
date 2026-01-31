'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { IntelligentMetricCard } from '@/components/dashboard/IntelligentMetricCard';
import { MainCommandChart } from '@/components/dashboard/MainCommandChart';
import { WardPerformanceMatrix } from '@/components/dashboard/WardPerformanceMatrix';
import { LiveActivityStream } from '@/components/dashboard/LiveActivityStream';
import { AgentLeaderboard } from '@/components/dashboard/AgentLeaderboard';
import { Activity, Users, MapPin, MessageSquare, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAgents } from '@/hooks/useAgents'; // Added import

// Mock sparkle data for metrics
const SPARKLINE_DATA_1 = [{ value: 40 }, { value: 55 }, { value: 45 }, { value: 60 }, { value: 50 }, { value: 75 }, { value: 65 }];
const SPARKLINE_DATA_2 = [{ value: 20 }, { value: 25 }, { value: 35 }, { value: 30 }, { value: 45 }, { value: 50 }, { value: 60 }];
const SPARKLINE_DATA_3 = [{ value: 80 }, { value: 75 }, { value: 70 }, { value: 72 }, { value: 65 }, { value: 60 }, { value: 55 }];
const SPARKLINE_DATA_4 = [{ value: 5 }, { value: 2 }, { value: 8 }, { value: 4 }, { value: 0 }, { value: 1 }, { value: 3 }];

export default function DashboardPage() {
    const { agents, checkins, loading } = useAgents();

    // Calculate real metrics
    const activeAgents = agents.filter(a => a.status === 'active').length;
    const totalAgents = agents.length;
    const activePercentage = totalAgents > 0 ? Math.round((activeAgents / totalAgents) * 100) : 0;

    // Calculate unique wards covered
    const uniqueWards = new Set(agents.map(a => a.ward).filter(w => w && w !== 'Pending')).size;
    const totalWards = 85; // Fixed total for Nairobi

    // Calculate incident reports (SOS)
    const incidentCount = agents.filter(a => a.status === 'sos').length;

    // Calculate Chart Data (Last 7 Days)
    const chartData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    let cumulative = 0;

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dayName = days[d.getDay()];
        const dateStr = d.toISOString().split('T')[0];

        // Count checkins for this day
        const dailyCount = checkins.filter(c => c.createdAt && c.createdAt.startsWith(dateStr)).length;
        cumulative += dailyCount;

        chartData.push({
            name: dayName,
            checkins: dailyCount,
            target: 15, // Arbitrary target
            cumulative: cumulative
        });
    }

    return (
        <div>
            <DashboardHeader />

            <main className="container mx-auto px-4 py-6 space-y-6 max-w-[1600px]">

                {/* 1. Intelligent Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <IntelligentMetricCard
                        title="Total Check-ins"
                        value={loading ? "..." : `${checkins.length}`}
                        trend="Live updates"
                        trendDirection="up"
                        icon={Activity}
                        sparklineData={SPARKLINE_DATA_1}
                        color="blue"
                        targetProgress={78}
                        footerText={`${chartData[6]?.checkins || 0} today`}
                    />
                    <IntelligentMetricCard
                        title="Active Agents"
                        value={loading ? "..." : `${activeAgents}`}
                        trend={`${activeAgents} agents deployed`}
                        trendDirection="up"
                        icon={Users}
                        sparklineData={SPARKLINE_DATA_2}
                        color="green"
                        targetProgress={activePercentage}
                        footerText={`${activePercentage}% utilization`}
                    />
                    <IntelligentMetricCard
                        title="Ward Coverage"
                        value={`${uniqueWards}/${totalWards}`}
                        trend="Live coverage"
                        trendDirection={uniqueWards > 10 ? "up" : "neutral"}
                        icon={MapPin}
                        sparklineData={SPARKLINE_DATA_3}
                        color="amber"
                        targetProgress={Math.round((uniqueWards / totalWards) * 100)}
                        footerText="Needs attention"
                    />
                    <IntelligentMetricCard
                        title="Incident Reports"
                        value={`${incidentCount}`}
                        trend={incidentCount === 0 ? "All clear" : "Active incidents"}
                        trendDirection={incidentCount === 0 ? "neutral" : "down"}
                        icon={AlertTriangle}
                        sparklineData={SPARKLINE_DATA_4}
                        color="purple"
                        targetProgress={5} // Arbitrary low target for incidents
                        footerText="Real-time alerts"
                    />
                </div>

                {/* 2. Main Command Grid (Chart + Matrix) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-full">
                        <MainCommandChart data={chartData} />
                    </div>
                    <div className="h-full">
                        <WardPerformanceMatrix agents={agents} />
                    </div>
                </div>

                {/* 3. Lower Intelligence Grid (Stream + Leaderboard) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <LiveActivityStream checkins={checkins} agents={agents} />
                    </div>
                    <div>
                        <AgentLeaderboard agents={agents} checkins={checkins} />
                    </div>
                </div>

            </main>
        </div>
    );
}
