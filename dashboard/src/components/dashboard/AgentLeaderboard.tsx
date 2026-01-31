import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, ChevronRight } from 'lucide-react';
import { Agent } from '@/hooks/useAgents';

export function AgentLeaderboard({ agents = [], checkins = [] }: { agents?: Agent[], checkins?: any[] }) {

    // Calculate scores (using checkin count for simplicity if points not available)
    // In real app, points would come from backend. We have points in Agent interface? 
    // Agent interface in hook has battery, signal etc. Let's use checkin count as metric for now.

    // Create map of checkin counts
    const checkinCounts: Record<string, number> = {};
    checkins.forEach(c => {
        checkinCounts[c.userId] = (checkinCounts[c.userId] || 0) + 1;
    });

    const leaderboard = agents
        .map(agent => ({
            id: agent.id,
            name: agent.name,
            score: checkinCounts[agent.id] || 0, // Score = Checkins
            avatar: agent.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
            trend: '+0' // dynamic trend hard without history diffs
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5) // Top 5
        .map((agent, index) => ({ ...agent, rank: index + 1 }));

    return (
        <Card className="h-full shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-slate-100">
                <div>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        Top Performers
                    </CardTitle>
                </div>
                <button className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors flex items-center">
                    View All <ChevronRight className="h-2 w-2 ml-1" />
                </button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                    {leaderboard.length === 0 && <div className="p-4 text-center text-xs text-slate-400">No data available</div>}
                    {leaderboard.map((agent) => (
                        <div key={agent.id} className="flex items-center p-4 hover:bg-slate-50 transition-colors group">
                            <div className={`
                                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-4
                                ${agent.rank === 1 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : ''}
                                ${agent.rank === 2 ? 'bg-slate-100 text-slate-700 border border-slate-200' : ''}
                                ${agent.rank === 3 ? 'bg-orange-100 text-orange-700 border border-orange-200' : ''}
                                ${agent.rank > 3 ? 'bg-white text-slate-400 border border-slate-100' : ''}
                            `}>
                                {agent.rank}
                            </div>

                            <Avatar className="h-8 w-8 mr-3 border border-slate-100">
                                <AvatarFallback className="text-[10px] bg-indigo-50 text-indigo-600 font-bold">{agent.avatar}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">{agent.name}</p>
                                <p className="text-[10px] text-slate-500">{agent.score} actions</p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-900">{agent.score * 10}</p>
                                <p className="text-[10px] text-green-500 font-medium">XP Points</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
