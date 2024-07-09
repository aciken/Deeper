import { View, Text, ScrollView } from 'react-native'
import {router,Redirect,Link} from 'expo-router'
import { SafeAreaView } from 'react-native'
import React,{useState,useEffect} from 'react'
import { StatusBar } from 'expo-status-bar'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Button from './components/Button'
import ImageButton from './components/ImageButton'

import { useGlobalContext } from './context/GlobalProvider'

import { BackHandler } from 'react-native'

import { useIsFocused } from '@react-navigation/native';




const index = () => {

  const {isLoading, isLogged} = useGlobalContext()

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && !isLogged && isLoading) {
      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }
  }, [isFocused]);


  if(!isLoading && isLogged){
    router.push('/home')
  }

  const [userInfo, setUserInfo] = useState(null)
  const [requset, response, promptAsync] = Google.useAuthRequest({
    

    androidClientId: '1003474212666-gqrbg8e8s288508ssmkqrq5f9l6q5mf8.apps.googleusercontent.com',
    webClientId: '1003474212666-jkpr0kqcpkhckv0qtfg2qo33plvqq97t.apps.googleusercontent.com',
  })

useEffect(() => {
  handleSignInWithGoogle();

}, [response])



  async function handleSignInWithGoogle(){
    const user = await AsyncStorage.getItem('@user');
    if(!user){
      if(response?.type === "success"){
        await getUserInfo(response.authentication.accessToken)
      }

    } else {
      setUserInfo(Json.parse(user))
    }
  }

  const getUserInfo = async (token) => {
    if(!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      setUserInfo(user);
    } catch (error){

    }
  }

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
            handlePress={() => promptAsync()}
            containerStyles="w-full mt-7 bg-white"
            textStyles={"text-blue-900"}
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