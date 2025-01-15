import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalContext } from '../context/GlobalProvider'
import axios from 'axios'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'


const VerifyDigits = () => {
    const {user,setUser } = useGlobalContext()
    const router = useRouter();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newDigits = [...digits];
    newDigits[index] = text;
    setDigits(newDigits);

    // Automatically focus the next input
    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleSubmit = () => {
    const verificationCode = digits.join('');

    axios.put('https://8814-109-245-203-91.ngrok-free.app/verify', {
      id: user._id,
      code: verificationCode
    })
    .then(res => {
        if(res.data != "failed"){
            setUser(res.data)
            router.push('/onboardingSettingup')
        } else{
            Alert.alert('Verification failed')
        }
    })
    .catch(err => {
      console.log(err);
    })
    console.log('Verification Code:', verificationCode);
  };

  const isComplete = digits.every(digit => digit !== '');

  const activeColors = ['#0ea5e9', '#3b82f6'];
  const inactiveColors = ['#3f3f46', '#27272a'];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-zinc-950 justify-center items-center p-6">
        <Text className="text-4xl font-bold mb-8 text-white text-center">Enter Verification Code</Text>
        <View className="flex-row justify-center mb-8">
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              className="bg-zinc-900 text-white text-xl font-semibold border border-zinc-800 p-4 m-2 w-12 h-12 text-center rounded-lg"
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              style={{ textAlign: 'center' }}
            />
          ))}
        </View>
        <TouchableOpacity 
          onPress={handleSubmit} 
          className="w-full h-14 rounded-2xl overflow-hidden"
          disabled={!isComplete}
        >
          <LinearGradient
            colors={isComplete ? activeColors : inactiveColors}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className="w-full h-full items-center justify-center"
          >
            <Text className="text-white text-lg font-semibold">Submit</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default VerifyDigits;
