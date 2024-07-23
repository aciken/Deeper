import { View, Text, ScrollView,TouchableOpacity,PlaceholderComponent } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useGlobalContext } from '../context/GlobalProvider'
import {icons} from '../../constants'
import HourTable from '../components/HourTable';
import ImageButton from '../components/ImageButton';
import IconButton from '../components/IconButton';
import Button from '../components/Button';
import {useRouter, Redirect} from 'expo-router'
import { useNavigation } from '@react-navigation/native';

const Schedule = () => {

  let scrollNumber = 0;

  const {user, setSelected,selected } = useGlobalContext()

  const navigation = useNavigation();
  const router = useRouter();




  const todayDateNumber = new Date().getDate();



  
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
  const [all, setAll] = useState(false)

  const handlePress = () => {



        setSelected(clicked);
        router.push('setTask');
    
};

const [title, setTitle] = useState("One");





  if (!user) {

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
  user.array && user.array.map((element, index) => {
    if (index+1 > todayDateNumber - 1 && scrollNumber < 7) {
      scrollNumber++;
      return (
        <TouchableOpacity 
        key={index+1} onPress={() => setClicked(index+1)} className={`flex-col overflow-hidden justify-center items-center w-20 h-12 border-black border-1 ${title == 'All' ? 'bg-blue-500' : ''} ${index+1 == clicked ? `bg-blue-500` : ''}`}
          activeOpacity={0.9}
        >
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
    tasks = {all ? user.allArray : user.array[clicked-1]}
      clicked = {clicked}
      todayDateNumber = {todayDateNumber}
      all = {all}
    />
    <View className="flex-row">
      <IconButton
      ImageSource={icons.plusBlue}
      handlePress={() => router.push({ pathname: 'log/setTask', params: {clicked, all} })}
      containerStyles={`mt-2 w-full bg-blue-600 border border-blue-500 w-[30%] mx-2`}
      />
      <IconButton
      ImageSource={icons.listBlue}
      handlePress={() => router.push({ pathname: 'log/taskList', params: {clicked, all} })}
      containerStyles={`mt-2 w-full bg-blue-600 border border-blue-500 w-[30%] mx-2`}
      />
    <Button
      title={title}
      ImageSource={icons.newPlusIcon}
      handlePress={() => {if(title === 'One') {setAll(true); setTitle('All')} else {setAll(false); setTitle('One')}}}
      containerStyles={`mt-2 w-full ${title == 'One' ? 'bg-gray-700 border-gray-600' : 'bg-blue-600 border-blue-500'} border  w-[30%] mx-2`}
      textStyles={`text-blue-200`}
    />
    </View>
    </View>
  </SafeAreaView>
  )
}

export default Schedule