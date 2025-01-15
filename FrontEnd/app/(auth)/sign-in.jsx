import { View, Text, ScrollView, Image, Alert, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { LinearGradient } from 'expo-linear-gradient'
import MaskedView from '@react-native-masked-view/masked-view'
import { icons } from '../../constants'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useGlobalContext } from '../context/GlobalProvider'

const SignIn = () => {
  const { setIsLogged, setUser, setIsLoading,user } = useGlobalContext()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [loginSuccess, setLoginSuccess] = useState(false)
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [updateUser, setUpdateUser] = useState(false)

  useEffect(() => {
    if (loginSuccess) {
      setIsLoading(false)
      setUpdateUser(false)
      setLoginSuccess(false)
      console.log('updateUserVERIFY', user.verify)
      if(user.verify != 1){
        router.push('/verify')
      } else {
        router.push('/Home')
      }
    }
  }, [loginSuccess])

  useEffect(() => {
    if(updateUser) {
      setUser(updateUser)
      setUpdateUser(false)
    }
  }, [updateUser])

  const submit = () => {
    const { email, password } = form
    if(!email || !password) {
      Alert.alert('Please fill in all fields')
    } else {
      setIsSubmiting(true)
      axios.post('https://8814-109-245-203-91.ngrok-free.app/login', {
        email,
        password
      }).then(async (res) => {
        if(res.data !== 'failed') {
          setForm({email: '', password: ''})
          setUpdateUser(res.data)
          setIsLogged(true)
          // Store user data in AsyncStorage
          try {
            await AsyncStorage.setItem('@user', JSON.stringify(res.data))
            console.log('User data stored successfully')

          } catch (error) {
            console.error('Error storing user data:', error)
          }
          setLoginSuccess(true)
        } else {
          Alert.alert('Invalid email or password')
        }
        setIsSubmiting(false)
      }).catch(() => {
        Alert.alert('An error occurred')
        setIsSubmiting(false)
      })
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 justify-center">
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.push('/')}
            className="absolute top-4 left-6 w-10 h-10 rounded-xl bg-zinc-900/80 items-center justify-center"
          >
            <Image source={icons.backIcon} className="w-5 h-5 tint-zinc-400" />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-12">
            <MaskedView
              maskElement={
                <Text className="text-4xl font-bold mb-2">Welcome Back</Text>
              }
            >
              <LinearGradient
                colors={['#D4D4D8', '#71717A']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
              >
                <Text className="text-4xl font-bold mb-2 opacity-0">Welcome Back</Text>
              </LinearGradient>
            </MaskedView>
            <Text className="text-zinc-500 text-lg">Sign in to continue</Text>
          </View>

          {/* Form Fields */}
          <View className="space-y-6">
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

          {/* Forgot Password */}
          <TouchableOpacity className="mt-4 self-end" onPress={() => router.push('/forgotPassword')}>
            <Text className="text-zinc-500 text-base">Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
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
                {isSubmiting ? 'Signing in...' : 'Sign In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-zinc-500 text-base mr-1">Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/onboardingGender')}>
              <Text className="text-sky-400 text-base font-medium">Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn