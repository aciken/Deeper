import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomPopup from '../components/BottomPopup';
import icons from '../../constants/icons';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalProvider';

const Tasks = () => {

  const { user } = useGlobalContext();

  const [goals, setGoals] = useState([]);
  // const [goals, setGoals] = useState([
  //   { id: 1, name: 'Complete project proposal' },
  //   { id: 2, name: 'Review code changes' },
  //   { id: 3, name: 'Prepare for team meeting' },
  // ]);

  useEffect(() => {
    axios.post('https://894b-188-2-139-122.ngrok-free.app/getGoals', { id: user._id })
    .then(res => {
      setGoals(res.data);
    })
    .catch(err => {
      console.log(err);
    })
  }, []);

  const [isTaskListVisible, setIsTaskListVisible] = useState(false);
  const [newWorkName, setNewWorkName] = useState('');
  const [newWorkColor, setNewWorkColor] = useState('#3498db'); // Default color
  const [newWorkTasks, setNewWorkTasks] = useState('');
  const [isJobVisible, setIsJobVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const jobSelected = (job) => {
    setSelectedJob(job);
    setIsJobVisible(true);
  }

  const addGoal = () => {
    setIsTaskListVisible(true);
  };

  const handleAddWork = () => {
    axios.post('https://894b-188-2-139-122.ngrok-free.app/addJob', { id: user._id, job: { name: newWorkName, color: newWorkColor, time: expectedDailyHours, count: 0 } })
    .then(res => {
      setGoals(res.data);
      setIsTaskListVisible(false);
      setNewWorkName('');
      setNewWorkColor('#3498db');
      setNewWorkTasks('');
      setExpectedDailyHours(0);
    })
    .catch(err => {
      console.log(err);
    })
  };

  const handleSuggestion = () => {
    // Here you would typically fetch a suggestion from an API
    console.log('Getting suggestion...');
  };
  
  const [expectedDailyHours, setExpectedDailyHours] = useState(0);

  return (
    <SafeAreaView className="h-full bg-gray-950">
      <ScrollView>
        <View className="w-full justify-start items-center px-4 my-6">
          {/* Upcoming Work Section */}
          <View className="w-full mb-8">
            <Text className="text-white text-2xl font-bold mb-4">Upcoming Work</Text>
            <View className="bg-gray-800 p-4 rounded-lg">
              <Text className="text-white text-lg">Team meeting at 2 PM</Text>
              <Text className="text-gray-400 mt-2">Discuss project milestones</Text>
            </View>
          </View>

          {/* Add Goal Button */}
          <TouchableOpacity 
            onPress={addGoal} 
            className="w-full bg-gray-800 border border-gray-700 p-4 rounded-lg mb-8 flex-row justify-center items-center"
          >
            <Image source={icons.plusGrad} className="w-8 h-8"  />
            <Text className="text-blue-500 text-lg font-bold ml-2">Add Work</Text>
          </TouchableOpacity>

          {/* Goals List Section */}
          <View className="w-full">
            <Text className="text-white text-2xl font-bold mb-4">Work</Text>
            {goals.map(goal => (
              <TouchableOpacity 
                key={goal.id} 
                className="bg-gray-800 p-4 rounded-lg mb-2 border border-gray-700 flex-row items-center"
                onPress={() => jobSelected(goal)}
              >
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: goal.color, marginRight: 10 }} />
                <Text className="text-white text-lg">{goal.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <BottomPopup
            visible={isTaskListVisible}
            onClose={() => setIsTaskListVisible(false)}
          >
            <View className="p-2 bg-gray-900 rounded-t-3xl">
              <Text className="text-white text-2xl font-bold mb-6">Add New Work</Text>
              
              <TextInput
                className="bg-gray-800 text-white p-4 rounded-xl mb-6 text-lg"
                placeholder="Work Name"
                placeholderTextColor="#666"
                value={newWorkName}
                onChangeText={setNewWorkName}
              />
              
              <Text className="text-white text-lg mb-3">Select Color:</Text>
              <View className="flex-row flex-wrap justify-center mb-6">
                {['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', 
                  '#d35400', '#34495e', '#27ae60', '#8e44ad', '#f1c40f', '#c0392b'].map((color, index) => (
                  <TouchableOpacity
                    key={`color-${index}`}
                    style={{ 
                      backgroundColor: color, 
                      width: 40, 
                      height: 40, 
                      borderRadius: 20,
                      borderWidth: newWorkColor === color ? 3 : 0,
                      borderColor: 'white',
                      margin: 5
                    }}
                    onPress={() => setNewWorkColor(color)}
                  />
                ))}
              </View>
              
              <Text className="text-white text-lg mb-3">Expected Daily Hours:</Text>
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={() => setExpectedDailyHours(Math.max(0, parseFloat(expectedDailyHours) - 0.5).toFixed(1))}
                  className="bg-gray-800 p-3 rounded-xl"
                >
                  <Text className="text-white text-xl">-</Text>
                </TouchableOpacity>
                <Text className="text-white text-2xl font-bold">{expectedDailyHours}</Text>
                <TouchableOpacity
                  onPress={() => setExpectedDailyHours((parseFloat(expectedDailyHours) + 0.5).toFixed(1))}
                  className="bg-gray-800 p-3 rounded-xl"
                >
                  <Text className="text-white text-xl">+</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                className="bg-blue-500 p-4 rounded-xl mb-4"
                onPress={handleAddWork}
              >
                <Text className="text-white text-center font-bold text-lg">Add Work</Text>
              </TouchableOpacity>
            </View>
          </BottomPopup>

          <BottomPopup
            visible={isJobVisible}
            onClose={() => setIsJobVisible(false)}
          >
            <View className="p-2 bg-gray-900 rounded-t-3xl">
              <Text className="text-white text-2xl font-bold mb-6">
                {selectedJob ? selectedJob.name : 'Job Details'}
              </Text>
              <Text className="text-white text-lg mb-6">
                time worked: {selectedJob ? selectedJob.count : '0'}
              </Text>
            </View>
          </BottomPopup>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Tasks;