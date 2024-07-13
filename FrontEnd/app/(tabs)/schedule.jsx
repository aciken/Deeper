import { View, Text, ScrollView,TouchableOpacity,PlaceholderComponent } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useGlobalContext } from '../context/GlobalProvider'
import {icons} from '../../constants'
import HourTable from '../components/HourTable';
import ImageButton from '../components/ImageButton';
import {useRouter, Redirect} from 'expo-router'
import { useNavigation } from '@react-navigation/native';

const Schedule = () => {

  let scrollNumber = 0;

  const {user, setSelected,selected } = useGlobalContext()

  const navigation = useNavigation();
  const router = useRouter();


  useEffect(() => {
    console.log(user.array[clicked-1])
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
  const [isClicked, setIsClicked] = useState(false)

  const handlePress = () => {
    console.log('Button clicked');


        setSelected(clicked);
        router.push('setTask');
    
};





  // if (!user) {

  //   return <Redirect to="/" />;
  // }

  return (
<SafeAreaView className="h-full bg-gray-800">
    <View className="w-full flex-col justify-start items-center px-4 my-6 relative h-full">
    <View className="w-full h-12 flex-row justify-start items-center border-gray-600 rounded-xl border-2 overflow-hidden">
  <ScrollView
    horizontal={true}
    showsHorizontalScrollIndicator={false}
  >
{
  user.array && user.array.map((element, index) => {
    if (index+1 > todayDateNumber - 1 && scrollNumber < 7) {
      scrollNumber++;
      return (
        <TouchableOpacity key={index+1} onPress={() => setClicked(index+1)} className={`flex-col overflow-hidden justify-center items-center w-20 h-12 border-black border-1 ${index+1 == clicked ? `bg-blue-500` : ''}`}>
          <Text className="font-pbold text-gray-300">{index+1}</Text>
        </TouchableOpacity>
      );
    }
    return null; // Return null for elements that do not meet the condition
  })
}
  </ScrollView>
</View>
    <HourTable
      tasks = {user.array[clicked-1]}
      clicked = {clicked}
    />
    <ImageButton 
    title="Add Work Task"
    ImageSource={icons.newPlusIcon}
    handlePress={() => router.push({ pathname: 'log/setTask', params: {clicked} })}
    containerStyles={`mt-2 w-full bg-blue-500`}
    textStyles={`text-white`}
/>
    </View>
  </SafeAreaView>
  )
}

export default Schedule