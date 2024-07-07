import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'

const home = () => {
  return (
<SafeAreaView className="h-full bg-gray-800">
  <ScrollView>
    <View className="w-full justify-start items-center px-4 my-6">
      <Text className="text-2xl text-gray-100 font-psemibold">Home</Text>
    </View>
  </ScrollView>
  </SafeAreaView>
  )
}

export default home