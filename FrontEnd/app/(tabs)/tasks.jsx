import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomPopup from '../components/BottomPopup';
import icons from '../../constants/icons';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalProvider';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import AlertPopup from '../components/AlertPopup';



const Tasks = () => {
  const { user, setUser } = useGlobalContext();
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [presets, setPresets] = useState([]);
  const [isWorkVisible, setIsWorkVisible] = useState(false);
  const [isPresetVisible, setIsPresetVisible] = useState(false);
  const [futureWork, setFutureWork] = useState([]);

  const [isWorkDropdownVisible, setIsWorkDropdownVisible] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
	const [duration, setDuration] = useState({ hours: 0, minutes: 0 });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [nextTaskIndex, setNextTaskIndex] = useState(null);


  const [isStartSessionPopupVisible, setIsStartSessionPopupVisible] = useState(false);
  const [isWorkEditPopupVisible, setIsWorkEditPopupVisible] = useState(false);

  const [works, setWorks] = useState(user.work);

  const [currentTime, setCurrentTime] = useState(0);
  
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const timerSlideAnim = useRef(new Animated.Value(400)).current;
  const timerOpacityAnim = useRef(new Animated.Value(0)).current;

  const [timeInSeconds, setTimeInSeconds] = useState(0);

  const [isSessionPageVisible, setIsSessionPageVisible] = useState(false);

  useEffect(() => {
    const updateCurrentLine = () => {
      const currentTime = new Date();
      const hours24 = currentTime.getHours();
      const minutes = currentTime.getMinutes();

      let newCurrentLine = 10 + hours24 * 20 + minutes / 3;

      setCurrentTime(newCurrentLine);
    };

    updateCurrentLine();
    const intervalId = setInterval(updateCurrentLine, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   const currentDate = new Date();
  //   const dayOfMonth = currentDate.getDate();



  //   works.forEach(work => {
  //     let timeWorked = 0;
  //   user.array[dayOfMonth-1].forEach(task => {
  //     console.log(task[5], task[4])
  //     if(task[3].name === work.name && task[5] <= currentTime-10){
  //       timeWorked += task[5] - task[4]
  //     }
  //   })
  //   // Round timeWorked to the nearest integer
  //   timeWorked = Math.round(timeWorked);
  //   axios.put('https://44ca-188-2-139-122.ngrok-free.app/updateWeeklyWork', {
  //     work,
  //     timeWorked,
  //     id: user._id,
  //   }).then(res => {
  //     setWorks(res.data)
  //     })
  //   })
  // }, [currentTime])

    // console.log(currentTime-10)
    // const hours = Math.floor(timeWorked / 20);
    // const minutes = Math.round((timeWorked / 20 - hours) * 60);
    // const time = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    



    // return time

    const getWorkTime = (name) => {
      const job = works.find(work => work.name === name);

    const hours = Math.floor(job.weeklyWork / 20);
    const minutes = Math.round((job.weeklyWork / 20 - hours) * 60);
    const time = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
      return time
    }

    const isItDone = (totalTime, currentTime) => {
      const parseTime = (time) => {
        const [hours, minutes] = time.split('h');
        return parseInt(hours) * 60 + parseInt(minutes || 0);
      };

      const totalMinutes = parseTime(totalTime);
      const currentMinutes = parseTime(currentTime);

      return currentMinutes >= totalMinutes;
    }

    const [alertPopupVisible, setAlertPopupVisible] = useState(false);
    const [alertPopupMessage, setAlertPopupMessage] = useState('');
    const [alertPopupType, setAlertPopupType] = useState('info');





  

  // const works = [
  //   {
  //     name: "Mobile app",
  //     colors: ['#0EA5E9', '#085D83'],
  //     currentTime: 22,
  //     totalTime: 40
  //   },
  //   {
  //     name: "School",
  //     colors: ['#DC2626', '#761414'],
  //     currentTime: 9,
  //     totalTime: 8,
  //   },
  //   {
  //     name: "Learning Coding",
  //     colors: ['#22C55E', '#105F2D'],
  //     currentTime: 7,
  //     totalTime: 8,
  //   }
  // ]



  const ballColors = [
    ['#DC2626', '#761414'],
    ['#16A34A', '#083D1C'],
    ['#2563EB', '#153885'],
    ['#9333EA', '#531D84'],
    ['#FACC15', '#94790C'],
    ['#0EA5E9', '#085D83'],
    ['#EC4899', '#862957'],
  ]

  


const [newWork, setNewWork] = useState({
  name: '',
  colors: ['', ''],
  currentTime: '1h',
})
const [editIndex, setEditIndex] = useState(null)

const [editWork, setEditWork] = useState({
  name: '',
  colors: ['', ''],
  currentTime: '1h',
})


const [initialEditWork, setInitialEditWork] = useState({
  name: '',
  colors: ['', ''],
  currentTime: '1h',
})

// useEffect(() => {
//     axios.put('https://2727-188-2-139-122.ngrok-free.app/restartNumber', {
//       id: user._id,
//     }).then(res => {
//       setUser(res.data)
//       setWorks(res.data.work)
//     })
// }, [])


const openEditWork = (work, index) => {
  setEditWork(work)
  setInitialEditWork(work)
  setEditIndex(index)
  setIsWorkEditPopupVisible(true)
}

const onTimeChange = (event, selectedTime) => {
  setShowTimePicker(Platform.OS === 'ios');
  if (selectedTime) {
    setDuration({
      hours: selectedTime.getHours(),
      minutes: selectedTime.getMinutes(),
    });
  }
};

const workToday = (job) => {
  const currentDate = new Date();
  const dayOfMonth = currentDate.getDate();

  let timeWorked = 0;
  user.array[dayOfMonth-1].forEach(task => {
    if(task[5] < currentTime-10 && findTaskById(task[3]).name === job.name){
      timeWorked += task[5] - task[4]
    }
    
  })
  timeWorked = Math.round(timeWorked);

  const hours = Math.floor(timeWorked / 20);
  const minutes = Math.round((timeWorked / 20 - hours) * 60);
  const time = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  return time

}



const submitNewWork = () => {
  axios.put('https://eb98-188-2-139-122.ngrok-free.app/addJob', {
    newWork,
    id: user._id,
  }).then(res => {
    setWorks(res.data.work)
    setUser(res.data)
    setIsWorkVisible(false)
    setNewWork({
      name: '',
      colors: ['', ''],
      currentTime: '1h',
    })
  })
}

const submitEditWork = () => {
  axios.put('https://eb98-188-2-139-122.ngrok-free.app/editJob', {
  editWork,
  index: editIndex,
  id: user._id,
 }).then(res => {
  setUser(res.data)
  setWorks(res.data.work)
  setIsWorkEditPopupVisible(false)
  setEditWork({
    name: '',
    colors: ['', ''],
    currentTime: '1h',
  })
  setEditIndex(null)
 })
}



const submitDeleteWork = () => {
  if(user.work.length !== 1){
    axios.put('https://eb98-188-2-139-122.ngrok-free.app/deleteJob', {
    index: editIndex,
    id: user._id,
  }).then(res => {
    setWorks(res.data)
    setIsWorkEditPopupVisible(false)
    setEditWork({
      name: '',
      colors: ['', ''],
      currentTime: '1h',
    })
    setEditIndex(null)
  })
} else {
  setAlertPopupMessage('You need to have at least one work');
  setAlertPopupType('error');
  setAlertPopupVisible(true);
}

}

const timeFromPoints = (points) => {
  const hours = Math.floor(points / 20);
  const minutes = Math.round((points / 20 - hours) * 60);
  const time = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  return time
}

const findCurrentSession = () => {
  const task = user.array[new Date().getDate() - 1].find(task => currentTime-10 > task[4] && currentTime-10 < task[5])
  return task
 }

 let nextIndex = null;

 const findFirstNextSession = () => {
  const today = new Date().getDate() - 1;
  nextIndex = today;
  for (let i = today; i < user.array.length; i++) {
    const task = user.array[i].find(task => {
      if (i === today) {

        return currentTime - 10 < task[4];
      }
      nextIndex = i;

      return true; // For future days, return the first task
    });
    if (task) {
      return task;
    }
  }
  return null; // If no future tasks are found
 }


 useEffect(() => {
  works.forEach(work => {
    console.log(work._id)
  })
 }, [works])

 const findTaskById = (id) => {
  return user.work.find(work => work._id === id)
}

const handleSessionPress = () => {
  Animated.spring(buttonAnim, {
    toValue: 105,
    useNativeDriver: true,
    tension: 100,
    friction: 4,
    velocity: 3
  }).start();

  setIsSessionPageVisible(true);
};

const handleSessionClose = () => {
  Animated.spring(buttonAnim, {
    toValue: 0,
    useNativeDriver: true,
    tension: 100,
    friction: 7,
    velocity: 2
  }).start();

  setIsSessionPageVisible(false);
};

useEffect(() => {
  if (isSessionPageVisible) {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 30,
        friction: 7,
        velocity: 2
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  } else {
    slideAnim.setValue(-300);
    opacityAnim.setValue(0);
  }
}, [isSessionPageVisible]);

useEffect(() => {
  if (isSessionPageVisible) {
    Animated.parallel([
      Animated.spring(timerSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 30,
        friction: 7,
        velocity: 2
      }),
      Animated.timing(timerOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  } else {
    timerSlideAnim.setValue(400);
    timerOpacityAnim.setValue(0);
  }
}, [isSessionPageVisible]);

useEffect(() => {
  if (!findCurrentSession()) return;

  const updateTimer = () => {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentSeconds = currentTime.getSeconds();

    const sessionEndInSeconds = (findCurrentSession()[5] / 20) * 3600;
    const currentTimeInSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
    const remainingSeconds = Math.round(sessionEndInSeconds - currentTimeInSeconds);
    setTimeInSeconds(remainingSeconds);
  };

  updateTimer();
  const intervalId = setInterval(updateTimer, 1000);
  return () => clearInterval(intervalId);
}, [findCurrentSession()]);

const formatTime = (seconds) => {
  if (seconds < 0) return "00:00:00";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

  return(
      <SafeAreaView className="flex-1 h-full bg-zinc-950" edges={['top']}>
        <View className="flex-1">
          <ScrollView className="flex-1 h-full px-4" contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-row items-start justify-start mt-2 mb-2">
							<Text className="text-white text-2xl font-bold">Next</Text>
            </View>

            {findFirstNextSession() ? (
            <TouchableOpacity className="flex-row justify-between items-center p-4 bg-zinc-900 rounded-xl mb-4">
							<View className="flex-row justify-center items-center">
							<LinearGradient
									colors={
                  findTaskById(findFirstNextSession()[3]).colors
                  }
									start={{x: 0, y: 0}}
									end={{x: 0, y: 1}}
									className="w-6 h-6 rounded-full"
								>
								</LinearGradient>
						
								<View className="flex-col justify-center items-start pl-2">
									<Text className="text-white text-base font-semibold">{findTaskById(findFirstNextSession()[3]).name}</Text>
									<Text className="text-gray-400 text-sm font-pregular">{findFirstNextSession()[2]}</Text>
								</View>
							</View>
              <View className="flex-row justify-center items-center bg-zinc-800 rounded-xl px-2 py-1">
                <Image source={icons.clockGray} className="w-3 h-3 mr-1" />
                <Text className="text-gray-400 text-xs font-pregular">
                  starting in {nextIndex !== new Date().getDate() - 1 
                    ? timeFromPoints(findFirstNextSession()[4] + 
                        ((nextIndex - (new Date().getDate() - 1)) > 1 
                          ? (((nextIndex - 1) - (new Date().getDate() - 1)) * 480) 
                          : 0) + 
                        (480 - (currentTime-10)))
                    : timeFromPoints(findFirstNextSession()[4]-(currentTime-10))}


                </Text>
              </View>
						</TouchableOpacity>
            ) : 
            (
              <View className="flex-row justify-center items-center p-4 bg-zinc-900 rounded-xl mb-4">
                <Text className="text-gray-400 text-sm font-pregular">No Tasks Scheduled</Text>
              </View>
            )}

            <TouchableOpacity
            onPress={() => router.push({pathname: 'log/SchedulePage'})} 
            className="flex-row justify-center items-center p-4 bg-zinc-900 rounded-xl mb-8 border border-sky-200">
            <MaskedView
								maskElement={
                  <View className="flex-row justify-center items-center">
                    <Image source={icons.calendar} className="w-7 h-7 mr-2 tint-white" />
                    <Text className="text-white text-xl font-semibold">Schedule Session</Text>
                  </View>
								}
							>
							<LinearGradient
								colors={['#d4d4d8', '#38bdf8']}
								start={{x: 0, y: 0}}
								end={{x: 0, y: 1}}
							>
                  <View className="flex-row justify-center items-center opacity-0">
                    <Image source={icons.calendar} className="w-7 h-7 mr-2 tint-white" />
                    <Text className="text-white text-xl font-semibold">Schedule Session</Text>
                  </View>
							</LinearGradient>
						</MaskedView>

            </TouchableOpacity>

            <View className="flex-row items-start justify-start mt-2 mb-2">
							<Text className="text-white text-2xl font-bold">Work</Text>
            </View>

            <View className="flex-row justify-center items-center w-full mb-4">
              <TouchableOpacity
              onPress={() => {setIsWorkVisible(true)}}
              className="flex-row justify-center items-center px-4 rounded-full mb-4 w-[60%] ">
              <LinearGradient
            colors={['#0ea5e9', '#60a5fa']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className="w-full rounded-full h-14 flex-row justify-center items-center"
          >
                <Image source={icons.plusGray} className="w-6 h-6 mr-2 tint-white p-2 bg-sky-300 rounded-full" />
                <Text className="text-white text-lg font-semibold">Add Work</Text>
                </LinearGradient>

              </TouchableOpacity>
            </View>

            <View>
              {works.map((work, index) => (
                <TouchableOpacity onPress={() => openEditWork(work, index)} key={index} className="flex-row justify-between items-center w-full mb-6">
                  <View className="flex-row justify-center items-center">
                    <LinearGradient
                      colors={work.colors}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      className="w-6 h-6 rounded-full"
                    >
                    </LinearGradient>

                  <Text className="text-white text-base font-psemibold pl-2">{work.name}</Text>
                  </View>
                  <View className="flex-row justify-center items-center">
                    <Text className={` text-base font-psemibold ${isItDone(work.currentTime, workToday(work)) ? 'text-sky-400' : 'text-white'}`}>{workToday(work)} <Text className={`${isItDone(work.currentTime, workToday(work)) ? 'text-sky-400' : 'text-gray-400'}`}>/ {work.currentTime}</Text></Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

          </ScrollView>

          <View className="px-4 pb-2">
          {!findCurrentSession() ? (
        <TouchableOpacity 
          onPress={() => {setIsStartSessionPopupVisible(true)}}
          className="w-full rounded-full overflow-hidden shadow-lg pt-2"
        >
          <LinearGradient
            colors={['#0ea5e9', '#60a5fa']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className="w-full rounded-full h-14 flex-row justify-center items-center"
          >
            <Image source={icons.play} className="w-6 h-6 mr-2 tint-white" />
						<Text className="text-white text-lg font-semibold">Start Session</Text>
					</LinearGradient>
					</TouchableOpacity>

            ) : (
              <Animated.View style={{ transform: [{ translateY: buttonAnim }] }}>
                <TouchableOpacity 
                  onPress={handleSessionPress}
                  className="w-full rounded-full overflow-hidden shadow-lg pt-2"
                >
                  <LinearGradient
                    colors={['#27272a', '#18181b']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    className="w-full rounded-full h-14 flex-row justify-between items-center px-4"
                  >
                    <View className="flex-row items-center">
                      <LinearGradient
                        colors={findTaskById(findCurrentSession()[3]).colors}
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                        className="w-6 h-6 rounded-full mr-1"
                      >
                      </LinearGradient>
                      <View className="flex-col items-start">
                        <Text className="text-white text-base font-semibold">{findCurrentSession()[2]}</Text>
                        <Text className="text-zinc-400 text-sm font-regular">{findTaskById(findCurrentSession()[3]).name}</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-white text-base font-semibold">{timeFromPoints(findCurrentSession()[5]-(currentTime-10))}</Text>
                      <Image source={icons.timerWhite} className="w-4 h-4 ml-1 tint-white" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
			</View>

      <AlertPopup
        visible={alertPopupVisible}
        message={alertPopupMessage}
        type={alertPopupType}
        onHide={() => setAlertPopupVisible(false)}
      />

      <BottomPopup
  visible={isWorkVisible}
  onClose={() => setIsWorkVisible(false)}
  height={0.65}
>
  <View className="p-2 bg-zinc-900 rounded-t-3xl flex-1">
             <MaskedView
              maskElement={
                <Text className="text-white text-3xl font-bold mb-6 text-center">Add Work</Text>
                  }
                >
                <LinearGradient
                  colors={['#D4D4D8', '#71717A']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                >
                  <Text className="text-white text-3xl font-bold mb-6 text-center opacity-0">Add Work</Text>
                </LinearGradient>
              </MaskedView>

    
    <View className="mb-4">
      <Text className="text-gray-400 text-sm mb-2">Work Name</Text>
      <TextInput
        className="bg-zinc-800 text-white p-3 rounded-xl"
        placeholder="Work Name"
        placeholderTextColor="#71717A" 
        value={newWork.name}
        onChangeText={(text) => setNewWork({...newWork, name: text})}
      />
    </View>
    
    <View className="mb-4">
      <Text className="text-gray-400 text-sm mb-2">Choose color:</Text>
      <View className="flex-row justify-between">
        {/* {['#DC2626', '#16A34A', '#2563EB', '#9333EA', '#CA8A04', '#0EA5E9', '#EC4899'].map((color, index) => (
          <TouchableOpacity
            key={index}
            style={{ backgroundColor: color }}
            className="w-8 h-8 rounded-full"
          />
        ))} */}
        {ballColors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={{ backgroundColor: color }}
            className={`w-8 h-8 rounded-full `}
            onPress={() => {
              if (!works.some(work => work.colors[0] === color[0] && work.colors[1] === color[1])) {
                setNewWork({...newWork, colors: color});
              }
            }}
          >
            <LinearGradient
              colors={color}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              className={`w-8 h-8 rounded-full ${works.some(work => work.colors[0] === color[0] && work.colors[1] === color[1]) ? 'opacity-20' : ''} ${newWork.colors[0] === color[0] && newWork.colors[1] === color[1] ? 'border-2 border-white' : ''}`}
            >
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

    </View>
    
    <View className="mb-4">
      <Text className="text-gray-400 text-sm mb-2">Targeted work per day:</Text>
      <View className="flex-row items-center justify-between bg-zinc-800 rounded-xl p-2">
        <TouchableOpacity 
        onPress={() => {
          if (newWork.currentTime.includes('m')) { 
            setNewWork({...newWork, currentTime: parseInt(newWork.currentTime.replace('h', '')) + 'h'})
          } else {
            setNewWork({...newWork, currentTime: parseInt(newWork.currentTime.replace('h', '')) - 1 + 'h 30m'})
          }
        }}
        className="bg-zinc-700 w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-white text-xl">-</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">{newWork.currentTime}</Text>
        <TouchableOpacity 
        onPress={() => {
          if (newWork.currentTime.includes('m')) {
            setNewWork({...newWork, currentTime: parseInt(newWork.currentTime.replace('h', '')) + 1 + 'h'})
          } else {
            setNewWork({...newWork, currentTime: parseInt(newWork.currentTime.replace('h', '')) + 'h 30m'})
          }
        }}
        className="bg-zinc-700 w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-white text-xl">+</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-gray-500 text-sm mt-2 text-center">overall work per day left: 37h 30m</Text>
    </View>
    
    <View className="flex-1" />
    
    <View className="pb-2">
        <TouchableOpacity 
          onPress={submitNewWork}
          className="w-full rounded-full overflow-hidden shadow-lg pt-2"
        >
          <LinearGradient
            colors={['#0ea5e9', '#60a5fa']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className="w-full rounded-full h-14 flex-row justify-center items-center"
          >
						<Text className="text-white text-lg font-semibold">Add New Work</Text>
					</LinearGradient>
					</TouchableOpacity>
				</View>
  </View>
</BottomPopup>

<BottomPopup
				visible={isStartSessionPopupVisible}
				onClose={() => setIsStartSessionPopupVisible(false)}
				height={0.65}
			>
				<ScrollView className="bg-zinc-900 rounded-t-3xl flex-1 p-2">
				<MaskedView
						maskElement={
							<Text className="text-white text-3xl font-bold mb-6 text-center">Start Session</Text>
								}
							>
							<LinearGradient
								colors={['#D4D4D8', '#71717A']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 1}}
							>
							<Text className="text-white text-3xl font-bold mb-6 text-center opacity-0">Start Session</Text>
							</LinearGradient>
						</MaskedView>

					
					<View className="mb-4">
						<TextInput
							className="bg-zinc-800 text-white p-4 rounded-xl"
							placeholder="Work Session Name"
							placeholderTextColor="#71717A"
							style={{ fontSize: 16 }}
						/>
					</View>
					
					<View className="mb-4 z-10">
						<TouchableOpacity 
							className="flex-row justify-between items-center bg-zinc-800 p-4 rounded-xl"
							onPress={() => setIsWorkDropdownVisible(!isWorkDropdownVisible)}
						>
							<View className="flex-row items-center">
								{selectedWork ? (
									<LinearGradient
										colors={selectedWork.colors}
										start={{x: 0, y: 0}}
										end={{x: 1, y: 1}}
										className="w-5 h-5 rounded-full mr-3"
									>
									</LinearGradient>
								) : (
									<Image source={icons.workGray} className="w-5 h-5 mr-3 tint-gray-400" />
								)}
								<Text className={`text-base ${selectedWork ? 'text-white' : 'text-gray-400'}`}>
									{selectedWork ? selectedWork.name : "Select a work"}
								</Text>
							</View>
							<Image 
								source={icons.chevronRight} 
								className={`w-4 h-4 tint-gray-400 ${isWorkDropdownVisible ? 'rotate-90' : ''}`} 
							/>
						</TouchableOpacity>
						
						{isWorkDropdownVisible && (
							<View className="absolute top-full left-0 right-0 bg-zinc-800 rounded-xl mt-2 p-2 border border-zinc-700">
								{works.map((work, index) => (
									<TouchableOpacity 
										key={index}
										className="flex-row items-center p-3"
										onPress={() => {
											setSelectedWork(work);
											setIsWorkDropdownVisible(false);
										}}
									>
										<LinearGradient
											colors={work.colors}
											start={{x: 0, y: 0}}
											end={{x: 1, y: 0}}
											className="w-4 h-4 rounded-full mr-3"
										>
										</LinearGradient>
										<Text className="text-white text-base">{work.name}</Text>
									</TouchableOpacity>
								))}
							</View>
						)}
					</View>
					
					<TouchableOpacity 
						className="flex-row justify-between items-center bg-zinc-800 p-4 rounded-xl mb-4"
						onPress={() => setShowTimePicker(!showTimePicker)}	
					>
						<View className="flex-row items-center">
							<Image source={icons.clockGray} className="w-5 h-5 mr-3 tint-zinc-400" />
							<Text className="text-zinc-400 text-base">
								{duration.hours > 0 || duration.minutes > 0 
									? `${duration.hours}h ${duration.minutes}m`
									: "Add duration"}
							</Text>
						</View>
						<Image source={icons.chevronRight} className="w-4 h-4 tint-zinc-400" />
					</TouchableOpacity>
					
					{showTimePicker && (
						<View className="mb-4">
							<DateTimePicker
								value={new Date(0, 0, 0, duration.hours, duration.minutes)}
								mode="time"
								is24Hour={true}
								display="spinner"
								onChange={onTimeChange}
							/>
						</View>
					)}
				</ScrollView>
				
				<View className="bg-zinc-900 p-6">
					<TouchableOpacity onPress={() => {/* Handle start session */}}>
						<LinearGradient
							colors={['#0ea5e9', '#60a5fa']}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 1}}
							className="w-full rounded-full h-14 flex-row justify-center items-center"
						>
							<Image source={icons.play} className="w-6 h-6 mr-2 tint-white" />
							<Text className="text-white text-lg font-semibold">Start Session</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</BottomPopup>

      <BottomPopup
        visible={isWorkEditPopupVisible}
        onClose={() => setIsWorkEditPopupVisible(false)}
        height={0.65}
      >
  <View className="p-2 bg-zinc-900 rounded-t-3xl flex-1">
    <MaskedView
              maskElement={
                <Text className="text-white text-3xl font-bold mb-6 text-center">Edit Work</Text>
                  }
                >
                <LinearGradient
                  colors={['#D4D4D8', '#71717A']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                >
                <Text className="text-white text-3xl font-bold mb-6 text-center opacity-0">Edit Work</Text>
                </LinearGradient>
              </MaskedView>

    
    <View className="mb-4">
      <Text className="text-gray-400 text-sm mb-2">Work Name</Text>
      <TextInput
        className="bg-zinc-800 text-white p-3 rounded-xl"
        placeholder="Work Name"
        placeholderTextColor="#71717A" 
        value={editWork.name}
        onChangeText={(text) => setEditWork({...editWork, name: text})}
      />
    </View>
    
    <View className="mb-4">
      <Text className="text-gray-400 text-sm mb-2">Choose color:</Text>
      <View className="flex-row justify-between">
        {/* {['#DC2626', '#16A34A', '#2563EB', '#9333EA', '#CA8A04', '#0EA5E9', '#EC4899'].map((color, index) => (
          <TouchableOpacity
            key={index}
            style={{ backgroundColor: color }}
            className="w-8 h-8 rounded-full"
          />
        ))} */}
        {ballColors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={{ backgroundColor: color }}
            className={`w-8 h-8 rounded-full `}
            onPress={() => {
              if (!works.some(work => work.colors[0] === color[0] && work.colors[1] === color[1]) || (initialEditWork.colors[0] === color[0] && initialEditWork.colors[1] === color[1])) {
                setEditWork({...editWork, colors: color});
              }
            }}
          >
            <LinearGradient
              colors={color}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              className={`w-8 h-8 rounded-full ${works.some(work => work.colors[0] === color[0] && work.colors[1] === color[1]) && (initialEditWork.colors[0] !== color[0] && initialEditWork.colors[1] !== color[1]) ? 'opacity-20' : ''} ${editWork.colors[0] === color[0] && editWork.colors[1] === color[1] ? 'border-2 border-white' : ''}`}
            >
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

    </View>
    
    <View className="mb-4">
      <Text className="text-gray-400 text-sm mb-2">Targeted work per day:</Text>
      <View className="flex-row items-center justify-between bg-zinc-800 rounded-xl p-2">
        <TouchableOpacity 
        onPress={() => {
          if (editWork.currentTime.includes('m')) { 
            setEditWork({...editWork, currentTime: parseInt(editWork.currentTime.replace('h', '')) + 'h'})
          } else {
            setEditWork({...editWork, currentTime: parseInt(editWork.currentTime.replace('h', '')) - 1 + 'h 30m'})
          }
        }}
        className="bg-zinc-700 w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-white text-xl">-</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">{editWork.currentTime}</Text>
        <TouchableOpacity 
        onPress={() => {
          if (editWork.currentTime.includes('m')) {
            setEditWork({...editWork, currentTime: parseInt(editWork.currentTime.replace('h', '')) + 1 + 'h'})
          } else {
            setEditWork({...editWork, currentTime: parseInt(editWork.currentTime.replace('h', '')) + 'h 30m'})
          }
        }}
        className="bg-zinc-700 w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-white text-xl">+</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-gray-500 text-sm mt-2 text-center">overall work per day left: 37h 30m</Text>
    </View>
    
    <View className="flex-1" />
    
    <View className="flex-row justify-between">
      <TouchableOpacity 
        onPress={submitEditWork}
        className="flex-1 mr-2"
      >
        <LinearGradient
          colors={['#0ea5e9', '#60a5fa']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          className="rounded-full py-4 items-center"
        >
          <Text className="text-white text-lg font-semibold">Edit Work</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={submitDeleteWork}

        className=" w-14 h-14 rounded-full items-center justify-center"
      >
        <LinearGradient
          colors={['#DC2626', '#761414']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          className="w-14 h-14 rounded-full items-center justify-center"
        >
          <Image source={icons.trash} className="w-6 h-6 tint-white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View> 
      </BottomPopup>

      <BottomPopup
        visible={isSessionPageVisible}
        onClose={handleSessionClose}
        height={0.9}
      >
        <View className="flex-1">
          {findCurrentSession() && (
            <>
              <View className="bg-zinc-900 rounded-t-3xl p-2">
                <Animated.View
                  style={{
                    transform: [{ translateX: slideAnim }],
                    opacity: opacityAnim
                  }}
                  className="flex-row items-center justify-center"
                >
                  <MaskedView
                    maskElement={
                      <View className="flex-col justify-center items-center">
                        <Text className="text-white text-2xl font-semibold text-center">
                          {findCurrentSession()[2]}
                        </Text>
                        <Text className="text-zinc-200 text-lg font-regular text-center">
                          {findTaskById(findCurrentSession()[3]).name}
                        </Text>
                      </View>
                    }
                  >
                    <LinearGradient
                      colors={['#D4D4D8', findTaskById(findCurrentSession()[3]).colors[0]]}
                      start={{x: 0, y: 0}}
                      end={{x: 0, y: 1}}
                    >
                      <View className="flex-col items-center justify-center opacity-0">
                        <Text className="text-white text-2xl font-semibold text-center">
                          {findCurrentSession()[2]}
                        </Text>
                        <Text className="text-zinc-200 text-lg font-regular text-center">
                          {findTaskById(findCurrentSession()[3]).name}
                        </Text>
                      </View>
                    </LinearGradient>
                  </MaskedView>
                </Animated.View>
              </View>

              <Animated.View 
                style={{
                  transform: [{ translateX: timerSlideAnim }],
                  opacity: timerOpacityAnim
                }} 
                className="justify-start items-center mt-12"
              >
                <MaskedView
                  maskElement={
                    <Text className="text-white text-6xl font-semibold">
                      {formatTime(timeInSeconds)}
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={['#52525b', findTaskById(findCurrentSession()[3]).colors[0]]}
                    start={{x: 0, y: 0}}
                    end={{x: 2, y: 2}}
                  >
                    <Text className="text-white text-6xl font-semibold opacity-0">
                      {formatTime(timeInSeconds)}
                    </Text>
                  </LinearGradient>
                </MaskedView>
              </Animated.View>
            </>
          )}
        </View>
      </BottomPopup>

      </SafeAreaView>
  )









  // useEffect(() => {
  //   fetchGoals();
  //   fetchPresets();
  //   fetchFutureWork();
  // }, []);

  // const fetchGoals = async () => {
  //   try {
  //     const response = await axios.post('https://44a8-188-2-139-122.ngrok-free.app/getGoals', { id: user._id });
  //     setGoals(response.data);
  //   } catch (error) {
  //     console.error('Error fetching goals:', error);
  //   }
  // };

  // const fetchPresets = async () => {
  //   try {
  //     const response = await axios.post('https://44a8-188-2-139-122.ngrok-free.app/getPresets', { id: user._id });
  //     setPresets(response.data);
  //   } catch (error) {
  //     console.error('Error fetching presets:', error);
  //   }
  // };

  // const fetchFutureWork = async () => {
  //   // This is a placeholder. In a real app, you'd fetch future work from your backend
  //   setFutureWork([
  //     { id: 1, name: "Project A", dueDate: "Next Week" },
  //     { id: 2, name: "Task B", dueDate: "In 2 days" },
  //     { id: 3, name: "Meeting C", dueDate: "Tomorrow" },
  //   ]);
  // };

  // return (
  //   <SafeAreaView className="flex-1 h-full bg-gray-950">
  //     <ScrollView className="flex-1 h-full px-4">
  //       <View className="my-6">
  //         <TouchableOpacity 
  //           onPress={() => router.push({pathname: 'log/SchedulePage'})}  
  //           className="w-full rounded-xl overflow-hidden shadow-lg"
  //         >
  //           <LinearGradient
  //             colors={['#38bdf8', '#1d4ed8']}
  //             start={{x: 0, y: 0}}
  //             end={{x: 1, y: 1}}
  //             className="w-full h-16 flex-row justify-center items-center"
  //           >
  //             <Image source={icons.calendar} className="w-6 h-6 mr-2 tint-white" />
  //             <Text className="text-white text-lg font-semibold">Schedule</Text>
  //           </LinearGradient>
  //         </TouchableOpacity>
  //       </View>

  //       <View className="flex-row justify-between mb-6">
  //         <TouchableOpacity 
  //           onPress={() => setIsWorkVisible(true)} 
  //           className="w-[48%] bg-gray-800 border border-gray-700 p-4 rounded-xl flex-row justify-center items-center"
  //         >
  //           <Image source={icons.work} className="w-6 h-6 mr-2 tint-white" />
  //           <Text className="text-white text-lg font-bold">Work</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity 
  //           onPress={() => setIsPresetVisible(true)} 
  //           className="w-[48%] bg-gray-800 border border-gray-700 p-4 rounded-xl flex-row justify-center items-center"
  //         >
  //           <Image source={icons.presets} className="w-6 h-6 mr-2 tint-white" />
  //           <Text className="text-white text-lg font-bold">Presets</Text>
  //         </TouchableOpacity>
  //       </View>

  //       <View className="mb-6">
  //         <Text className="text-white text-2xl font-bold mb-4">Upcoming Work</Text>
  //         {futureWork.map(work => (
  //           <View key={work.id} className="bg-gray-800 p-4 rounded-xl mb-3 border border-gray-700">
  //             <Text className="text-white text-lg font-semibold">{work.name}</Text>
  //             <Text className="text-gray-400 mt-1">Due: {work.dueDate}</Text>
  //           </View>
  //         ))}
  //       </View>
  //     </ScrollView>

  //     <BottomPopup
  //       visible={isWorkVisible}
  //       onClose={() => setIsWorkVisible(false)}
  //     >
  //       <View className="p-6 bg-gray-900 rounded-t-3xl">
  //         <Text className="text-white text-2xl font-bold mb-6 text-center">Work</Text>
  //         {goals.map(goal => (
  //           <TouchableOpacity 
  //             key={goal.id} 
  //             className="bg-gray-800 p-4 rounded-xl mb-3 border border-gray-700 flex-row items-center"
  //           >
  //             <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: goal.color, marginRight: 12 }} />
  //             <Text className="text-white text-lg flex-1">{goal.name}</Text>
  //             <Text className="text-gray-400">{goal.count}h / {goal.time}h</Text>
  //           </TouchableOpacity>
  //         ))}
  //         <TouchableOpacity 
  //           className="bg-blue-500 p-4 rounded-xl mt-4 flex-row justify-center items-center"
  //           onPress={() => {/* Handle add work */}}
  //         >
  //           <Image source={icons.plus} className="w-5 h-5 mr-2 tint-white" />
  //           <Text className="text-white text-center font-bold text-lg">Add New Work</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </BottomPopup>

  //     <BottomPopup
  //       visible={isPresetVisible}
  //       onClose={() => setIsPresetVisible(false)}
  //     >
  //       <View className="p-6 bg-gray-900 rounded-t-3xl">
  //         <Text className="text-white text-2xl font-bold mb-6 text-center">Presets</Text>
  //         {presets.map((preset, index) => (
  //           <TouchableOpacity 
  //             key={index}
  //             className="bg-gray-800 p-4 rounded-xl mb-3 border border-gray-700 flex-row items-center"
  //           >
  //             <Image source={icons.preset} className="w-6 h-6 mr-3 tint-white" />
  //             <View className="flex-1">
  //               <Text className="text-white text-lg">{preset.name}</Text>
  //               <Text className="text-gray-400 mt-1">{preset.jobs.length} jobs</Text>
  //             </View>
  //           </TouchableOpacity>
  //         ))}
  //         <TouchableOpacity 
  //           className="bg-blue-500 p-4 rounded-xl mt-4 flex-row justify-center items-center"
  //           onPress={() => {/* Handle create preset */}}
  //         >
  //           <Image source={icons.plus} className="w-5 h-5 mr-2 tint-white" />
  //           <Text className="text-white text-center font-bold text-lg">Create New Preset</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </BottomPopup>

  //     <View className="px-4 pb-2">
  //       <TouchableOpacity 
  //         onPress={() => {}}
  //         className="w-full rounded-xl overflow-hidden shadow-lg"
  //       >
  //         <LinearGradient
  //           colors={['#0ea5e9', '#60a5fa']}
  //           start={{x: 0, y: 0}}
  //           end={{x: 1, y: 1}}
  //           className="w-full h-14 flex-row justify-center items-center"
  //         >
  //           <Image source={icons.play} className="w-6 h-6 mr-2 tint-white" />
  //           <Text className="text-white text-lg font-semibold">Start Session</Text>
  //         </LinearGradient>
  //       </TouchableOpacity>
  //     </View>
  //   </SafeAreaView>
  // );
};

export default Tasks;
