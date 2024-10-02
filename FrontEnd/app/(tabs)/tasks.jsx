import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'

const Tasks = () => {
  return (
<SafeAreaView className="h-full bg-gray-950">
  <ScrollView>
    <View className="w-full justify-start items-center px-4 my-6">
      <Text className="text-2xl text-gray-100 font-psemibold">Tasks</Text>
    </View>
  </ScrollView>
  </SafeAreaView>
  )
}

export default Tasks