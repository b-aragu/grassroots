import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../src/context/AuthContext';
import client from '../../src/api/client';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const { signIn } = useAuth();
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await client.post('/auth/login', data);
            signIn(response.data.access_token, response.data.user);
        } catch (error: any) {
            Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 justify-center px-6">
            <View className="items-center mb-10">
                <Text className="text-3xl font-bold text-green-700">Grassroots</Text>
                <Text className="text-gray-500 mt-2">Volunteer Login</Text>
            </View>

            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View className="mb-4">
                        <Text className="text-gray-700 mb-1">Email</Text>
                        <TextInput
                            className="bg-white p-4 rounded-lg border border-gray-200"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Enter your email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        {errors.email && <Text className="text-red-500 text-sm mt-1">Email is required</Text>}
                    </View>
                )}
                name="email"
            />

            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View className="mb-6">
                        <Text className="text-gray-700 mb-1">Password</Text>
                        <TextInput
                            className="bg-white p-4 rounded-lg border border-gray-200"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Enter your password"
                            secureTextEntry
                        />
                        {errors.password && <Text className="text-red-500 text-sm mt-1">Password is required</Text>}
                    </View>
                )}
                name="password"
            />

            <TouchableOpacity
                className="bg-green-600 p-4 rounded-lg items-center"
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
            >
                <Text className="text-white font-semibold text-lg">{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Don't have an account? </Text>
                <Link href="/auth/register" asChild>
                    <TouchableOpacity>
                        <Text className="text-green-600 font-bold">Register</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}
