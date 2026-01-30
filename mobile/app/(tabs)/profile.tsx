import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import client from '../../src/api/client';

export default function Profile() {
    const { user, signOut } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const response = await client.get('/gamification/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Helper to render badge icon
    const renderBadgeIcon = (iconName: string) => {
        switch (iconName) {
            case 'medal': return '🎖️';
            case 'map-pin': return '📍';
            case 'trophy': return '🏆';
            default: return '⭐';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 40 }}>
                <Text className="text-3xl font-bold text-gray-800 mb-6">My Profile</Text>

                {/* Main Profile Card */}
                <View className="bg-white p-6 rounded-xl shadow-sm mb-6">
                    <View className="items-center mb-6">
                        <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-3">
                            <Text className="text-4xl text-green-700 font-bold">{user?.name?.charAt(0) || 'U'}</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-800">{user?.name}</Text>
                        <Text className="text-gray-500">{user?.email}</Text>

                        <View className="mt-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                            <Text className="text-green-700 font-bold text-xs uppercase tracking-wider">{user?.role}</Text>
                        </View>
                    </View>

                    {loading ? (
                        <ActivityIndicator color="#16a34a" />
                    ) : (
                        <View className="mt-2">
                            {/* Level Progress */}
                            <View className="flex-row justify-between items-end mb-2">
                                <Text className="font-bold text-gray-700">Level {stats?.level}</Text>
                                <Text className="text-xs text-gray-500">{stats?.points} / {stats?.nextLevelPoints} XP</Text>
                            </View>

                            <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${stats?.progress}%` }}
                                />
                            </View>
                            <Text className="text-xs text-gray-400 mt-2 text-center">
                                {stats?.nextLevelPoints - stats?.points} points to Level {stats?.level + 1}
                            </Text>

                            {/* Stats Grid */}
                            <View className="flex-row mt-6 pt-6 border-t border-gray-100">
                                <View className="flex-1 items-center border-r border-gray-100">
                                    <Text className="text-2xl font-bold text-gray-800">{stats?.completedMissions}</Text>
                                    <Text className="text-xs text-gray-500 uppercase">Missions</Text>
                                </View>
                                <View className="flex-1 items-center">
                                    <Text className="text-2xl font-bold text-gray-800">{stats?.points}</Text>
                                    <Text className="text-xs text-gray-500 uppercase">Total XP</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* Badges Section */}
                <Text className="text-lg font-bold text-gray-800 mb-3">Achievements</Text>
                <View className="bg-white p-4 rounded-xl shadow-sm flex-row flex-wrap gap-2">
                    {stats?.badges && stats.badges.length > 0 ? (
                        stats.badges.map((badge: any) => (
                            <View key={badge.id} className="items-center w-[30%] mb-4">
                                <View className="w-14 h-14 bg-yellow-50 rounded-full items-center justify-center mb-1 border border-yellow-100">
                                    <Text className="text-2xl">{renderBadgeIcon(badge.icon)}</Text>
                                </View>
                                <Text className="text-xs font-semibold text-gray-700 text-center" numberOfLines={1}>
                                    {badge.name}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text className="text-gray-400 py-4 text-center w-full">No badges earned yet.</Text>
                    )}
                </View>

                <TouchableOpacity
                    className="bg-red-50 p-4 rounded-lg items-center border border-red-100 mt-8"
                    onPress={signOut}
                >
                    <Text className="text-red-600 font-semibold text-lg">Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
