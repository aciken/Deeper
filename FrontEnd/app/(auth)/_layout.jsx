import {Text, View } from 'react-native'
import {Stack} from 'expo-router'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor='#030712' style='light' />
      <Stack>
        <Stack.Screen name='sign-in' options={{ headerShown: false}} />
        <Stack.Screen name='sign-up' options={{ headerShown: false }} />
        <Stack.Screen name='verify' options={{ headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name='forgotPassword' options={{ headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name='forgotPasswordVerification' options={{ headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name='forgotPasswordReset' options={{ headerShown: false, gestureEnabled: false}} />
      </Stack>
    </View>
  )
}

export default AuthLayout

