import { View, Text, ScrollView, Image, Alert, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { router,useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { icons } from '../../constants';
import axios from 'axios';


const ForgotPasswordReset = () => {
  const { email } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');



  const submit = () => {
    if (!password || !repeatPassword) {
      Alert.alert('Please fill in both password fields');
      return;
    }
    if (password !== repeatPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    // Add logic to handle password reset
    axios.post('https://8814-109-245-203-91.ngrok-free.app/forgotPasswordReset', {
      password,email
    })
    .then((res) => {
        console.log(res.data)
      if(res.data == 'success') {
        Alert.alert('Password reset successful');
        router.push('/sign-in');
      } else {
        Alert.alert('Failed to reset password');
      }
    })
    .catch((err) => {
      console.log(err);
      Alert.alert('An error occurred, please try again later');
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 justify-center">
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.push('/sign-in')}
            className="absolute top-4 left-6 w-10 h-10 rounded-xl bg-zinc-900/80 items-center justify-center"
          >
            <Image source={icons.backIcon} className="w-5 h-5 tint-zinc-400" />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-12">
            <MaskedView
              maskElement={
                <Text className="text-4xl font-bold mb-2">Reset Password</Text>
              }
            >
              <LinearGradient
                colors={['#D4D4D8', '#71717A']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
              >
                <Text className="text-4xl font-bold mb-2 opacity-0">Reset Password</Text>
              </LinearGradient>
            </MaskedView>
            <Text className="text-zinc-500 text-lg">Enter your new password</Text>
          </View>

          {/* Password Inputs */}
          <View className="space-y-6">
            <View>
              <Text className="text-zinc-400 text-base mb-2">Password</Text>
              <View className="bg-zinc-900/80 rounded-xl overflow-hidden border border-zinc-800">
                <TextInput
                  placeholder="Enter new password"
                  placeholderTextColor="#52525b"
                  value={password}
                  onChangeText={setPassword}
                  className="px-4 py-3.5 text-base text-white"
                  secureTextEntry
                />
              </View>
            </View>
            <View>
              <Text className="text-zinc-400 text-base mb-2">Repeat Password</Text>
              <View className="bg-zinc-900/80 rounded-xl overflow-hidden border border-zinc-800">
                <TextInput
                  placeholder="Repeat new password"
                  placeholderTextColor="#52525b"
                  value={repeatPassword}
                  onChangeText={setRepeatPassword}
                  className="px-4 py-3.5 text-base text-white"
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            onPress={submit}
            className="mt-8 w-full h-14 rounded-2xl overflow-hidden"
          >
            <LinearGradient
              colors={['#0ea5e9', '#3b82f6']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              className="w-full h-full items-center justify-center"
            >
              <Text className="text-white text-lg font-semibold">Reset Password</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordReset;
