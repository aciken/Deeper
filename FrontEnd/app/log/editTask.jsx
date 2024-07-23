import { View, Text, ScrollView,TouchableOpacity,Dimensions,Alert  } from 'react-native'
import React,{useState,useEffect} from 'react'
import {router} from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios'

import { useGlobalContext } from '../context/GlobalProvider'

  import Arrow from '../../assets/images/arrow.png'

import TouchableText from '../components/TouchableText';
import VerticalSelect from '../components/VerticalSelect';
import ClickableIcon from '../components/ClickableIcon';
import Button from '../components/Button';
import FormField from '../components/FormField';

const screenHeight = Dimensions.get('window').height;

const editTask = () => {

    const {user,setUser} = useGlobalContext()

    const { clicked, index,task } = useLocalSearchParams();

    useEffect(() => {
    console.log(task)
    }, []);

    const taskArray = task.split(",");


  
  

  
    const hoursArray = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutesArray = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));


  
  
    const [selectedHour, setSelectedHour] = useState(taskArray[0].slice(0, taskArray[0].indexOf(':')));
    const [selectedMinute, setSelectedMinute] = useState(taskArray[0].slice(taskArray[0].indexOf(':') + 1, taskArray[0].indexOf(':') + 3));
    const [selectedPart, setSelectedPart] = useState(taskArray[0].slice(-2));
  
    const [selcetedHourEnd, setSelectedHourEnd] = useState(taskArray[1].slice(0, taskArray[1].indexOf(':')));
    const [selectedMinuteEnd, setSelectedMinuteEnd] = useState(taskArray[1].slice(taskArray[1].indexOf(':') + 1, taskArray[1].indexOf(':') + 3));
    const [selectedPartEnd, setSelectedPartEnd] = useState(taskArray[1].slice(-2));
  
    const [workName, setWorkName] = useState(taskArray[2]);


  
    const [vertiaclHoursEnd, setVerticalHoursEnd] = useState(false);
    const [verticalMinutesEnd, setVerticalMinutesEnd] = useState(false);
  
    const [verticalMinutes, setVerticalMinutes] = useState(false);
    const [verticalHours, setVerticalHours] = useState(false);
  
  
    const handleSelectedMinutes = (minutes) => {
      setSelectedMinute(minutes);
      setVerticalMinutes(false);
  
    };
  
    const handleSelectHours = (hour) => {
      setSelectedHour(hour);
      setVerticalHours(false);
    };
  
    const handleSelectedMinutesEnd = (minutes) => {
      setSelectedMinuteEnd(minutes);
      setVerticalMinutesEnd(false);
  
    }
  
    const handleSelectHoursEnd = (hour) => {
      setSelectedHourEnd(hour);
      setVerticalHoursEnd(false);
    }

    const editFunc = () => {
        const start = `${selectedHour}:${selectedMinute} ${selectedPart}`;
        const end = `${selcetedHourEnd}:${selectedMinuteEnd} ${selectedPartEnd}`;
    
        const data  = [start,end, workName]

        axios.put('https://848d-188-2-139-122.ngrok-free.app/editWork', {
            data,
            email: user.email,
            index,
            clicked
        }).then(res => {
          if(res.data === 'Time overlap'){
            Alert.alert('Works are overlapping')
          } else {
            setUser(res.data);
            router.back();
          }

        }).catch((e) => {

        }
        )
    }

    const deleteFunc = () => {
        axios.put('https://848d-188-2-139-122.ngrok-free.app/deleteWork', {
            email: user.email,
            index,
            clicked
        }).then(res => {

                setUser(res.data);
                router.back();
        }).catch((e) => {

        })
    }


  return (
<SafeAreaView className="h-full bg-gray-800 relative">
    <ScrollView>
        <View style={{ height: screenHeight}} className={`w-full flex-coljustify-start items-center p-4 relative`}>
            <ClickableIcon
              ImageSource={Arrow}
              handlePress={() => router.back()}
              containerStyles=" top-4 left-4"
              imageStyle="w-6 h-6"
            />
          <Text className="text-white text-center font-medium text-3xl mt-10">Edit Deep Work</Text>
            <View>
              <View className="flex-row justify-center items-center space-x-3 pt-10 backdrop-blur h-[160px]">
              <Text className="text-2xl font-pbold text-gray-200 mr-4">START</Text>
              {!verticalHours ? (
              <TouchableText
                Title={selectedHour}
                handlePress={() => {setVerticalHours(true)}}
                TextStyle="text-5xl font-bold text-gray-200"
                ContainerStyle="rounded-xl"
              />
                        ) : (
              <View className="flex-row h-50 w-14">
                <ScrollView
                  className="flex-1 h-[160px] rounded-md bg-gray-700"
                  showsVerticalScrollIndicator={false}>
                  {hoursArray.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      className={`items-center justify-center p-2 rounded-md ${selectedHour === hour ? 'bg-blue-700' : 'bg-transparent'}`}
                      onPress={() => handleSelectHours(hour)}
                    >
                      <Text className="text-3xl font-bold text-gray-200 drop-shadow-2xl">{hour}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
                        )}
              
                      <Text className="text-5xl font-bold text-gray-200 mr-2">:</Text>
                      { !verticalMinutes ?
                      <TouchableText
                      Title={selectedMinute}
                      handlePress={() => {setVerticalMinutes(true)}}
                      TextStyle="text-5xl font-bold text-gray-200"
                      ContainerStyle={"rounded-xl"}
                    />
                    : (
                    <View className="flex-row h-50 w-14">
                    <ScrollView 
                      className="flex-1 h-[160px] rounded-md bg-gray-700"
                      showsVerticalScrollIndicator={false}>
                    {minutesArray.map((minutes) => (
                      <TouchableOpacity
                        key={minutes}
                        className={`items-center justify-center p-2 rounded-md ${selectedMinute === minutes ? 'bg-blue-700' : 'bg-transparent'}`}
                        onPress={() => handleSelectedMinutes(minutes)}
                      >
                        <Text className={`text-3xl font-bold text-gray-200 drop-shadow-2xl`}>{minutes}</Text>
                      </TouchableOpacity>
                    ))}
                      </ScrollView>
                      </View>
                    )
                      }
              
                      <TouchableText
                        Title={selectedPart}
                        handlePress={() => {if(selectedPart === "AM"){setSelectedPart("PM")}else{setSelectedPart("AM")} }}
                        TextStyle="text-5xl font-bold text-gray-200"
                        ContainerStyle={"rounded-xl ml-2"}
                      />
              </View>
            </View>

<View className="flex-row justify-center items-center space-x-3 pt-10 backdrop-blur h-[160px]">
<Text className="text-2xl font-pbold text-gray-200 mr-10">END</Text>
            {!vertiaclHoursEnd ? (
            <TouchableText 
              Title={selcetedHourEnd}
              handlePress={() => {setVerticalHoursEnd(true)}}
              TextStyle="text-5xl font-bold text-gray-200"
              ContainerStyle="rounded-xl"
            />
          ) : (
            <View className="flex-row h-50 w-14">
              <ScrollView 
                className="flex-1 h-[160px] rounded-md bg-gray-700"
                showsVerticalScrollIndicator={false}>
                {hoursArray.map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    className={`items-center justify-center p-2 rounded-md ${selcetedHourEnd === hour ? 'bg-blue-700' : 'bg-transparent'}`}
                    onPress={() => handleSelectHoursEnd(hour)}
                  >
                    <Text className="text-3xl font-bold text-gray-200 drop-shadow-2xl">{hour}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

        <Text className="text-5xl font-bold text-gray-200 mr-2">:</Text>
        { !verticalMinutesEnd ?
        <TouchableText
        Title={selectedMinuteEnd}
        handlePress={() => {setVerticalMinutesEnd(true)}}
        TextStyle="text-5xl font-bold text-gray-200"
        ContainerStyle={"rounded-xl"}
      />
      : (
      <View className="flex-row h-50 w-14">
      <ScrollView 
        className="flex-1 h-[160px] rounded-md bg-gray-700"
        showsVerticalScrollIndicator={false}>
      {minutesArray.map((minutes) => (
        <TouchableOpacity
          key={minutes}
          className={`items-center justify-center p-2 rounded-md ${selectedMinuteEnd === minutes ? 'bg-blue-700' : 'bg-transparent'}`}
          onPress={() => handleSelectedMinutesEnd(minutes)}
        >
          <Text className={`text-3xl font-bold text-gray-200 drop-shadow-2xl`}>{minutes}</Text>
        </TouchableOpacity>
      ))}
        </ScrollView>
        </View>
      )
        }

        <TouchableText
          Title={selectedPartEnd}
          handlePress={() => {if(selectedPartEnd === "AM"){setSelectedPartEnd("PM")}else{setSelectedPartEnd("AM")} }}
          TextStyle="text-5xl font-bold text-gray-200"
          ContainerStyle={"rounded-xl ml-2"}
        />
</View>

<FormField
          title="Deep Work Name"
          placeholder="Enter Task Name"
          value={workName}
          handleTextChange={(e) => {setWorkName(e)}}
          containerStyles="mt-7"
          />

        


        <View className="absolute bottom-2 w-full flex-row items-center justify-between space-x-2">
        <Button 
          title="Save"
          containerStyles="bg-blue-500 w-[48%] rounded-2xl"
          textStyles="text-blue-200"
          handlePress={() => {editFunc()}}
        />
        <Button 
            title="Delete"
            containerStyles="bg-red-500 w-[48%] rounded-2xl"
            textStyles="text-red-200"
            handlePress={() => {deleteFunc()}}
        />
        </View>


        

        </View>
    </ScrollView>
</SafeAreaView>
  )
}

export default editTask