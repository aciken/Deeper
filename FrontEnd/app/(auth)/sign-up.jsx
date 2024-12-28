import { View, Text, ScrollView, Image, Alert, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, Link,useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import { icons } from '../../constants'
import { useLocalSearchParams } from 'expo-router'


import { useGlobalContext } from '../context/GlobalProvider'

const SignUp = () => {
  const { setIsLogged, setUser, setIsLoading } = useGlobalContext()
  const router = useRouter();
  const { onboardingData: onboardingDataString } = useLocalSearchParams();
  const [onboardingData, setOnboardingData] = useState(null);

  useEffect(() => {
    if (onboardingDataString) {
      try {
        const parsedData = JSON.parse(onboardingDataString);
        setOnboardingData(parsedData);
        console.log('Received data:', parsedData); // Debug log
      } catch (error) {
        console.error('Error parsing onboarding data:', error);
        setOnboardingData({
          gender: null,
          born: null,
          time: null,
          deeptime: null,
          productive: null,
          stopping: null,
          work: null,
          workname: null,
          worktime: null,
        });
      }
    }
  }, [onboardingDataString]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [isSubmiting, setIsSubmiting] = useState(false)

  useEffect(() => {
    if (loginSuccess) {
      setIsLoading(false)
      router.push('/onboardingSettingup')
    }
  }, [loginSuccess])

  const submit = () => {
    const { name, email, password } = form
    if (!name || !email || !password) {
      Alert.alert('Please fill in all fields')
      return
    }
    
    setIsSubmiting(true)
    axios.put('https://0310-109-245-203-91.ngrok-free.app/signup', {
      name,
      email,
      password,
      onboardingData,
    }).then(res => {
      if (res.data !== 'exist') {
        setForm({ email: '', password: '', name: '' })
        setUser(res.data)
        setIsLogged(true)
        setLoginSuccess(true)
        router.push('/onboardingSettingup')
      } else {
        Alert.alert('User already exists')
      }
      setIsSubmiting(false)
    }).catch(() => {
      Alert.alert('An error occurred')
      setIsSubmiting(false)
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 justify-center">
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-4 left-6 w-10 h-10 rounded-xl bg-zinc-900/80 items-center justify-center"
          >
            <Image source={icons.backIcon} className="w-5 h-5 tint-zinc-400" />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-12">
            <MaskedView
              maskElement={
                <Text className="text-4xl font-bold mb-2">Create Account</Text>
              }
            >
              <LinearGradient
                colors={['#D4D4D8', '#71717A']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
              >
                <Text className="text-4xl font-bold mb-2 opacity-0">Create Account</Text>
              </LinearGradient>
            </MaskedView>
            <Text className="text-zinc-500 text-lg">Sign up to get started</Text>
          </View>

          {/* Form Fields */}
          <View className="space-y-6">
            <View>
              <Text className="text-zinc-400 text-base mb-2">Name</Text>
              <View className="bg-zinc-900/80 rounded-xl overflow-hidden border border-zinc-800">
                <TextInput
                  placeholder="Enter your name"
                  placeholderTextColor="#52525b"
                  value={form.name}
                  onChangeText={(e) => setForm({...form, name: e})}
                  className="px-4 py-3.5 text-base text-white"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View>
              <Text className="text-zinc-400 text-base mb-2">Email</Text>
              <View className="bg-zinc-900/80 rounded-xl overflow-hidden border border-zinc-800">
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#52525b"
                  value={form.email}
                  onChangeText={(e) => setForm({...form, email: e})}
                  className="px-4 py-3.5 text-base text-white"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View>
              <Text className="text-zinc-400 text-base mb-2">Password</Text>
              <View className="bg-zinc-900/80 rounded-xl overflow-hidden border border-zinc-800">
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#52525b"
                  value={form.password}
                  onChangeText={(e) => setForm({...form, password: e})}
                  className="px-4 py-3.5 text-base text-white"
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            onPress={submit}
            className="mt-8 w-full h-14 rounded-2xl overflow-hidden"
            disabled={isSubmiting}
          >
            <LinearGradient
              colors={['#0ea5e9', '#3b82f6']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              className="w-full h-full items-center justify-center"
            >
              <Text className="text-white text-lg font-semibold">
                {isSubmiting ? 'Creating Account...' : 'Create Account'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp