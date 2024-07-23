import { View, Text, ScrollView, Dimensions, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../context/GlobalProvider'
import { useLocalSearchParams } from 'expo-router';
import {icons} from '../../constants'

import Arrow from '../../assets/images/arrow.png'

import ClickableIcon from '../components/ClickableIcon';
import IconButton from '../components/IconButton';

const screenHeight = Dimensions.get('window').height;

const taskList = () => {

    const {user} = useGlobalContext()

    const { clicked, all} = useLocalSearchParams();

    const [newAll, setNewAll] = useState(false);



    console.log(user, clicked)

    console.log()

    // console.log(user.taks[clicked])

    const router = useRouter();

    const today = new Date();

    const [rightDate, setRightDate] = useState(today.toLocaleDateString('en-US', { month: 'long' }) + " " + clicked);

    useEffect(() => {
        if(all == 'true'){
            setNewAll(true)
            setRightDate('All')
        }
        }, [])


const originalArray = !newAll ? [...user.array[clicked-1]] : [...user.allArray];
console.log(originalArray)


  return (
<SafeAreaView className="h-full bg-gray-800 relative">
        <View style={{ height: screenHeight}} className={`w-full flex-col justify-start items-center p-4 relative`}>
        <ClickableIcon
              ImageSource={Arrow}
              handlePress={() => router.back()}
              containerStyles=" top-4 left-4"
              imageStyle="w-6 h-6"
            />

            <Text className="font-pbold text-2xl text-gray-200 text-center mb-4">{rightDate}</Text>
            {originalArray.length === 0 ? (
                <View className="w-full flex-col justify-center items-center">
                    <Text className="font-psemibold text-gray-200 text-lg">No tasks yet</Text>
                    <IconButton
                     ImageSource={icons.plusBlue}
                    handlePress={() => router.push({ pathname: 'log/setTask', params: {clicked, all}})}
                    containerStyles={`mt-2 w-full bg-blue-600 border border-blue-500`}
                     />
                </View>
            ) : (
                <View className="flex-col justify-start items-center w-full h-[95%]">
                    <ScrollView  className='w-full'
                    showsVerticalScrollIndicator={false}
                                  >

                        {newAll && user.allArray.sort((a, b) => a[3] - b[3]).map((task) => {
                          const originalIndex = originalArray.findIndex(originalTask => originalTask === task); // Step 2: Find original index
                          console.log(originalIndex)
                          return (
                              <TouchableOpacity key={originalIndex} className="w-full flex-row items-center justify-between h-20 bg-gray-700 rounded-xl border border-gray-600 p-2 mb-4"
                                  onPress={() => router.push({ pathname: 'log/editTask', params: { clicked, index: originalIndex, task, all } })}
                                  activeOpacity={0.8}
                              >
                                  <Text className="text-gray-200 text-lg font-psemibold">{task[2]}</Text>
                                  <Text className="text-gray-200 text-lg font-psemibold">{task[0]}-{task[1]}</Text>
                              </TouchableOpacity>
                          );
                      })}

                       {!newAll && user.array[clicked-1].sort((a, b) => a[3] - b[3]).map((task) => {
                          const originalIndex = originalArray.findIndex(originalTask => originalTask === task); // Step 2: Find original index
                          console.log(originalIndex)
                          return (
                              <TouchableOpacity key={originalIndex} className="w-full flex-row items-center justify-between h-20 bg-gray-700 rounded-xl border border-gray-600 p-2 mb-4"
                                  onPress={() => router.push({ pathname: 'log/editTask', params: { clicked, index: originalIndex, task, all } })}
                                  activeOpacity={0.8}
                              >
                                  <Text className="text-gray-200 text-lg font-psemibold">{task[2]}</Text>
                                  <Text className="text-gray-200 text-lg font-psemibold">{task[0]}-{task[1]}</Text>
                              </TouchableOpacity>
                          );
                      })}

                                  </ScrollView>
                                  <IconButton
                     ImageSource={icons.plusBlue}
                    handlePress={() => router.push({ pathname: 'log/setTask', params: {clicked, all}})}
                    containerStyles={`mt-2 w-full bg-blue-600 border border-blue-500`}
                     />


                </View>
            )}
            



        </View>

</SafeAreaView>
  )
}

export default taskList