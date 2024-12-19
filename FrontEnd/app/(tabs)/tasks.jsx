import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Platform, Animated, Dimensions } from 'react-native';
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
import Svg, { 
  Circle, 
  Path, 
  Defs, 
  LinearGradient as SvgLinearGradient, 
  Stop,
  G 
} from 'react-native-svg';

const createSmoothPath = (points, screenWidth, graphHeight) => {
  if (points.length < 2) return '';

  const controlPoints = points.map((point, i) => {
    const x = i * (screenWidth / 6);
    return { x, y: point.value };
  });

  let path = `M ${controlPoints[0].x},${controlPoints[0].y}`;
  
  for (let i = 0; i < controlPoints.length - 1; i++) {
    const current = controlPoints[i];
    const next = controlPoints[i + 1];
    const midX = (current.x + next.x) / 2;
    
    path += ` C ${midX},${current.y} ${midX},${next.y} ${next.x},${next.y}`;
  }

  return path;
};

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
  const [isDayPopupVisible, setIsDayPopupVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedTab, setSelectedTab] = useState('stats');

  const screenWidth = Dimensions.get('window').width;
  const graphHeight = 200;

  const [points, setPoints] = useState([
    { day: 'Mon', value: 0 },
    { day: 'Tue', value: 0 },
    { day: 'Wed', value: 0 },
    { day: 'Thu', value: 0 },
    { day: 'Fri', value: 0 },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 },
  ]);

  useEffect(() => {
    const calculateValue = (percentage) => {
      return graphHeight - (graphHeight * percentage / 100);
    };

    const newPoints = [
      { day: 'Mon', value: calculateValue(60) },
      { day: 'Tue', value: calculateValue(75) },
      { day: 'Wed', value: calculateValue(45) },
      { day: 'Thu', value: calculateValue(90) },
      { day: 'Fri', value: calculateValue(30) },
      { day: 'Sat', value: calculateValue(20) },
      { day: 'Sun', value: calculateValue(40) },
    ];

    setPoints(newPoints);
  }, [graphHeight]);

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
    



    const allWorkToday = () =>{
        const todaysSessions = user.workSessions.filter(session => session.date === `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`);
        
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTimeInMinutes = currentHours * 60 + currentMinutes;
    
        let totalMinutes = 0;
        todaysSessions.forEach(session => {
          const [endHours, endMinutes] = session.endTime.split(':').map(Number);
          const endTimeInMinutes = endHours * 60 + endMinutes;
    
          if (endTimeInMinutes <= currentTimeInMinutes) {
            const [startHours, startMinutes] = session.startTime.split(':').map(Number);
            const startInMinutes = startHours * 60 + startMinutes;
            totalMinutes += endTimeInMinutes - startInMinutes;
          }
        });
    
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }

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



    const todayDate = () => {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); 
      const yyyy = today.getFullYear();
      return `${dd}:${mm}:${yyyy}`;
    }



  

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


  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when today is Sunday
    const monday = new Date(today.setDate(diff));
    
    const weekDates = {};
    
    for(let i = 0; i < 7; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      
      const dd = currentDate.getDate();
      const mm = currentDate.getMonth() + 1;
      const yyyy = currentDate.getFullYear();
      
      const dateString = `${dd}:${mm}:${yyyy}`;
      
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      weekDates[days[i]] = dateString;
    }

    return weekDates;
  }


  const workColors = (date) => {
    // Calculate total target time from user.work
    let totalTargetMinutes = 0;
    user.work.forEach(work => {
      // Extract numbers from string like "1h 30m" or "2h"
      const timeStr = work.currentTime;
      let hours = 0;
      let minutes = 0;
      
      if (timeStr.includes('h')) {
        hours = parseInt(timeStr.split('h')[0]);
      }
      if (timeStr.includes('m')) {
        minutes = parseInt(timeStr.split('m')[0].split(' ').pop());
      }
      
      totalTargetMinutes += (hours * 60) + minutes;
    });
    
    // Get threshold by dividing total target time by 5
    const threshold = totalTargetMinutes / 4;

    // Calculate total session time for given date
    let totalSessionMinutes = 0;
    user.workSessions.filter(session => session.date === date).forEach(session => {
      const [startHours, startMinutes] = session.startTime.split(':').map(Number);
      const [endHours, endMinutes] = session.endTime.split(':').map(Number);
      const startInMinutes = startHours * 60 + startMinutes;
      const endInMinutes = endHours * 60 + endMinutes;
      totalSessionMinutes += endInMinutes - startInMinutes;
      
    });

    // Return colors based on thresholds

    if (totalSessionMinutes <= threshold) {
      return ['#27272a', '#27272a'];
    } else if (totalSessionMinutes <= threshold * 2) {
      return ['#1d4ed8', '#1e3a8a'];
    } else if (totalSessionMinutes <= threshold * 3) {
      return ['#3b82f6', '#1d4ed8'];
    } else {
      return ['#60a5fa', '#3b82f6'];
    }
  }



  



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
  const todaysSessions = user.workSessions.filter(session => 
    session.date === `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}` &&
    session.workId === job._id
  );

  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  let totalMinutes = 0;
  todaysSessions.forEach(session => {
    const [endHours, endMinutes] = session.endTime.split(':').map(Number);
    const endTimeInMinutes = endHours * 60 + endMinutes;

    if (endTimeInMinutes <= currentTimeInMinutes) {
      const [startHours, startMinutes] = session.startTime.split(':').map(Number);
      const startInMinutes = startHours * 60 + startMinutes;
      totalMinutes += endTimeInMinutes - startInMinutes;
    }
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}



const getGoalWork = () => {
  if (!user.work || user.work.length === 0) return '0h';
  
  const totalMinutes = user.work.reduce((acc, workSession) => {
    const [hours, minutes] = workSession.currentTime.split(' ').map(t => parseInt(t));
    return acc + (hours * 60) + (isNaN(minutes) ? 0 : minutes);
  }, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}



const submitNewWork = () => {
    axios.put('https://c18c-109-245-203-91.ngrok-free.app/addJob', {
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
  axios.put('https://c18c-109-245-203-91.ngrok-free.app/editJob', {
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
    axios.put('https://c18c-109-245-203-91.ngrok-free.app/deleteJob', {
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

const pointsFromTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 20) + Math.round(minutes / 3);
}

	const findCurrentSession = () => {
		const currentDate = `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`;
		const currentTime = new Date();
		const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

		const session = user.workSessions.find(session => {
			const [startHours, startMinutes] = session.startTime.split(':').map(Number);
			const startTimeInMinutes = startHours * 60 + startMinutes;
			const [endHours, endMinutes] = session.endTime.split(':').map(Number);
			const endTimeInMinutes = endHours * 60 + endMinutes;

			return session.date === currentDate && currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
		});


		return session;
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

const session = findCurrentSession();


useEffect(() => {
  if (!session) return;

  const updateTimer = () => {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentSeconds = currentTime.getSeconds();

    // Convert session end time (in points) to seconds
    const sessionEndInSeconds = (pointsFromTime(session.endTime) / 20) * 3600;  // Convert points to seconds

    // Convert current time to seconds since start of day
    const currentTimeInSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

    // Calculate remaining time
    const remainingSeconds = Math.round(sessionEndInSeconds - currentTimeInSeconds);
    setTimeInSeconds(remainingSeconds);
  };

  // Initial update
  updateTimer();

  // Update every second
  const intervalId = setInterval(updateTimer, 1000);

  return () => clearInterval(intervalId);
}, [session]);

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
            <View className="flex flex-col justify-between bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50 mb-6">
              <View className="flex flex-row justify-between pb-4">
                <Text className="text-lg text-white font-psemibold">Work Activity</Text>
                {/* <TouchableOpacity className="flex-row justify-center items-center rounded-full bg-zinc-800 p-1 border border-zinc-700 shadow-lg shadow-black/50" onPress={() => setIsWorkActivityPopupVisible(true)}>
                  <Image source={icons.fullScreen} className="w-6 h-6 tint-white" />
                </TouchableOpacity> */}

              </View>
              <View className="flex flex-row justify-between py-2">
                <View className="flex flex-col items-center justify-between">
                  <Text className="text-lg font-psemibold text-white">{user.workSessions.filter(session => 
                    session.date === getWeekDates().monday || 
                    session.date === getWeekDates().tuesday ||
                    session.date === getWeekDates().wednesday ||
                    session.date === getWeekDates().thursday ||
                    session.date === getWeekDates().friday ||
                    session.date === getWeekDates().saturday ||
                    session.date === getWeekDates().sunday
                  ).length}</Text>
                  <Text className="text-base font-pmedium text-zinc-600">Sessions</Text>
                </View>
                <View className="flex flex-col items-center justify-between">
                  <Text className="text-lg font-psemibold text-white">{(() => {
                    let totalMinutes = 0;
                    user.workSessions
                      .filter(session => 
                        session.date === getWeekDates().monday ||
                        session.date === getWeekDates().tuesday ||
                        session.date === getWeekDates().wednesday ||
                        session.date === getWeekDates().thursday ||
                        session.date === getWeekDates().friday ||
                        session.date === getWeekDates().saturday ||
                        session.date === getWeekDates().sunday
                      )
                      .forEach(session => {
                        const [startHours, startMinutes] = session.startTime.split(':').map(Number);
                        const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                        const startInMinutes = startHours * 60 + startMinutes;
                        const endInMinutes = endHours * 60 + endMinutes;
                        totalMinutes += endInMinutes - startInMinutes;
                      });
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
                  })()}</Text>
                  <Text className="text-base font-pmedium text-zinc-600">Work Time</Text>
                </View>
                <View className="flex flex-col items-center justify-between">
                  <Text className="text-lg font-psemibold text-white">{(() => {
                    // Group sessions by workId and calculate total time for each
                    const workTimes = {};
                    user.workSessions.forEach(session => {
                      if (!workTimes[session.workId]) {
                        workTimes[session.workId] = 0;
                      }
                      const [startHours, startMinutes] = session.startTime.split(':').map(Number);
                      const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                      const startInMinutes = startHours * 60 + startMinutes;
                      const endInMinutes = endHours * 60 + endMinutes;
                      workTimes[session.workId] += endInMinutes - startInMinutes;
                    });

                    // Find workId with maximum time
                    const entries = Object.entries(workTimes);
                    if (entries.length === 0) return "No projects";
                    
                    const maxWorkId = entries.reduce((a, b) => 
                      b[1] > a[1] ? b : a
                    )[0];

                    // Return the name of the work with maximum time
                    return findTaskById(maxWorkId).name;
                  })()}</Text>
                  <Text className="text-base font-pmedium text-zinc-600">Top Project</Text>
                </View>
              </View>

              <View className="flex flex-row justify-between pt-2">
                <TouchableOpacity className="flex flex-col items-center justify-center"
                onPress={() => {
                  setIsDayPopupVisible(true)
                  setSelectedDate(getWeekDates().monday)
                }}
                >
                  <Text className="font-pmedium text-sm text-white mb-2">M</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().monday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${getWeekDates().monday === todayDate() ? 'border border-white' : ''} flex-row justify-center items-center`}
          >
                <Text className="font-psemibold text-blue-200 text-base">{user.workSessions.filter(session => session.date === getWeekDates().monday).length || ''}</Text>
                </LinearGradient>

                </TouchableOpacity>
                <TouchableOpacity className="flex flex-col items-center justify-center"
                onPress={() => {
                  setIsDayPopupVisible(true)
                  setSelectedDate(getWeekDates().tuesday)
                }}
                >
                  <Text className="font-pmedium text-sm text-zinc-700 mb-2">T</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().tuesday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${getWeekDates().tuesday === todayDate() ? 'border border-white' : ''} flex-row justify-center items-center`}
          >
                <Text className="font-psemibold text-blue-200 text-base">{user.workSessions.filter(session => session.date === getWeekDates().tuesday).length || ''}</Text>
                </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity className="flex flex-col items-center justify-center"
                onPress={() => {
                  setIsDayPopupVisible(true)
                  setSelectedDate(getWeekDates().wednesday)
                }}
                >
                  <Text className="font-pmedium text-sm text-zinc-700 mb-2">W</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().wednesday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${getWeekDates().wednesday === todayDate() ? 'border border-white' : ''} flex-row justify-center items-center`}
          >
                <Text className="font-psemibold text-blue-200 text-base">{user.workSessions.filter(session => session.date === getWeekDates().wednesday).length || ''}</Text>
                </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity className="flex flex-col items-center justify-center"
                onPress={() => {
                  setIsDayPopupVisible(true)
                  setSelectedDate(getWeekDates().thursday)
                }}
                >
                  <Text className="font-pmedium text-sm text-zinc-700 mb-2">T</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().thursday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${getWeekDates().thursday === todayDate() ? 'border border-white' : ''} flex-row justify-center items-center`}
          >
                <Text className="font-psemibold text-blue-200 text-base">{user.workSessions.filter(session => session.date === getWeekDates().thursday).length || ''}</Text>
                </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity className="flex flex-col items-center justify-center"
                onPress={() => {
                  setIsDayPopupVisible(true)
                  setSelectedDate(getWeekDates().friday)
                }}
                >
                  <Text className="font-pmedium text-sm text-zinc-700 mb-2">F</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().friday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${getWeekDates().friday === todayDate() ? 'border border-white' : ''} flex-row justify-center items-center`}
          >
                <Text className="font-psemibold text-blue-200 text-base">{user.workSessions.filter(session => session.date === getWeekDates().friday).length || ''}</Text>
                </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity className="flex flex-col items-center justify-center"
                onPress={() => {
                  setIsDayPopupVisible(true)
                  setSelectedDate(getWeekDates().saturday)
                }}
                >
                  <Text className="font-pmedium text-sm text-zinc-700 mb-2">S</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().saturday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${getWeekDates().saturday === todayDate() ? 'border border-white' : ''} flex-row justify-center items-center`}
          >
                <Text className="font-psemibold text-blue-200 text-base">{user.workSessions.filter(session => session.date === getWeekDates().saturday).length || ''}</Text>
                </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity className="flex flex-col items-center justify-center"
                onPress={() => {
                  setIsDayPopupVisible(true)
                  setSelectedDate(getWeekDates().sunday)
                }}
                >
                  <Text className="font-pmedium text-sm text-zinc-700 mb-2">S</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().sunday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${getWeekDates().sunday === todayDate() ? 'border border-white' : ''} flex-row justify-center items-center`}
          >
                <Text className="font-psemibold text-blue-200 text-base">{user.workSessions.filter(session => session.date === getWeekDates().sunday).length || ''}</Text>
                </LinearGradient>
                </TouchableOpacity>

              </View>
              

            </View>
            {/* <View className="flex-row justify-around bg-zinc-900 rounded-xl p-4 border border-zinc-700 mt-6 mb-6">
              <View className="flex flex-col items-center justify-center">
                <Text className="text-zinc-400 text-base mb-1">Work Goal</Text>
                <Text className="text-white text-2xl font-bold">{getGoalWork()}</Text>
              </View>

                <View className="w-[1px] h-[50%] bg-zinc-700 self-center" />


              <View className="flex flex-col items-center justify-center">
                <Text className="text-zinc-400 text-base mb-1">Work Today</Text>
                <Text className="text-blue-400 text-2xl font-bold">{allWorkToday()}</Text>
              </View>
            </View> */}
           
            <View className="flex-row justify-center items-center w-full mb-6">
              <TouchableOpacity
                onPress={() => {setIsWorkVisible(true)}}
                className="flex-row justify-center items-center px-4 rounded-full w-[70%] shadow-lg"
              >
                <LinearGradient
                  colors={['#27272a', '#171717']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  className="w-full rounded-full h-14 flex-row justify-center items-center"
                >
                  <View className="bg-white/10 rounded-full p-2 mr-3">
                    <Image source={icons.plusGray} className="w-5 h-5 tint-white" />
                  </View>
                  <Text className="text-zinc-100 text-lg font-bold">Add Work</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View>
              {works.map((work, index) => (
                <TouchableOpacity onPress={() => openEditWork(work, index)} key={index} className="flex-row justify-between items-center bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 w-full mb-4">
                  <View className="flex-row justify-center items-center">
                    <LinearGradient
                      colors={work.colors}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      className="w-8 h-8 rounded-lg"
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
                        colors={findTaskById(findCurrentSession().workId).colors}
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                        className="w-6 h-6 rounded-full mr-1"
                      >
                      </LinearGradient>
                      <View className="flex-col items-start">
                        <Text className="text-white text-base font-semibold">{findCurrentSession().name}</Text>
                        <Text className="text-zinc-400 text-sm font-regular">{findTaskById(findCurrentSession().workId).name}</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-white text-base font-semibold">{timeFromPoints(Math.round(pointsFromTime(findCurrentSession().endTime)-(currentTime-10)))}</Text>
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
        <ScrollView className="flex-1 bg-zinc-900">
          <View className="p-4 rounded-t-3xl">
            <View className="flex-row justify-center items-center mb-4">
              <LinearGradient
                colors={editWork.colors}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                className="w-6 h-6 rounded-full mr-3"
              />
              <Text className="text-white text-2xl font-bold">{editWork.name}</Text>
            </View>

            <View className="flex-row justify-start items-center space-x-4 mb-4">
              <TouchableOpacity onPress={() => setSelectedTab('stats')}>
                <Text className={`text-zinc-700 text-lg font-medium ${selectedTab === 'stats' ? 'text-white underline' : 'text-zinc-600'}`}>Stats</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedTab('sessions')}>
                <Text className={`text-zinc-700 text-lg font-medium ${selectedTab === 'sessions' ? 'text-white underline' : 'text-zinc-600'}`}>Sessions</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedTab('edit')}>
                <Text className={`text-zinc-700 text-lg font-medium ${selectedTab === 'edit' ? 'text-white underline' : 'text-zinc-600'}`}>Edit</Text>
              </TouchableOpacity>
            </View>

            {selectedTab === 'stats' && (
              <View className="mb-6">
                <View className="h-72 mb-4 relative bg-zinc-800/30 rounded-xl p-4">
                  {/* Vertical grid lines */}
                  {[...Array(7)].map((_, i) => (
                    <View 
                      key={i}
                      className="absolute h-full border-l border-zinc-800/50"
                      style={{ left: `${(i * 100) / 6}%` }}
                    />
                  ))}
                  
                  {/* Horizontal grid lines */}
                  {[...Array(5)].map((_, i) => (
                    <View 
                      key={i}
                      className="absolute w-full border-t border-zinc-800/50"
                      style={{ top: `${(i * 100) / 4}%` }}
                    />
                  ))}

                  {/* Background gradient */}
                  <LinearGradient
                    colors={['rgba(96, 165, 250, 0.1)', 'rgba(96, 165, 250, 0)']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={{
                      position: 'absolute',
                      top: '10%',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 12,
                    }}
                  />

                  {/* Limit line and text - moved higher */}
                  <View 
                    className="absolute w-full flex-row items-center px-4" 
                    style={{ top: '10%' }}
                  >
                    <View className="flex-1 border-t-2 border-red-400/20 border-dashed" />
                    <View className="bg-red-400/10 rounded-full px-2 py-1 ml-2">
                      <Text className="text-red-400/80 text-xs font-medium">Weekly Goal: 40h</Text>
                    </View>
                  </View>

                  {/* Graph */}
                  <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
                    <Defs>
                      <SvgLinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#60A5FA" stopOpacity="0.2" />
                        <Stop offset="1" stopColor="#60A5FA" stopOpacity="0.05" />
                      </SvgLinearGradient>
                    </Defs>

                    {points && points.length > 0 && (
                      <>
                        {/* Area under curve */}
                        <Path
                          d={`
                            ${createSmoothPath(points, screenWidth - 32, graphHeight)}
                            L ${screenWidth - 32},${graphHeight}
                            L 0,${graphHeight}
                            Z
                          `}
                          fill="url(#areaGradient)"
                        />

                        {/* Line */}
                        <Path
                          d={createSmoothPath(points, screenWidth - 32, graphHeight)}
                          stroke="#60A5FA"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Points */}
                        {points.map((point, index) => (
                          <G key={index}>
                            <Circle
                              cx={index * ((screenWidth - 32) / 6)}
                              cy={point.value}
                              r="4"
                              fill="#60A5FA"
                            />
                            <Circle
                              cx={index * ((screenWidth - 32) / 6)}
                              cy={point.value}
                              r="2"
                              fill="#fff"
                            />
                          </G>
                        ))}
                      </>
                    )}
                  </Svg>

                  {/* Time labels */}
                  <View className="absolute bottom-2 w-full flex-row justify-between px-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <View key={i} className="items-center">
                        <Text className="text-zinc-400 text-xs font-medium">
                          {day}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Weekly stats summary */}
                <View className="flex-row justify-between bg-zinc-800/30 rounded-xl p-4">
                  <View className="items-center">
                    <Text className="text-zinc-400 text-sm mb-1">Weekly Total</Text>
                    <Text className="text-white text-xl font-bold">32.5h</Text>
                    <Text className="text-sky-400 text-xs">+12%</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-zinc-400 text-sm mb-1">Daily Avg</Text>
                    <Text className="text-white text-xl font-bold">4.6h</Text>
                    <Text className="text-emerald-400 text-xs">+5%</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-zinc-400 text-sm mb-1">Best Day</Text>
                    <Text className="text-white text-xl font-bold">Thu</Text>
                    <Text className="text-sky-400 text-xs">7.5h</Text>
                  </View>
                </View>
              </View>
            )}

            {selectedTab === 'sessions' && (
              <View>
                {user.workSessions.filter(session => session.workId === user.work[editIndex]._id && session.date === `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`).map((session, index) => (
                  <View key={index} className="bg-zinc-800/50 rounded-xl p-2 mb-2 flex flex-row justify-between items-center border border-zinc-700/50">
                    <Text className="text-zinc-200 text-base font-pregular">{session.name}</Text>
                    <Text className="text-zinc-600 text-base font-pregular">{session.startTime} - {session.endTime}</Text>
                  </View>
                ))}
              </View>
            )}

            {selectedTab === 'edit' && (
  <View className="p-2 bg-zinc-900 rounded-t-3xl flex-1">
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
            )}


          </View>
        </ScrollView>
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
                          {findCurrentSession().name}
                        </Text>
                        <Text className="text-zinc-200 text-lg font-regular text-center">
                          {findTaskById(findCurrentSession().workId).name}
                        </Text>
                      </View>
                    }
                  >
                    <LinearGradient
                      colors={['#D4D4D8', findTaskById(findCurrentSession().workId).colors[0]]}
                      start={{x: 0, y: 0}}
                      end={{x: 0, y: 1}}
                    >
                      <View className="flex-col items-center justify-center opacity-0">
                        <Text className="text-white text-2xl font-semibold text-center">
                          {findCurrentSession().name}
                        </Text>
                        <Text className="text-zinc-200 text-lg font-regular text-center">
                          {findTaskById(findCurrentSession().workId).name}
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
                    colors={['#52525b', findTaskById(findCurrentSession().workId).colors[0]]}
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
      <BottomPopup
        visible={isDayPopupVisible}
        onClose={() => setIsDayPopupVisible(false)}
        height={0.9}
      >
        <View className="flex-1 bg-zinc-900 p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-2xl font-bold">Sessions</Text>
            <Text className="text-zinc-500 text-lg font-medium">{selectedDate}</Text>
          </View>
          <ScrollView className="flex-1">
            {user.workSessions
              .filter(session => session.date === selectedDate)
              .map((session, index) => (
                <View 
                  key={session.sessionId} 
                  className="bg-zinc-800/70 rounded-xl p-4 mb-3 border border-zinc-700/50"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center">
                      <View 
                        className="w-1 h-10 rounded-full mr-3"
                        style={{backgroundColor: findTaskById(session.workId).colors[0]}}
                      />
                      <Text className="text-white text-lg font-medium">{session.name}</Text>
                    </View>
                    <Text className="text-zinc-400">
                      {session.startTime} - {session.endTime}
                    </Text>
                  </View>
                  <Text className="text-zinc-500 text-sm ml-4">
                    {findTaskById(session.workId).name}
                  </Text>
                </View>
              ))}
          </ScrollView>
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