import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import client from '../../src/api/client';
import { useAuth } from '../../src/context/AuthContext';
import { useOffline } from '../../src/context/OfflineContext';
import { Ionicons } from '@expo/vector-icons';

export default function CheckinScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [mission, setMission] = useState<any>(null);

    // Audio Recording State
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingUri, setRecordingUri] = useState<string | null>(null);
    const [recordingDuration, setRecordingDuration] = useState(0);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await client.get(`/missions/${id}`);
                setMission(res.data);
            } catch (e) {
                Alert.alert('Error', 'Failed to load mission details');
            }

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setLoading(false);
                return;
            }

            try {
                let loc = await Location.getCurrentPositionAsync({});
                setLocation(loc);
            } catch (e) {
                setErrorMsg('Could not fetch location');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    // Audio Recording Functions
    const startRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Microphone access is required.');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
            setRecordingDuration(0);

            // Timer for duration display
            const interval = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);

            // Store interval ID to clear later
            (recording as any)._intervalId = interval;

        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Error', 'Could not start recording');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        try {
            clearInterval((recording as any)._intervalId);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecordingUri(uri);
            setRecording(null);
            setIsRecording(false);
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    };

    const { isConnected, addToQueue } = useOffline();

    const handleCheckin = async () => {
        if (!location) {
            Alert.alert('Location Missing', 'Please wait for GPS location.');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('missionId', id as string);
            formData.append('userId', user?.id || '');
            formData.append('lat', location.coords.latitude.toString());
            formData.append('lng', location.coords.longitude.toString());

            if (recordingUri) {
                const filename = recordingUri.split('/').pop() || 'audio.m4a';
                formData.append('file', {
                    uri: recordingUri,
                    name: filename,
                    type: 'audio/m4a',
                } as any);
            }

            if (!isConnected) {
                await addToQueue({
                    url: '/checkins',
                    method: 'POST',
                    data: formData,
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                Alert.alert('Saved Offline 💾', 'Your report has been saved and will sync automatically when internet returns.');
                router.replace('/(tabs)/missions');
            } else {
                await client.post('/checkins', formData);
                Alert.alert('Success', 'Check-in submitted successfully! (+10 points)');
                router.replace('/(tabs)/missions');
            }
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to submit check-in');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#166534" />
                <Text className="mt-4 text-gray-500">Getting location & mission details...</Text>
            </SafeAreaView>
        );
    }

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `🌿 I am working on a task at ${mission?.ward?.name}: "${mission?.title}". Join me in the Grassroots movement! #Maendeleo`,
            });
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="p-6">
                <View className="flex-row justify-between items-center mb-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} className="bg-green-100 p-2 rounded-full">
                        <Ionicons name="share-social" size={20} color="#166534" />
                    </TouchableOpacity>
                </View>

                <Text className="text-2xl font-bold text-gray-800 mb-2">{mission?.title || 'Task'}</Text>
                <Text className="text-gray-600 mb-6">{mission?.description}</Text>

                {/* Location Status */}
                <View className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-100">
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="location" size={20} color="#166534" />
                        <Text className="text-gray-800 font-semibold ml-2">Location</Text>
                    </View>
                    {errorMsg ? (
                        <Text className="text-red-500">{errorMsg}</Text>
                    ) : location ? (
                        <View>
                            <Text className="text-green-700">GPS Locked ✅</Text>
                            <Text className="text-xs text-gray-400 mt-1">
                                {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                            </Text>
                        </View>
                    ) : (
                        <Text className="text-gray-500">Acquiring GPS...</Text>
                    )}
                </View>

                {/* Voice Note Recorder */}
                <View className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-100">
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="mic" size={20} color="#166534" />
                        <Text className="text-gray-800 font-semibold ml-2">Voice Note</Text>
                    </View>

                    {recordingUri && !isRecording ? (
                        <View className="bg-green-50 p-3 rounded-lg flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                                <Text className="text-green-700 ml-2">Recording saved ({formatDuration(recordingDuration)})</Text>
                            </View>
                            <TouchableOpacity onPress={() => setRecordingUri(null)}>
                                <Ionicons name="trash-outline" size={20} color="#dc2626" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={isRecording ? stopRecording : startRecording}
                            className={`p-4 rounded-lg items-center ${isRecording ? 'bg-red-500' : 'bg-gray-100'}`}
                        >
                            <Ionicons
                                name={isRecording ? 'stop' : 'mic-outline'}
                                size={32}
                                color={isRecording ? '#fff' : '#6b7280'}
                            />
                            <Text className={`mt-2 font-medium ${isRecording ? 'text-white' : 'text-gray-500'}`}>
                                {isRecording ? `Recording... ${formatDuration(recordingDuration)}` : 'Tap to Record'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Photo placeholder */}
                <View className="bg-gray-100 p-4 rounded-xl mb-6 items-center justify-center border-dashed border-2 border-gray-300">
                    <Ionicons name="camera-outline" size={32} color="#9CA3AF" />
                    <Text className="text-gray-400 mt-2">Add Photo (Coming Soon)</Text>
                </View>

                <TouchableOpacity
                    className={`p-4 rounded-lg items-center ${submitting || !location ? 'bg-gray-300' : 'bg-green-600'}`}
                    onPress={handleCheckin}
                    disabled={submitting || !location}
                >
                    <Text className="text-white font-bold text-lg">
                        {submitting ? 'Submitting...' : 'Complete Task'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
