import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import client from '../../src/api/client';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register() {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await client.post('/auth/register', data);
            Alert.alert('Success', 'Account created successfully. Please login.');
            router.replace('/auth/login');
        } catch (error: any) {
            Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 justify-center px-6">
            <View className="items-center mb-10">
                <Text className="text-3xl font-bold text-green-700">Grassroots</Text>
                <Text className="text-gray-500 mt-2">Create an Account</Text>
            </View>

            <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View className="mb-4">
                        <Text className="text-gray-700 mb-1">Full Name</Text>
                        <TextInput
                            className="bg-white p-4 rounded-lg border border-gray-200"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="John Doe"
                        />
                        {errors.name && <Text className="text-red-500 text-sm mt-1">Name is required</Text>}
                    </View>
                )}
                name="name"
            />

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
                            placeholder="Choose a password"
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
                <Text className="text-white font-semibold text-lg">{loading ? 'Creating Account...' : 'Register'}</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Already have an account? </Text>
                <Link href="/auth/login" asChild>
                    <TouchableOpacity>
                        <Text className="text-green-600 font-bold">Login</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}
