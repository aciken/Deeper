import { View, Text, ScrollView, Image, Alert, TouchableOpacity} from 'react-native'
import React,{useState, useEffect} from 'react'
import {router,Link} from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'

import Arrow from '../../assets/images/arrow.png'
import ClickableIcon from '../components/ClickableIcon'
import FormField from '../components/FormField'
import Button from '../components/Button'

import { useGlobalContext } from '../context/GlobalProvider'


const signup = () => {

  const {setIsLogged, setUser, setIsLoading} = useGlobalContext()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false)

  useEffect(() => {
    if (loginSuccess) {
      setIsLoading(false);
      router.push('/home'); 
    }
  }, [loginSuccess]);

  const submit = () => {
    console.log('Submitting')
    const {name, email, password} = form
    setIsSubmiting(true)
    axios.post('https://44a8-188-2-139-122.ngrok-free.app/signup', {
      name, 
      email,
      password
    }).then(res => {
      console.log('reas')
      if(res.data !== 'exist'){
        setForm({email: '', password: '', name: ''})
        setUser(res.data);
        setIsLogged(true)
        setLoginSuccess(true)
        router.push('/Home')
      } else {
        Alert.alert('User already exist')  
      }
      setIsSubmiting(false)

    }).catch(() => {
      Alert.alert('An error occured')
      setIsSubmiting(false)
    })

  }


  return (
    <SafeAreaView className="bg-gray-950 h-full">
    <ScrollView contentContainerStyle={{ height: '100%' }}>
      <View className="w-full h-full justify-center items-start relative px-4">
        <ClickableIcon
          ImageSource={Arrow}
          handlePress={() => router.push('/')}
          containerStyles=" top-4 left-4"
          imageStyle="w-6 h-6"
        />

        <Text className="text-2xl font-pbold text-white">Sign Up</Text>
        <FormField
          title="Name"
          placeholder="Enter your name"
          value={form.name}
          handleTextChange={(e) => setForm({...form, name: e})}
          containerStyles="mt-7"
        />
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
          <TouchableOpacity
          className="w-full h-16 bg-sky-400 rounded-lg items-center justify-center mt-10"
          onPress={() => submit()}
          >

            <Text className="text-lg font-psemibold text-gray-900">Sign Up</Text>
          </TouchableOpacity>
          <View className="w-full flex-row justify-center mt-4">
            <Text className="text-lg font-pregular text-gray-400 mr-2">Already have Account?</Text>
            <Link className='text-lg font-psemibold text-sky-400' href="/sign-in">Sign In</Link>
            </View>




      </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default signup