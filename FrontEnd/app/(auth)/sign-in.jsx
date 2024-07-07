import { View, Text, ScrollView, Image} from 'react-native'
import React,{useState} from 'react'
import {router,Link} from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import Arrow from '../../assets/images/arrow.png'
import ClickableIcon from '../components/ClickableIcon'
import FormField from '../components/FormField'
import Button from '../components/Button'



const signin = () => {

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [isSubmiting, setIsSubmiting] = useState(false)


  return (
    <SafeAreaView className="bg-gray-800 h-full">
    <ScrollView contentContainerStyle={{ height: '100%' }}>
      <View className="w-full h-full justify-center items-start relative px-4">
        <ClickableIcon
          ImageSource={Arrow}
          handlePress={() => router.push('/')}
          containerStyles=" top-4 left-4"
          imageStyle="w-6 h-6"
        />

        <Text className="text-2xl font-pbold text-white">Sign In</Text>
        <FormField
          title="Email"
          placeholder="Enter your email"
          value={form.email}
          handleTextChange={(e) => setForm({...form, email: e})}
          containerStyles="mt-7"
        />
        <FormField
          title="Password"
          placeholder="Enter your password"
          value={form.password}
          handleTextChange={(e) => setForm({...form, password: e})}
          containerStyles="mt-7"
          />
          <View className="w-full flex-row justify-end">
            <Link className='text-base text-gray-500 mt-2 underline' href="/">Forgot Passowrd</Link>
          </View>
          <Button
          title="Sign In"
          containerStyles="mt-10 w-full"
          isLoading={isSubmiting}
          handlePress={() => console.log('Sign In')}
          />
          <View className="w-full flex-row justify-center mt-4">
            <Text className="text-lg font-pregular text-gray-400 mr-2">Don't have an account?</Text>
            <Link className='text-lg font-psemibold text-blue-500' href="/sign-up">Sign Up</Link>
            </View>




      </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default signin