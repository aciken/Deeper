import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React,{useEffect} from 'react'
import { BackHandler } from 'react-native'

import { useIsFocused } from '@react-navigation/native';

const home = () => {

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }
  }, [isFocused]);

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