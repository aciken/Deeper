import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert, Vibration, Animated } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios'
import { useGlobalContext } from '../context/GlobalProvider'
import Arrow from '../../assets/images/arrow.png'
import ClickableIcon from '../components/ClickableIcon';
import FormField from '../components/FormField';

const screenHeight = Dimensions.get('window').height;

const EditTask = () => {
    const {user, setUser} = useGlobalContext()
    const { clicked, index, task, all } = useLocalSearchParams();
    const [newAll, setNewAll] = useState(false);

    useEffect(() => {
        if(all == 'true'){
            setNewAll(true)
        }
    }, []);

    const taskArray = task.split(",");

    const hoursArray = Array.from({length: 24}, (_, i) => ({
        id: `hour_${i}`,
        value: (i === 0 ? 12 : i > 12 ? i - 12 : i).toString().padStart(2, '0')
    }));
    const minutesArray = Array.from({length: 60}, (_, i) => ({
        id: `minute_${i}`,
        value: i.toString().padStart(2, '0')
    }));

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

        axios.put('https://c4dc-188-2-139-122.ngrok-free.app/editWork', {
            data,
            email: user.email,
            index,
            clicked,
            newAll
        }).then(res => {
            if(res.data === 'Time overlap'){
                Alert.alert('Works are overlapping')
            } else {
                setUser(res.data);
                router.back();
            }
        }).catch((e) => {
            console.error(e);
        })
    }

    const deleteFunc = () => {
        axios.put('https://c4dc-188-2-139-122.ngrok-free.app/deleteWork', {
            email: user.email,
            index,
            clicked,
            newAll
        }).then(res => {
            setUser(res.data);
            router.back();
        }).catch((e) => {
            console.error(e);
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
                        Edit Deep Work
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
                                    setSelectedPart(selectedPart === "AM" ? "PM" : "AM");
                                    Vibration.vibrate(100);
                                }}
                                className="bg-gray-700 px-4 py-3 rounded-lg"
                            >
                                <Text className="text-3xl font-bold text-gray-300">{selectedPart}</Text>
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
                                    setSelectedPartEnd(selectedPartEnd === "AM" ? "PM" : "AM");
                                    Vibration.vibrate(100);
                                }}
                                className="bg-gray-700 px-4 py-3 rounded-lg"
                            >
                                <Text className="text-3xl font-bold text-gray-300">{selectedPartEnd}</Text>
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

                    <View className="flex-row justify-between space-x-4 mt-auto">
                        <CoolButton 
                            onPress={editFunc}
                            title="Save Changes"
                            color="blue"
                        />
                        <CoolButton 
                            onPress={deleteFunc}
                            title="Delete Task"
                            color="red"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

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
                            key={option.id}
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

const CoolButton = ({ onPress, title, color }) => {
    const [isPressed, setIsPressed] = useState(false);

    const getButtonStyle = () => {
        const baseStyle = "py-4 px-6 rounded-lg shadow-lg";
        const colorStyle = color === "blue" 
            ? "bg-blue-500" 
            : "bg-red-500";
        const pressedStyle = isPressed 
            ? "opacity-90 transform scale-95" 
            : "opacity-100 transform scale-100";
        
        return `${baseStyle} ${colorStyle} ${pressedStyle}`;
    };

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                className={getButtonStyle()}
                style={{
                    shadowColor: color === "blue" ? "#2563eb" : "#dc2626",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 8,
                }}
            >
                <Text className={`${color === 'blue' ? 'text-blue-200' : 'text-red-200'} font-bold text-center text-base`}>
                    {title}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default EditTask;