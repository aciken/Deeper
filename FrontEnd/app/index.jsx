import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { router, Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import { icons } from '../constants'
import { useGlobalContext } from './context/GlobalProvider'
import { useIsFocused } from '@react-navigation/native'
import { BackHandler } from 'react-native'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator } from 'react-native'


import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const Index = () => {
  const { isLoading, isLogged, setIsLogged, setUser } = useGlobalContext()
  const isFocused = useIsFocused()
  const [userInfo, setUserInfo] = useState(null)
  const [authError, setAuthError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);



  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '982934180885-4av5h5gq1fldb8tbbgb1khd4c210k1rf.apps.googleusercontent.com',
    iosClientId: '982934180885-qha3lvi6roh4e81slf6a0th12sf71rpb.apps.googleusercontent.com', 
    expoClientId: '982934180885-qp8u94ipgl27qq33kuvn55g99pff6huk.apps.googleusercontent.com', 
     redirectUri: 'https://auth.expo.io/@aciken/FrontEnd'
  });

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  async function handleSignInWithGoogle() {
    try {
      setAuthError(null);
      setIsAuthenticating(true);
      
      const user = await AsyncStorage.getItem('@user');
      if (!user) {
        if (response?.type === "success") {
          await getUserInfo(response.authentication.accessToken);
        } else if (response?.type === "error") {
          throw new Error(response.error?.message || 'Authentication failed');
        }
      } else {
        const parsedUser = JSON.parse(user);
        setUserInfo(parsedUser);
        setUser(parsedUser);
        setIsLogged(true);
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
      setAuthError(error.message || 'Failed to sign in with Google');
    } finally {
      setIsAuthenticating(false);
    }
  }

  const getUserInfo = async (token) => {
    if (!token) {
      throw new Error('No authentication token received');
    }
    
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.status}`);
      }

      const user = await response.json();
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      setUserInfo(user);
      setUser(user);
      setIsLogged(true);
    } catch (error) {
      console.error('Get User Info Error:', error);
      throw new Error('Failed to get user information');
    }
  };

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   androidClientId: '1003474212666-gqrbg8e8s288508ssmkqrq5f9l6q5mf8.apps.googleusercontent.com',
  //   webClientId: '1003474212666-jkpr0kqcpkhckv0qtfg2qo33plvqq97t.apps.googleusercontent.com',
  // })

  // useEffect(() => {
  //   handleSignInWithGoogle()
  // }, [response])

  // async function handleSignInWithGoogle() {
  //   const user = await AsyncStorage.getItem('@user')
  //   if (!user) {
  //     if (response?.type === "success") {
  //       await getUserInfo(response.authentication.accessToken)
  //     }
  //   } else {
  //     setUserInfo(JSON.parse(user))
  //   }
  // }

  // const getUserInfo = async (token) => {
  //   if (!token) return
  //   try {
  //     const response = await fetch(
  //       "https://www.googleapis.com/userinfo/v2/me",
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     )
  //     const user = await response.json()
  //     await AsyncStorage.setItem('@user', JSON.stringify(user))
  //     setUserInfo(user)
  //     setUser(user)
  //     setIsLogged(true)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  useEffect(() => {
    if (isFocused && !isLogged && isLoading) {
      const backAction = () => {
        BackHandler.exitApp()
        return true
      }
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
      return () => backHandler.remove()
    }
  }, [isFocused])

  if (isLoading) {
    return (
      <View className="flex-1 bg-zinc-950 items-center justify-center">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  if (isLogged) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <StatusBar backgroundColor="#18181b" style="light" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 justify-between py-12">
          {/* Header Section */}
          <View className="items-center mt-8">
            <MaskedView
              maskElement={
                <Text className="text-5xl font-bold text-center">deeper</Text>
              }
            >
              <LinearGradient
                colors={['#D4D4D8', '#71717A']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
              >
                <Text className="text-5xl font-bold text-center opacity-0">deeper</Text>
              </LinearGradient>
            </MaskedView>
            <Text className="text-zinc-500 text-lg mt-4 text-center">
              Your journey to deep work starts here
            </Text>
          </View>

          {/* Error Message Display */}
          {authError && (
            <View className="bg-red-900/20 border border-red-500/20 rounded-xl p-4 mb-4">
              <Text className="text-red-400 text-center">{authError}</Text>
            </View>
          )}

          {/* Illustration/Feature Section */}
          <View className="py-12">
            <View className="bg-zinc-900/50 rounded-3xl p-6 border border-zinc-800/50">
              <View className="flex-row items-center mb-6">
                <LinearGradient
                  colors={['#27272a', '#27272a']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  className="w-12 h-12 rounded-2xl items-center justify-center mr-4 bg-zinc-800/50  border border-zinc-700"
                >
                  <Image source={icons.focus} className="w-6 h-6 tint-white" />
                </LinearGradient>
                <View>
                  <Text className="text-white text-xl font-semibold mb-1">Focus Better</Text>
                  <Text className="text-zinc-500">Track and improve your deep work</Text>
                </View>
              </View>

              <View className="flex-row items-center mb-6">
                <LinearGradient
                  colors={['#27272a', '#27272a']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  className="w-12 h-12 rounded-2xl items-center justify-center mr-4 bg-zinc-800/50  border border-zinc-700"
                >
                  <Image source={icons.track} className="w-6 h-6 tint-white" />
                </LinearGradient>
                <View>
                  <Text className="text-white text-xl font-semibold mb-1">Track Progress</Text>
                  <Text className="text-zinc-500">Visualize your improvement</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <LinearGradient
                  colors={['#27272a', '#27272a']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  className="w-12 h-12 rounded-2xl items-center justify-center mr-4 bg-zinc-800/50  border border-zinc-700"
                >
                  <Image source={icons.habit} className="w-6 h-6 tint-white" />
                </LinearGradient>
                <View>
                  <Text className="text-white text-xl font-semibold mb-1">Build Habits</Text>
                  <Text className="text-zinc-500">Develop lasting routines</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-4">
            <TouchableOpacity 
              onPress={() => router.push('/sign-up')}
              className="w-full h-14 rounded-2xl overflow-hidden"
            >
              <LinearGradient
                colors={['#0ea5e9', '#3b82f6']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                className="w-full h-full items-center justify-center"
              >
                <Text className="text-white text-lg font-semibold">Create Account</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* <TouchableOpacity 
              onPress={() => {
                setAuthError(null);
                promptAsync();
              }}
              disabled={isAuthenticating}
              className="w-full h-14 rounded-2xl bg-white flex-row items-center justify-center space-x-2"
            >
              <Image 
                source={require('../assets/images/google.png')} 
                className="w-5 h-5"
              />
              <Text className="text-zinc-900 text-lg font-semibold">
                {isAuthenticating ? 'Signing in...' : 'Continue with Google'}
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity 
              onPress={() => router.push('/sign-in')}
              className="w-full h-14 rounded-2xl border border-zinc-800 items-center justify-center"
            >
              <Text className="text-white text-lg font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Index