import { View, Text, ScrollView } from 'react-native'
import {router,Redirect,Link} from 'expo-router'
import { SafeAreaView } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

import Button from './components/Button'
import ImageButton from './components/ImageButton'


const index = () => {
  return (
    <SafeAreaView className="bg-gray-800 h-full">
    <ScrollView contentContainerStyle={{ height: '100%' }}>
      <View className="w-full justify-around items-center h-full px-4 flex-col my-10">
        <View className="w-full flex-col justify-center items-center mb-10">
          <Text className="text-white text-3xl font-pbold">Welcome to Deeper</Text>
          <Text className="text-white text-lg font-pregular mt-8">Create Account to Continue</Text>
          <Button
            title="Continue with Email"
            handlePress={() => router.push('/sign-up')}
            containerStyles="w-full mt-7"
          />
          <ImageButton
            title="Continue with Google"
            handlePress={() => {}}
            containerStyles="w-full mt-7"
            ImageSource={require('../assets/images/google.png')}
          />
        </View>

        <View className="flex-row justify-center items-center w-full mt-10">
          <Text className="text-white text-lg font-pregular">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-500 text-lg font-psemibold underline">Sign in</Link>
          </Text>
        </View>
      </View>
    </ScrollView>
    <StatusBar
      backgroundColor='#1f2937'
      style='light'
    />
  </SafeAreaView>
  )
}

export default index