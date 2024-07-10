import { View, Text, ScrollView,TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import {router} from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router';

import { useGlobalContext } from '../context/GlobalProvider'
import TouchableText from '../components/TouchableText';
import VerticalSelect from '../components/VerticalSelect';

const setTask = ({route}) => {

  const { clicked } = useLocalSearchParams();


  console.log(`SETTT TASSKKSKSKSK ${clicked}`)


  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(12);
  const [selectedPart, setSelectedPart] = useState("AM");

  const [verticalMinutes, setVerticalMinutes] = useState(false);
  const [verticalHours, setVerticalHours] = useState(false);




  return (
<SafeAreaView className="h-full bg-gray-800 relative">
    <ScrollView>
        <View className="w-full flex-1 h-full justify-start items-center px-4 my-6">
            <View className="flex-row justify-center items-center space-x-3 pt-10 backdrop-blur">
              {!verticalHours ?
                      <TouchableText 
                      Title={selectedHour}
                      handlePress={() => {setVerticalHours(true)}}
                      TextStyle="text-5xl font-bold text-gray-200"
                      ContainerStyle={"rounded-xl"}
                    />
                    : 
                    <VerticalSelect 
                      numberStyle="text-5xl font-bold text-gray-200"
                      numberType="hour"
                      
                    />

              }

        <Text className="text-5xl font-bold text-gray-200 mr-2">:</Text>
        <TouchableText
          Title={selectedMinute}
          handlePress={() => {}}
          TextStyle="text-5xl font-bold text-gray-200"
          ContainerStyle={"rounded-xl"}
        />
        <TouchableText
          Title={selectedPart}
          handlePress={() => {if(selectedPart === "AM"){setSelectedPart("PM")}else{setSelectedPart("AM")} }}
          TextStyle="text-5xl font-bold text-gray-200"
          ContainerStyle={"rounded-xl ml-2"}
        />
</View>


        </View>
    </ScrollView>
</SafeAreaView>
  )
}

export default setTask