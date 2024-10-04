import { View, Text, ScrollView,TouchableOpacity,Dimensions,Alert,Vibration, Animated } from 'react-native'
import React,{useEffect, useState} from 'react'
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

const setTask = ({route}) => {

  const {user,setUser} = useGlobalContext()

  const { clicked, all } = useLocalSearchParams();

  const [newAll, setNewAll] = useState(false);

  useEffect(() => {
    if(all == 'true'){
      setNewAll(true) 
    }   
  }, [])




  // Updated hours array to cover full 24 hours
  const hoursArray = Array.from({length: 24}, (_, i) => ({
    id: `hour_${i}`,
    value: (i === 0 ? 12 : i > 12 ? i - 12 : i).toString().padStart(2, '0')
  }));

  const minutesArray = Array.from({length: 60}, (_, i) => ({
    id: `minute_${i}`,
    value: i.toString().padStart(2, '0')
  }));

  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');

  const [selcetedHourEnd, setSelectedHourEnd] = useState('01');
  const [selectedMinuteEnd, setSelectedMinuteEnd] = useState('00');
  const [selectedPeriodEnd, setSelectedPeriodEnd] = useState('AM');

  const [workName, setWorkName] = useState('Deep Work');

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

  const submitWork = () => {
    const start = `${selectedHour}:${selectedMinute}`;
    const end = `${selcetedHourEnd}:${selectedMinuteEnd}`;

    const data  = [start,end, workName]


    axios.put('https://c4dc-188-2-139-122.ngrok-free.app/addWork', {
      data,
      email: user.email,
      clicked,
      newAll
    }).then(res => {
      if(res.data == 'Time overlap'){
        Alert.alert('Works are overlapping')
      } else {
        setUser(res.data);
        router.push('/Schedule')
      }
      // if(res.data.message == 'Time overlap'){
      //   Alert.alert('Works are overlapping')
      // } else {
      //   console.log('reas')
      //   setUser(res.data);
      //   router.push('/Schedule')
      // }
    }).catch(err => {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx



      } else if (err.request) {
        // The request was made but no response was received

      } else {
        // Something happened in setting up the request that triggered an Error

      }
    })
  }



  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
        <View className="flex-1 p-6">
          <ClickableIcon
            ImageSource={Arrow}
            handlePress={() => router.back()}
            containerStyles="absolute top-6 left-6 z-10"
            imageStyle="w-8 h-8 text-gray-300"
          />
          
          <Text className="text-white text-center font-bold text-3xl mt-16 mb-10">
            Create New Deep Work
          </Text>

          <View className="bg-gray-800 rounded-xl p-6 mb-8 z-10">
            <Text className="text-xl font-semibold text-gray-300 mb-4">Start Time</Text>
            <View className="flex-row justify-between items-center space-x-2">
              <View className="flex-1" style={{ zIndex: 3 }}>
                <TimeSelector
                  value={selectedHour}
                  options={hoursArray}
                  onSelect={handleSelectHours}
                  isOpen={verticalHours}
                  setIsOpen={setVerticalHours}
                />
              </View>
              <Text className="text-4xl font-bold text-gray-300">:</Text>
              <View className="flex-1" style={{ zIndex: 2 }}>
                <TimeSelector
                  value={selectedMinute}
                  options={minutesArray}
                  onSelect={handleSelectedMinutes}
                  isOpen={verticalMinutes}
                  setIsOpen={setVerticalMinutes}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedPeriod(selectedPeriod === "AM" ? "PM" : "AM");
                  Vibration.vibrate(100);
                }}
                className="bg-gray-700 px-4 py-3 rounded-lg"
              >
                <Text className="text-3xl font-bold text-gray-300">{selectedPeriod}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-gray-800 rounded-xl p-6 mb-8">
            <Text className="text-xl font-semibold text-gray-300 mb-4">End Time</Text>
            <View className="flex-row justify-between items-center space-x-2">
              <View className="flex-1">
                <TimeSelector
                  value={selcetedHourEnd}
                  options={hoursArray}
                  onSelect={handleSelectHoursEnd}
                  isOpen={vertiaclHoursEnd}
                  setIsOpen={setVerticalHoursEnd}
                />
              </View>
              <Text className="text-4xl font-bold text-gray-300">:</Text>
              <View className="flex-1">
                <TimeSelector
                  value={selectedMinuteEnd}
                  options={minutesArray}
                  onSelect={handleSelectedMinutesEnd}
                  isOpen={verticalMinutesEnd}
                  setIsOpen={setVerticalMinutesEnd}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedPeriodEnd(selectedPeriodEnd === "AM" ? "PM" : "AM");
                  Vibration.vibrate(100);
                }}
                className="bg-gray-700 px-4 py-3 rounded-lg"
              >
                <Text className="text-3xl font-bold text-gray-300">{selectedPeriodEnd}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FormField
            title="Deep Work Name"
            placeholder="Enter Task Name"
            value={workName}
            handleTextChange={setWorkName}
            containerStyles="mb-8"
          />

          <Button 
            title="Submit"
            containerStyles="w-full bg-blue-600 py-4 rounded-xl"
            textStyles="text-white font-bold text-lg"
            handlePress={submitWork}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// New TimeSelector component
const TimeSelector = ({ value, options, onSelect, isOpen, setIsOpen }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const scaleY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={{ zIndex: 1 }}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className="bg-gray-700 px-4 py-3 rounded-lg flex-row justify-between items-center"
      >
        <Text className="text-3xl font-bold text-gray-300">{value}</Text>
        <Text className="text-gray-400 text-lg">
          {isOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      <Animated.View 
        style={{ 
          transform: [{ scaleY }],
          opacity: animation,
          height: 150,
          overflow: 'hidden',
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <ScrollView
          className="flex-1 bg-gray-700 rounded-b-lg"
          showsVerticalScrollIndicator={false}
        >
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}  // Use the unique id as the key
              className={`items-center justify-center p-3 border-t border-gray-600 ${
                value === option.value ? 'bg-blue-600' : 'bg-transparent'
              }`}
              onPress={() => {
                onSelect(option.value);
                setIsOpen(false);
                Vibration.vibrate(100);
              }}
            >
              <Text className={`text-2xl font-bold ${
                value === option.value ? 'text-white' : 'text-gray-300'
              }`}>
                {option.value}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default setTask