import { View, Text, ScrollView } from 'react-native'
import React,{useLocation} from 'react'
import {router} from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute } from '@react-navigation/native';
const setTask = () => {

  const route = useRoute();
  const { clicked } = route.params || {}; 
  console.log(clicked)

  return (
<SafeAreaView className="h-full bg-gray-800">
    <ScrollView>
        <View className="w-full justify-start items-center px-4 my-6">
        <Text className="text-2xl text-gray-100 font-psemibold">Set Task</Text>
        </View>
    </ScrollView>
</SafeAreaView>
  )
}

export default setTask