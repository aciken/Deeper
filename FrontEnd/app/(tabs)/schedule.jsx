import { View, Text, ScrollView,TouchableOpacity,PlaceholderComponent } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useGlobalContext } from '../context/GlobalProvider'
import {icons} from '../../constants'
import HourTable from '../components/HourTable';
import ImageButton from '../components/ImageButton';
import {router, Redirect} from 'expo-router'
import { useNavigation } from '@react-navigation/native';

const schedule = ({history}) => {

  const {user, setUser} = useGlobalContext()

  const navigation = useNavigation();



  useEffect(() => {
    console.log(user)
  }, []);

  const todayDateNumber = new Date().getDate();
  console.log(todayDateNumber)  

//   const getThreeNextDays = () => {
//     const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     const today = new Date().getDay(); // Today's day number
  
//     const nextThreeDays = [1, 2, 3].map(offset => dayNames[(today + offset) % 7]);
//     return nextThreeDays;
//   };

//   const [nextDay1, nextDay2, nextDay3] = getThreeNextDays();
// console.log(nextDay1, nextDay2, nextDay3); 

  const [clicked, setClicked] = useState(todayDateNumber)

  const handleNavigate = () => {
    navigation.navigate('(log)', {
      screen: 'addTask',
      params: { clicked },
    });
  };

  if (!user) {
    // Handle the case where userData is null - maybe render a placeholder or redirect
    return <Redirect to="/" />;
  }

  return (
<SafeAreaView className="h-full bg-gray-800">
    <View className="w-full flex-col justify-start items-center px-4 my-6 relative h-full">
    <View className="w-full h-12 flex-row justify-start items-center border-gray-600 rounded-xl border-2 overflow-hidden">
  <ScrollView
    horizontal={true}
    showsHorizontalScrollIndicator={false}
  >
    {
      user.Schedule && user.Schedule.map((day, index) => {
        if (day.day > todayDateNumber - 1) {
          return (
            <TouchableOpacity  key={index} onPress={() => setClicked(day.day)} className={`flex-col overflow-hidden justify-center items-center w-20 h-12 border-black border-1 ${day.day == clicked ? `bg-gray-600` : ''}`}>
              <Text className="font-pbold text-gray-300">{day.day}</Text>
            </TouchableOpacity>
          );
        }
        return null; // Return null for dates that do not meet the condition
      })
    }
  </ScrollView>
</View>
    <HourTable/>
    <ImageButton 
    title="Add Work Task"
    ImageSource={icons.newPlusIcon}
    handlePress={() => {handleNavigate()}}
    containerStyles={`mt-2 w-full bg-blue-500`}
    textStyles={`text-white`}
    />
    </View>
  </SafeAreaView>
  )
}

export default schedule