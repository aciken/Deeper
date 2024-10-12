import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomPopup from '../components/BottomPopup';
import icons from '../../constants/icons';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalProvider';
import { useRouter } from 'expo-router';

const Tasks = () => {

  const { user } = useGlobalContext();
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  // const [goals, setGoals] = useState([
  //   { id: 1, name: 'Complete project proposal' },
  //   { id: 2, name: 'Review code changes' },
  //   { id: 3, name: 'Prepare for team meeting' },
  // ]);

  useEffect(() => {
    console.log('Fetching goals...');
    axios.post('https://70ae-188-2-139-122.ngrok-free.app/getGoals', { id: user._id })
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
  const [nextTask, setNextTask] = useState([]);
  const [nextTaskIndex, setNextTaskIndex] = useState(0);
  const [dayToday, setDayToday] = useState(0);
  const jobSelected = (job) => {
    setSelectedJob(job);
    setIsJobVisible(true);
  }

  const addGoal = () => {
    setIsTaskListVisible(true);
  };

  const handleAddWork = () => {
    axios.post('https://70ae-188-2-139-122.ngrok-free.app/addJob', { id: user._id, job: { name: newWorkName, color: newWorkColor, time: expectedDailyHours, count: 0 } })
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

  useEffect(() => {
    console.log('Finding next task...');
    const getCurrentDayOfMonth = () => {
      const today = new Date();
      return today.getDate();
    };

    const currentDay = getCurrentDayOfMonth();
    setDayToday(currentDay);
    let smallestFifthElement = null;
    let smallestFifthElementIndex = -1;
    let dayToCheck = currentDay - 1;

    while (!smallestFifthElement && dayToCheck < user.array.length) {
      if (user.array[dayToCheck] && user.array[dayToCheck].length > 0) {
        user.array[dayToCheck].forEach((task, index) => {
          if (!smallestFifthElement || task[5] < smallestFifthElement[5]) {
            smallestFifthElement = task;
            smallestFifthElementIndex = index;
          }
        });
      }
      dayToCheck++;
    }

    if (smallestFifthElement) {
      console.log('Task with smallest fifth element:', smallestFifthElement);
      console.log('Index of task:', smallestFifthElementIndex);
      setNextTask(smallestFifthElement);
      setNextTaskIndex(smallestFifthElementIndex);
    } else {
      console.log('No tasks found in any day');
    }
  }, [user]);

  



  const openNextTask = () => {
    router.push({pathname: 'log/timer', params: {clicked: dayToday, index: nextTaskIndex, task: nextTask, currentLine: 0, all: []}})
  }
  
  const [expectedDailyHours, setExpectedDailyHours] = useState(0);

  return (
    <SafeAreaView className="h-full bg-gray-950">
      <ScrollView>

          {/* Upcoming Work Section */}

            <View className="w-full justify-start items-center px-4 my-6">
              <View className="w-full mb-8">
             <Text className="text-white text-2xl font-bold mb-4">Upcoming Work Session</Text>
             <TouchableOpacity onPress={openNextTask} className="bg-gray-800 p-4 rounded-lg">
                <Text className="text-white text-lg">{nextTask[2]} at {nextTask[0]}</Text>
                <Text className="text-gray-400 mt-2">{nextTask[3]}</Text>
              </TouchableOpacity>
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
            <View className="p-6 bg-gray-900 rounded-t-3xl">
              <Text className="text-white text-3xl font-bold mb-8 text-center">
                {selectedJob ? selectedJob.name : 'Job Details'}
              </Text>
              
              <View className="flex-row justify-between mb-8">
                <View className="items-center">
                  <Text className="text-gray-400 text-lg mb-2">Time Worked</Text>
                  <Text className="text-white text-4xl font-bold">
                    {selectedJob ? selectedJob.count : '0'}
                  </Text>
                  <Text className="text-gray-400 text-lg">hours</Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-400 text-lg mb-2">Daily Goal</Text>
                  <Text className="text-white text-4xl font-bold">
                    {selectedJob ? selectedJob.time : 'N/A'}
                  </Text>
                  <Text className="text-gray-400 text-lg">hours</Text>
                </View>
              </View>
              
              <View className="bg-gray-800 p-5 rounded-2xl mb-8">
                <View className="flex-row justify-between mb-4">
                  <View>
                    <Text className="text-gray-400 text-lg mb-1">Start Date</Text>
                    <Text className="text-white text-xl font-semibold">
                      {selectedJob ? selectedJob.startDate : 'N/A'}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-gray-400 text-lg mb-1">Last Worked</Text>
                    <Text className="text-white text-xl font-semibold">
                      {selectedJob ? selectedJob.lastWorked : 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity 
                className="bg-blue-600 p-4 rounded-xl"
                onPress={() => {/* Handle edit job */}}
              >
                <Text className="text-white text-center font-bold text-lg">Edit Job</Text>
              </TouchableOpacity>
            </View>
          </BottomPopup>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Tasks;