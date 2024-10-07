import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'

const Tasks = () => {
  return (
<SafeAreaView className="h-full bg-gray-950">
  <ScrollView>
    <View className="w-full justify-start items-center px-4 my-6 p-4">
      <Text className="text-gray-100 text-2xl font-psemibold">No tasks yet</Text>
      <TouchableOpacity className="bg-sky-500 rounded-xl p-2 w-full text-center">
        <Text className="text-gray-100 font-psemibold text-lg w-full text-center">Add task</Text>
      </TouchableOpacity>

    </View>
  </ScrollView>
  </SafeAreaView>
  )
}

export default Tasks