'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

const ACTIVITIES = [
    { id: 1, user: 'Sarah K.', action: 'Checked in', location: 'Westlands', time: 'Just now', type: 'success', message: 'Crowd gathering at station A.' },
    { id: 2, user: 'John D.', action: 'Reported Issue', location: 'Kibra', time: '2m ago', type: 'error', message: 'Missing materials.' },
    { id: 3, user: 'System', action: 'Alert', location: 'Server', time: '5m ago', type: 'warning', message: 'High latency detected.' },
    { id: 4, user: 'Mary W.', action: 'Checked in', location: 'Langata', time: '12m ago', type: 'success', message: '' },
    { id: 5, user: 'Peter M.', action: 'En Route', location: 'Roysambu', time: '15m ago', type: 'info', message: '' },
    { id: 6, user: 'James O.', action: 'Checked in', location: 'Starehe', time: '22m ago', type: 'success', message: 'All smooth here.' },
];

export function LiveActivityStream() {
    return (
        <Card className="h-full flex flex-col shadow-sm border-slate-200">
            <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                        <ActivityIcon className="h-4 w-4 text-slate-500" />
                        Live Field Feed
                    </CardTitle>
                    <Badge variant="outline" className="bg-white text-[10px] text-green-600 border-green-200 animate-pulse">LIVE</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative">
                <ScrollArea className="h-[400px]">
                    <div className="divide-y divide-slate-100">
                        {ACTIVITIES.map((activity) => (
                            <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                <div className="flex gap-3">
                                    <Avatar className="h-8 w-8 border border-slate-200">
                                        <AvatarFallback className="text-[10px] bg-white text-slate-600">{activity.user.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-slate-900">
                                                {activity.user}
                                                <span className="font-normal text-slate-500 ml-1">
                                                    {activity.action}
                                                </span>
                                            </p>
                                            <span className="text-[10px] text-slate-400">{activity.time}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                            <MapPin className="h-3 w-3" />
                                            {activity.location}
                                        </div>

                                        {activity.message && (
                                            <div className="mt-1.5 p-2 bg-slate-100 rounded text-xs text-slate-600 border border-slate-200 group-hover:bg-white transition-colors">
                                                {activity.message}
                                            </div>
                                        )}

                                        {activity.type === 'error' && (
                                            <Badge variant="destructive" className="mt-1 text-[10px] h-5">Critical</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                {/* Fade at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </CardContent>
        </Card>
    );
}

function ActivityIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}
