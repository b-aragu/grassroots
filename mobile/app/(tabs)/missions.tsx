import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../../src/api/client';
import { useAuth } from '../../src/context/AuthContext';
import { Link, useRouter } from 'expo-router';

type Task = {
    id: string;
    title: string;
    description: string;
    status: string;
    points: number;
    ward: { name: string };
};

export default function Missions() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();

    const fetchTasks = async () => {
        try {
            const response = await client.get('/missions');
            setTasks(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTasks();
    };

    const renderItem = ({ item }: { item: Task }) => (
        <View className="bg-white p-4 mb-4 rounded-lg shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-start">
                <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800">{item.title || 'Task'}</Text>
                    <Text className="text-sm text-gray-500 mt-1">{item.ward?.name || 'General Ward'}</Text>
                </View>
                <View className="bg-green-100 px-2 py-1 rounded">
                    <Text className="text-xs text-green-700 font-medium">{item.status}</Text>
                </View>
            </View>

            <Text className="text-gray-600 mt-2">{item.description}</Text>

            <View className="mt-4 flex-row justify-between items-center">
                <Text className="text-sm font-semibold text-green-600">+{item.points} Points</Text>
                <Link href={`/checkin/${item.id}`} asChild>
                    <TouchableOpacity className="bg-green-600 px-4 py-2 rounded">
                        <Text className="text-white font-medium">Check In</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50 px-4 pt-2">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Current Missions</Text>

            <View className="flex-row mb-6">
                <View className="bg-green-100 p-4 rounded-xl flex-1 mr-2">
                    <Text className="text-green-800 font-bold text-xl">{tasks.filter((m: any) => m.status === 'COMPLETED').length}</Text>
                    <Text className="text-green-600 text-xs">Completed</Text>
                </View>
                <View className="bg-orange-100 p-4 rounded-xl flex-1 ml-2">
                    <Text className="text-orange-800 font-bold text-xl">{tasks.filter((m: any) => m.status === 'PENDING').length}</Text>
                    <Text className="text-orange-600 text-xs">Pending</Text>
                </View>
            </View>

            <Text className="text-lg font-semibold text-gray-700 mb-2">Available Tasks</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#166534" />
            ) : (
                <FlatList
                    data={tasks}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">No tasks assigned yet.</Text>}
                />
            )}
        </SafeAreaView>
    );
}
