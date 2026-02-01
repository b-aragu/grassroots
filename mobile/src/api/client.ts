import axios from 'axios';
import { storage } from '../utils/storage';
import { Platform } from 'react-native';

// Use local IP for Android Emulator (10.0.2.2) or localhost for iOS/Web
const BASE_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:3333'
    : 'http://localhost:3333';

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(async (config) => {
    const token = await storage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;
