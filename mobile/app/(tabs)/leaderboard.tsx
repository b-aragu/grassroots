import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../../src/api/client';

type Volunteer = {
    id: string;
    name: string;
    points: number;
};

export default function Leaderboard() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLeaderboard = async () => {
        try {
            const response = await client.get('/volunteers');
            // Sort in frontend or backend (ideally backend endpoint /volunteers/leaderboard)
            // For now, sorting client side
            const sorted = response.data.sort((a: Volunteer, b: Volunteer) => b.points - a.points);
            setVolunteers(sorted);
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchLeaderboard();
    };

    const renderItem = ({ item, index }: { item: Volunteer, index: number }) => (
        <View className="bg-white p-4 mb-2 rounded-lg flex-row items-center border border-gray-100">
            <Text className={`text-lg font-bold w-10 ${index < 3 ? 'text-green-600' : 'text-gray-500'}`}>#{index + 1}</Text>
            <View className="flex-1">
                <Text className="text-gray-800 font-semibold text-lg">{item.name}</Text>
            </View>
            <Text className="text-green-700 font-bold">{item.points} pts</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50 px-4 pt-2">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Shujaa Board 🏆</Text>
            <View className="bg-green-50 p-2 rounded-lg mb-4 border border-green-100">
                <Text className="text-green-800 text-center text-sm">Top Agents (Mabalozi)</Text>
            </View>
            <FlatList
                data={volunteers}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    );
}
