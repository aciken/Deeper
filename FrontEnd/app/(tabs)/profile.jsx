import { View, Text, ScrollView,Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import {router} from 'expo-router'

import {icons} from '../../constants'
import ClickableIcon from '../components/ClickableIcon'

import { useGlobalContext } from '../context/GlobalProvider'

const Profile = () => {

  const {setIsLogged, setUser, setIsLoading} = useGlobalContext()

  const logout = () => {
    setIsLogged(false)
    setUser(null)
    setIsLoading(true)
    router.push('/')
  }

  return (
<SafeAreaView className="h-full bg-gray-950">
  <ScrollView>
    <View className="w-full justify-start items-center px-4 my-6 relative">
      <ClickableIcon
        ImageSource={icons.logout}
        handlePress={() => logout()}
        containerStyles=" top-0 right-4"
        imageStyle="w-6 h-6"
        />
      <Text className="text-2xl text-gray-100 font-psemibold">Profile</Text>
    </View>
  </ScrollView>
  </SafeAreaView>
  )
}

export default Profile