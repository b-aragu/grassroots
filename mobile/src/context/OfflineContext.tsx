import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import client from '../api/client';
import { Alert } from 'react-native';

interface QueueItem {
    id: string; // Unique ID for deduplication
    url: string;
    method: 'POST' | 'PUT' | 'PATCH';
    data: any; // Can be FormData or JSON
    headers?: any;
    timestamp: number;
}

interface OfflineContextType {
    isConnected: boolean | null;
    queue: QueueItem[];
    addToQueue: (item: Omit<QueueItem, 'id' | 'timestamp'>) => Promise<void>;
    sync: () => Promise<void>;
    isSyncing: boolean;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState<boolean | null>(true);
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    // Load queue on startup
    useEffect(() => {
        const loadQueue = async () => {
            const stored = await AsyncStorage.getItem('offline_queue');
            if (stored) {
                setQueue(JSON.parse(stored));
            }
        };
        loadQueue();

        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                sync();
            }
        });

        return () => unsubscribe();
    }, []);

    const addToQueue = async (item: Omit<QueueItem, 'id' | 'timestamp'>) => {
        const newItem: QueueItem = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
        };

        const updatedQueue = [...queue, newItem];
        setQueue(updatedQueue);
        await AsyncStorage.setItem('offline_queue', JSON.stringify(updatedQueue));
        Alert.alert('Offline Mode', 'Request saved to device. Will sync when online.');
    };

    const sync = async () => {
        if (isSyncing || queue.length === 0) return;

        setIsSyncing(true);
        const currentQueue = [...queue]; // Copy queue to iterate safely

        for (const item of currentQueue) {
            try {
                // Determine if we need to reconstruct FormData
                let payload = item.data;
                const isFormData = item.headers?.['Content-Type'] === 'multipart/form-data';

                if (isFormData && item.data._parts) {
                    // Reconstruct FormData object
                    const formData = new FormData();
                    item.data._parts.forEach((part: any) => {
                        formData.append(part[0], part[1]);
                    });
                    payload = formData;
                }

                await client.request({
                    method: item.method,
                    url: item.url,
                    data: payload,
                    headers: item.headers,
                });

                // Remove successful item from queue (using filter to avoid index shifts)
                setQueue((prev) => {
                    const next = prev.filter((q) => q.id !== item.id);
                    AsyncStorage.setItem('offline_queue', JSON.stringify(next));
                    return next;
                });

            } catch (error) {
                console.error(`Sync failed for item ${item.id}`, error);
                // Keep largely failed items in queue? Or retry logic?
                // For simplified V1, we keep it in queue if it fails due to network error
            }
        }
        setIsSyncing(false);
    };

    return (
        <OfflineContext.Provider value={{ isConnected, queue, addToQueue, sync, isSyncing }}>
            {children}
        </OfflineContext.Provider>
    );
}

export const useOffline = () => {
    const context = useContext(OfflineContext);
    if (!context) throw new Error('useOffline must be used within OfflineProvider');
    return context;
};
