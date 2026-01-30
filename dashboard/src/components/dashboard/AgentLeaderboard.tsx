'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, ChevronRight } from 'lucide-react';

const AGENTS = [
    { id: 1, name: 'Kennedy M.', score: 98, trend: '+4', checkins: 42, avatar: 'KM', rank: 1 },
    { id: 2, name: 'Sarah A.', score: 94, trend: '+2', checkins: 38, avatar: 'SA', rank: 2 },
    { id: 3, name: 'David O.', score: 91, trend: '+5', checkins: 36, avatar: 'DO', rank: 3 },
    { id: 4, name: 'Grace T.', score: 88, trend: '-1', checkins: 32, avatar: 'GT', rank: 4 },
    { id: 5, name: 'Brian K.', score: 85, trend: '+3', checkins: 29, avatar: 'BK', rank: 5 },
];

export function AgentLeaderboard() {
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
                    {AGENTS.map((agent) => (
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
                                <p className="text-[10px] text-slate-500">{agent.checkins} check-ins</p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-900">{agent.score}</p>
                                <p className="text-[10px] text-green-500 font-medium">Eff. Score</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
