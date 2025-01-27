import {Text, View } from 'react-native'
import {Stack} from 'expo-router'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const PagesLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor='#030712' style='light' />
      <Stack>
        <Stack.Screen name='WorkPage' options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </View>
  )
}

export default PagesLayout
