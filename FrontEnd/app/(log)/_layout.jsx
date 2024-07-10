import {Text, View } from 'react-native'
import {Stack} from 'expo-router'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const LogLayout = () => {
  return (
    <View style={{ flex: 1 }}>
    <StatusBar backgroundColor='#1f2937' style='light' />
    <Stack>
      <Stack.Screen name='setTask' options={{ headerShown: false }} />
    </Stack>
  </View>
  )
}

export default LogLayout