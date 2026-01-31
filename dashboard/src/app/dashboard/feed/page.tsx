'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { Radio, MapPin, User, Clock } from 'lucide-react';

export default function FeedPage() {
    const [checkins, setCheckins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await api.get('/checkins');
                // Filter out items without valid dates and sort by newest
                const sorted = (Array.isArray(res.data) ? res.data : [])
                    .filter((item: any) => item.createdAt && !isNaN(new Date(item.createdAt).getTime()))
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setCheckins(sorted);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();

        // Simple polling for "real-time" vibe
        const interval = setInterval(fetchFeed, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-green-100 text-green-700 rounded-full animate-pulse">
                    <Radio size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Vibe Feed</h2>
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Listening to the streets...</div>
                ) : checkins.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-gray-500">No vibes yet. Start checking in!</p>
                    </div>
                ) : (
                    checkins.map((checkin) => (
                        <div key={checkin.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                        {checkin.user?.name?.charAt(0) || <User size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{checkin.user?.name || 'Volunteer'}</p>
                                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                                            <Clock size={12} />
                                            <span>{formatDistanceToNow(new Date(checkin.createdAt), { addSuffix: true })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                    +10 pts
                                </div>
                            </div>

                            <div className="ml-13 pl-13">
                                <p className="text-gray-600 italic">"Checked in at {checkin.mission?.title || 'Unknown Mission'}"</p>

                                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 p-2 rounded w-fit">
                                    <MapPin size={16} />
                                    <span>{checkin.lat.toFixed(5)}, {checkin.lng.toFixed(5)}</span>
                                </div>

                                {checkin.voiceNoteUrl && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center space-x-2">
                                        <span className="text-blue-700 text-sm font-medium">🎤 Voice Note</span>
                                        {/* Audio player placeholder */}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
