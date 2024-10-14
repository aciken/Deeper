import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomPopup from '../components/BottomPopup';
import icons from '../../constants/icons';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalProvider';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const Tasks = () => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [presets, setPresets] = useState([]);
  const [isWorkVisible, setIsWorkVisible] = useState(false);
  const [isPresetVisible, setIsPresetVisible] = useState(false);
  const [futureWork, setFutureWork] = useState([]);

  useEffect(() => {
    fetchGoals();
    fetchPresets();
    fetchFutureWork();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.post('https://c6b9-188-2-139-122.ngrok-free.app/getGoals', { id: user._id });
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const fetchPresets = async () => {
    try {
      const response = await axios.post('https://c6b9-188-2-139-122.ngrok-free.app/getPresets', { id: user._id });
      setPresets(response.data);
    } catch (error) {
      console.error('Error fetching presets:', error);
    }
  };

  const fetchFutureWork = async () => {
    // This is a placeholder. In a real app, you'd fetch future work from your backend
    setFutureWork([
      { id: 1, name: "Project A", dueDate: "Next Week" },
      { id: 2, name: "Task B", dueDate: "In 2 days" },
      { id: 3, name: "Meeting C", dueDate: "Tomorrow" },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView className="flex-1 px-4">
        <View className="my-6">
          <TouchableOpacity 
            onPress={() => router.push({pathname: 'log/SchedulePage'})}  
            className="w-full rounded-xl overflow-hidden shadow-lg"
          >
            <LinearGradient
              colors={['#38bdf8', '#1d4ed8']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              className="w-full h-16 flex-row justify-center items-center"
            >
              <Image source={icons.calendar} className="w-6 h-6 mr-2 tint-white" />
              <Text className="text-white text-lg font-semibold">Schedule</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between mb-6">
          <TouchableOpacity 
            onPress={() => setIsWorkVisible(true)} 
            className="w-[48%] bg-gray-800 border border-gray-700 p-4 rounded-xl flex-row justify-center items-center"
          >
            <Image source={icons.work} className="w-6 h-6 mr-2 tint-white" />
            <Text className="text-white text-lg font-bold">Work</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setIsPresetVisible(true)} 
            className="w-[48%] bg-gray-800 border border-gray-700 p-4 rounded-xl flex-row justify-center items-center"
          >
            <Image source={icons.presets} className="w-6 h-6 mr-2 tint-white" />
            <Text className="text-white text-lg font-bold">Presets</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-white text-2xl font-bold mb-4">Upcoming Work</Text>
          {futureWork.map(work => (
            <View key={work.id} className="bg-gray-800 p-4 rounded-xl mb-3 border border-gray-700">
              <Text className="text-white text-lg font-semibold">{work.name}</Text>
              <Text className="text-gray-400 mt-1">Due: {work.dueDate}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomPopup
        visible={isWorkVisible}
        onClose={() => setIsWorkVisible(false)}
      >
        <View className="p-6 bg-gray-900 rounded-t-3xl">
          <Text className="text-white text-2xl font-bold mb-6 text-center">Work</Text>
          {goals.map(goal => (
            <TouchableOpacity 
              key={goal.id} 
              className="bg-gray-800 p-4 rounded-xl mb-3 border border-gray-700 flex-row items-center"
            >
              <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: goal.color, marginRight: 12 }} />
              <Text className="text-white text-lg flex-1">{goal.name}</Text>
              <Text className="text-gray-400">{goal.count}h / {goal.time}h</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            className="bg-blue-500 p-4 rounded-xl mt-4 flex-row justify-center items-center"
            onPress={() => {/* Handle add work */}}
          >
            <Image source={icons.plus} className="w-5 h-5 mr-2 tint-white" />
            <Text className="text-white text-center font-bold text-lg">Add New Work</Text>
          </TouchableOpacity>
        </View>
      </BottomPopup>

      <BottomPopup
        visible={isPresetVisible}
        onClose={() => setIsPresetVisible(false)}
      >
        <View className="p-6 bg-gray-900 rounded-t-3xl">
          <Text className="text-white text-2xl font-bold mb-6 text-center">Presets</Text>
          {presets.map((preset, index) => (
            <TouchableOpacity 
              key={index}
              className="bg-gray-800 p-4 rounded-xl mb-3 border border-gray-700 flex-row items-center"
            >
              <Image source={icons.preset} className="w-6 h-6 mr-3 tint-white" />
              <View className="flex-1">
                <Text className="text-white text-lg">{preset.name}</Text>
                <Text className="text-gray-400 mt-1">{preset.jobs.length} jobs</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            className="bg-blue-500 p-4 rounded-xl mt-4 flex-row justify-center items-center"
            onPress={() => {/* Handle create preset */}}
          >
            <Image source={icons.plus} className="w-5 h-5 mr-2 tint-white" />
            <Text className="text-white text-center font-bold text-lg">Create New Preset</Text>
          </TouchableOpacity>
        </View>
      </BottomPopup>

      <View className="px-4 pb-2">
        <TouchableOpacity 
          onPress={() => {}}
          className="w-full rounded-xl overflow-hidden shadow-lg"
        >
          <LinearGradient
            colors={['#0ea5e9', '#60a5fa']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className="w-full h-14 flex-row justify-center items-center"
          >
            <Image source={icons.play} className="w-6 h-6 mr-2 tint-white" />
            <Text className="text-white text-lg font-semibold">Start Session</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Tasks;
