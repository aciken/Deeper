import { View, Text, ScrollView, Image, Alert, TouchableOpacity} from 'react-native'
import React,{useState,useEffect} from 'react'
import {router,Link} from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { LinearGradient } from 'expo-linear-gradient';




import Arrow from '../../assets/images/arrow.png'
import ClickableIcon from '../components/ClickableIcon'
import FormField from '../components/FormField'
import Button from '../components/Button'

import { useGlobalContext } from '../context/GlobalProvider'



const signin = () => {

  const {setIsLogged, setUser, setIsLoading} = useGlobalContext()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [updateUser, setUpdateUser] = useState(false)

  useEffect(() => {
    if (loginSuccess) {
      setIsLoading(false);
      setUpdateUser(false);
      setLoginSuccess(false);
      router.push('/Home'); 
    }
  }, [loginSuccess]);

  useEffect(() => {
    if(updateUser){
      setUser(updateUser)
      setUpdateUser(false)
    }
  }, [updateUser])


  const submit = () => {
    const {email, password} = form
    if(!email || !password){
      Alert.alert('Please fill in all fields')
      
    } else {


      console.log('Submitting')
    setIsSubmiting(true)
    
    axios.post('https://44ca-188-2-139-122.ngrok-free.app/login', {
      email,
      password
    }).then(res => {
      if(res.data !== 'failed'){
        setForm({email: '', password: ''})
        setUpdateUser(res.data)
        setIsLogged(true)
        setLoginSuccess(true)

        
      } else {
        Alert.alert('Invalid email or password');
      }
      setIsSubmiting(false)

    }).catch(() => {

      Alert.alert('An error occured')
      setIsSubmiting(false)
    })
  }
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
          <TouchableOpacity
          className="w-full h-16 bg-sky-400 rounded-lg items-center justify-center mt-10"
          onPress={() => submit()}
          >

            <Text className="text-lg font-psemibold text-gray-900">Sign In</Text>
          </TouchableOpacity>
          {/* <Button
          title="Sign In"
          containerStyles="mt-10 w-full bg-sky-300"
          isLoading={isSubmiting}
          handlePress={() => submit()}
          /> */}
          <View className="w-full flex-row justify-center mt-4">
            <Text className="text-lg font-pregular text-gray-400 mr-2">Don't have an account?</Text>
            <Link className='text-lg font-psemibold text-sky-400' href="/sign-up">Sign Up</Link>
            </View>




      </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default signin