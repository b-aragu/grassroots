import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { useRouter, useSegments } from 'expo-router';

type User = {
    id: string;
    email: string;
    name: string;
    role: string;
};

type AuthContextType = {
    signIn: (token: string, user: User) => void;
    signOut: () => void;
    user: User | null;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    signIn: () => { },
    signOut: () => { },
    user: null,
    isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await storage.getItem('token');
                const userData = await storage.getItem('user');

                if (token && userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (e) {
                console.error('Failed to load user', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!user && !inAuthGroup) {
            // Redirect to login if not authenticated
            router.replace('/auth/login');
        } else if (user && inAuthGroup) {
            // Redirect to home if authenticated
            router.replace('/(tabs)/missions');
        }
    }, [user, segments, isLoading]);

    const signIn = async (token: string, newUser: User) => {
        await storage.setItem('token', token);
        await storage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        router.replace('/(tabs)/missions');
    };

    const signOut = async () => {
        await storage.removeItem('token');
        await storage.removeItem('user');
        setUser(null);
        router.replace('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ signIn, signOut, user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
