import {Text, View } from 'react-native'
import {Stack} from 'expo-router'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const OnboardingLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor='#030712' style='light' />
      <Stack>
        <Stack.Screen name='onboardingGender' options={{ headerShown: false }} />
        <Stack.Screen name='onboardingBorn' options={{ headerShown: false }} />
        <Stack.Screen name='onboardingTime' options={{ headerShown: false }} />
        <Stack.Screen name='onboardingDeeptime' options={{ headerShown: false }} />
        <Stack.Screen name='onboardingProductive' options={{ headerShown: false }} />
        <Stack.Screen name='onboardingStopping' options={{ headerShown: false }} />
        <Stack.Screen name='onboardingWork' options={{ headerShown: false }} />
        <Stack.Screen name='onboardingWorkname' options={{ headerShown: false }} />
        <Stack.Screen name='onboardingWorktime' options={{ headerShown: false }} /> 
        <Stack.Screen name='onboardingSettingup' options={{ headerShown: false }} />
        <Stack.Screen name='onboardingResults' options={{ headerShown: false }} />
        <Stack.Screen name='onboardingPotential' options={{ headerShown: false }} />
      </Stack>
    </View>
  )
}

export default OnboardingLayout
