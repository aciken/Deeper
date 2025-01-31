import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from 'react-native-purchases';
import { icons } from '../../constants';

export default function Settings() {
  const router = useRouter();
  const { user, setUser, setIsLogged, isPro } = useGlobalContext();

  const handleLogout = async () => {
    try {
      AsyncStorage.clear();
      // setUser(null);
      // Purchases.logOut();
      //   setIsLogged(false);
      router.back();
      router.replace('/');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950" edges={['bottom']}>
      <View className="flex-1 mt-2">
        <View className="px-4 py-3 border-b border-zinc-800">
          <View className="absolute top-1 left-0 right-0 flex items-center">
            <View className="w-10 h-1 rounded-full bg-zinc-800" />
          </View>
          
          <Text className="text-white text-xl font-bold mt-3 text-center">Settings</Text>
        </View>

        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          <View className="p-4 space-y-6">
            {/* Account Section */}
            <View>
              <Text className="text-zinc-400 text-base mb-2">Account</Text>
              <View className="bg-zinc-800/50 rounded-xl p-4">
                <Text className="text-white text-lg">{user.name}</Text>
                <Text className="text-zinc-500">{user.email}</Text>
              </View>
            </View>

            {/* Subscription Section */}
            <View>
              <Text className="text-zinc-400 text-base mb-2">Subscription</Text>
              <View className="bg-zinc-800/50 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white text-lg">Pro Plan</Text>
                  <View className={`px-3 py-1 rounded-full ${isPro ? 'bg-sky-500/20' : 'bg-zinc-700/20'}`}>
                    <Text className={`font-medium ${isPro ? 'text-sky-400' : 'text-zinc-400'}`}>
                      {isPro ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
                {isPro ? (
                  <View>
                    <Text className="text-zinc-500 mb-3">Renews automatically</Text>
                    <TouchableOpacity 
                      onPress={() => {
                        if (Platform.OS === 'ios') {
                          Linking.openURL('itms-apps://apps.apple.com/account/subscriptions');
                        } else {
                          Linking.openURL('https://play.google.com/store/account/subscriptions');
                        }
                      }}
                      className="flex-row items-center"
                    >
                      <Text className="text-sky-500">Manage Subscription</Text>
                      <Image 
                        source={icons.chevronRight} 
                        className="w-4 h-4 ml-1 tint-sky-500" 
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    onPress={() => router.push('utils/Paywall')}
                    className="mt-2"
                  >
                    <Text className="text-sky-500">Upgrade to Pro</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Activity Section */}
            <View>
              <Text className="text-zinc-400 text-base mb-2">Activity</Text>
              <View className="bg-zinc-800/50 rounded-xl p-4">
                <View className="flex-row flex-wrap gap-2">
                  {[...Array(365)].map((_, index) => {
                    const dotDate = new Date(2025, 0, index + 1);
                    const dateString = `${dotDate.getDate()}:${dotDate.getMonth() + 1}:${dotDate.getFullYear()}`;
                    const hasSession = user.workSessions.some(session => session.date === dateString);

                    return (
                      <View 
                        key={index}
                        className={`w-2 h-2 rounded-full ${hasSession ? 'bg-zinc-600' : 'bg-zinc-800'}`}
                      />
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              onPress={handleLogout}
              className="w-full h-14 rounded-2xl bg-zinc-900 items-center justify-center mb-8"
            >
              <Text className="text-red-500 text-lg font-semibold">Log Out</Text>
            </TouchableOpacity>

            {/* Support Section */}
            <View className="border-t border-zinc-800/50 pt-8 mb-12">
              {/* Support Contact */}
              <View className="flex-row justify-center items-center py-4">
                <Text className="text-zinc-500 text-sm text-center">
                  For support contact:{' '}
                  <Text 
                    className="text-sky-500"
                    onPress={() => Linking.openURL('mailto:adrian@deepersoftware.com')}
                  >
                    adrian@deepersoftware.com
                  </Text>
                </Text>
              </View>
              
              {/* Links */}
              <View className="flex-row justify-center items-center space-x-6">
                <TouchableOpacity 
                  onPress={() => Linking.openURL('https://www.deepersoftware.com/terms-of-use')}
                  className="py-2"
                >
                  <Text className="text-zinc-600 text-sm">Terms of Use</Text>
                </TouchableOpacity>
                
                <View className="w-1 h-1 rounded-full bg-zinc-700" />
                
                <TouchableOpacity 
                  onPress={() => Linking.openURL('https://www.deepersoftware.com/privacy-policy')}
                  className="py-2"
                >
                  <Text className="text-zinc-600 text-sm">Privacy Policy</Text>
                </TouchableOpacity>
              </View>

              {/* App Version */}
              <View className="mt-6">
                <Text className="text-zinc-700 text-xs text-center">
                  Version 1.0.4
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
} 