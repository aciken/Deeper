import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React,{useEffect} from 'react'
import { BackHandler } from 'react-native'
import axios from 'axios'

import { useIsFocused } from '@react-navigation/native';

import { useGlobalContext } from '../context/GlobalProvider'

const home = () => {

  const {user, setUser} = useGlobalContext()

  useEffect(() => {
    const email = user.email;
    console.log(email)
    axios.post('https://1d05-188-2-139-122.ngrok-free.app/getUser', {
       email 
    }).then(res => {
      setUser(res.data);
    }).catch((e) => {
      console.log(e);
    });
  }, []);

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