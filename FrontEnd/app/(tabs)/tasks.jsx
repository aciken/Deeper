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
import images from '../../constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  useEffect(() => {
    setWorks(user.work)
  }, [user.work])

  const [currentTime, setCurrentTime] = useState(0);
  const [sessionName, setSessionName] = useState('');
  const [currentSession, setCurrentSession] = useState(null);
  
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

  const [sessionTimeframe, setSessionTimeframe] = useState('today');
  

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
      return ['#93C5FD', '#60a5fa'];
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
  router.push({
    pathname: 'pages/WorkPage',
    params: { workId: work._id }
  })
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
    axios.put('https://deeper.onrender.com/addJob', {
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
  axios.put('https://deeper.onrender.com/editJob', {
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
    axios.put('https://deeper.onrender.com/deleteJob', {
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


const endSession = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    axios.put('https://deeper.onrender.com/endSession', {
    id: user._id,
    sessionId: findCurrentSession().sessionId,
    timezone
  })
  .then(res => {
    setUser(res.data)
    setIsSessionPageVisible(false)
    setAlertPopupVisible(true)
    setAlertPopupMessage('Session ended')
    setAlertPopupType('success')
  })
  .catch((e) => {
    console.error('Error ending session:', e);
  })
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

    return session.date === currentDate && 
         currentTimeInMinutes >= startTimeInMinutes && 
         currentTimeInMinutes < endTimeInMinutes; // Changed <= to < to exclude endTime
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
  if (!isSessionPageVisible) {
    buttonAnim.setValue(0); // Reset button animation
    slideAnim.setValue(-300); // Reset slide animation
    opacityAnim.setValue(0); // Reset opacity animation
    timerSlideAnim.setValue(400); // Reset timer slide animation
    timerOpacityAnim.setValue(0); // Reset timer opacity animation
  }
}, [isSessionPageVisible]);

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

const startSession = () => {
  let isAdjusted = false;

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if(sessionName === ''){
    setAlertPopupVisible(true);
    setAlertPopupMessage('Please enter a session name');
    setAlertPopupType('info');
  } else if(!selectedWork) {
    setAlertPopupVisible(true);
    setAlertPopupMessage('Please select a work');
    setAlertPopupType('info');
  } else if(duration.hours === 0 && duration.minutes === 0) {
    setAlertPopupVisible(true);
    setAlertPopupMessage('Please select a duration');
    setAlertPopupType('info');
  } else {
    // Check if session would exceed midnight
    const now = new Date();
    const endTime = new Date(now.getTime() + (duration.hours * 60 + duration.minutes) * 60000);
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);

    let adjustedDuration = {...duration};
    
    if (endTime > midnight) {
      // Calculate remaining minutes until midnight
      const minutesUntilMidnight = Math.floor((midnight - now) / 60000);
      adjustedDuration = {
        hours: Math.floor(minutesUntilMidnight / 60),
        minutes: minutesUntilMidnight % 60
      };
      isAdjusted = true;

    }

    axios.put('https://deeper.onrender.com/startSession', {	
      sessionName,
      selectedWork,
      duration: adjustedDuration,
      id: user._id,
      timezone
    })
    .then(async res => {
      if(res.data === 'Time overlap'){
        setAlertPopupVisible(true);
        setAlertPopupMessage('New Session overlaps with existing session');
        setAlertPopupType('error');
      } else {
        if(isAdjusted){
          setAlertPopupVisible(true);
          setAlertPopupMessage('Session started, ends at 00:00');
          setAlertPopupType('info');
        } else {
          setAlertPopupVisible(true);
          setAlertPopupMessage('Session started');
          setAlertPopupType('success');
        }
        setUser(res.data);
        await AsyncStorage.setItem('@user', JSON.stringify(res.data));
        setIsStartSessionPopupVisible(false);
        setSessionName('');
        setSelectedWork(null);
        setDuration({ hours: 0, minutes: 0 });
        setCurrentSession(findCurrentSession()); // Update current session
      }
    })
    .catch((e) => {
      console.error('Error starting session:', e);
    });
  }
}

const formatDate = (date) => {
  const [day, month, year] = date.split(':');
  return `${day.padStart(2, '0')}:${month.padStart(2, '0')}:${year}`;
};

  return(
      <SafeAreaView className="flex-1 h-full bg-zinc-950" edges={['top']}>
        <View className="flex-1">
          <ScrollView className="flex-1 h-full px-4" contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex flex-col justify-between bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50 mb-6">
              <View className="flex flex-row justify-between pb-4">
                <Text className="text-lg text-white font-psemibold">Work Activity</Text>
                <View className="flex-row items-center">
                  <Text className="text-zinc-500 font-psemibold text-xs mr-2">less</Text>
                  <View className="flex-row items-center space-x-1">
                    <LinearGradient
                      colors={['#27272a', '#27272a']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      className="w-3 h-3 rounded-sm"
                    />
                    <LinearGradient
                      colors={['#1d4ed8', '#1e3a8a']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      className="w-3 h-3 rounded-sm"  
                    />
                    <LinearGradient
                      colors={['#3b82f6', '#1d4ed8']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      className="w-3 h-3 rounded-sm"
                    />
                    <LinearGradient
                      colors={['#93C5FD', '#60a5fa']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      className="w-3 h-3 rounded-sm"
                    />
                  </View>
                  <Text className="text-zinc-500 font-psemibold text-xs ml-2">more</Text>
                </View>
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
                    <Text className={`font-pmedium text-sm ${formatDate(getWeekDates().monday) === formatDate(todayDate()) ? 'text-white' : 'text-zinc-700'} mb-2`}>M</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().monday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${formatDate(getWeekDates().monday) === formatDate(todayDate()) ? 'border border-white' : ''} flex-row justify-center items-center`}
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
                  <Text className={`font-pmedium text-sm ${formatDate(getWeekDates().tuesday) === formatDate(todayDate()) ? 'text-white' : 'text-zinc-700'} mb-2`}>T</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().tuesday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${formatDate(getWeekDates().tuesday) === formatDate(todayDate()) ? 'border border-white' : ''} flex-row justify-center items-center`}
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
                  <Text className={`font-pmedium text-sm ${formatDate(getWeekDates().wednesday) === formatDate(todayDate()) ? 'text-white' : 'text-zinc-700'} mb-2`}>W</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().wednesday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${formatDate(getWeekDates().wednesday) === formatDate(todayDate()) ? 'border border-white' : ''} flex-row justify-center items-center`}
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
                  <Text className={`font-pmedium text-sm ${formatDate(getWeekDates().thursday) === formatDate(todayDate()) ? 'text-white' : 'text-zinc-700'} mb-2`}>T</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().thursday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${formatDate(getWeekDates().thursday) === formatDate(todayDate()) ? 'border border-white' : ''} flex-row justify-center items-center`}
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
                  <Text className={`font-pmedium text-sm ${formatDate(getWeekDates().friday) === formatDate(todayDate()) ? 'text-white' : 'text-zinc-700'} mb-2`}>F</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().friday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${formatDate(getWeekDates().friday) === formatDate(todayDate()) ? 'border border-white' : ''} flex-row justify-center items-center`}
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
                  <Text className={`font-pmedium text-sm ${formatDate(getWeekDates().saturday) === formatDate(todayDate()) ? 'text-white' : 'text-zinc-700'} mb-2`}>S</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().saturday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${formatDate(getWeekDates().saturday) === formatDate(todayDate()) ? 'border border-white' : ''} flex-row justify-center items-center`}
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
                    <Text className={`font-pmedium text-sm ${formatDate(getWeekDates().sunday) === formatDate(todayDate()) ? 'text-white' : 'text-zinc-700'} mb-2`}>S</Text>
                  <LinearGradient
            colors={workColors(getWeekDates().sunday)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className={`w-8 h-8 rounded-md ${formatDate(getWeekDates().sunday) === formatDate(todayDate()) ? 'border border-white' : ''} flex-row justify-center items-center`}
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
          const currentHours = parseInt(newWork.currentTime.replace('h', ''));
          if (newWork.currentTime.includes('m')) {
            // If currently showing 0h 30m, don't go lower
            if (currentHours === 0) return;
            setNewWork({...newWork, currentTime: currentHours + 'h'})
          } else {
            // Don't go below 30m
            if (currentHours <= 1) {
              setNewWork({...newWork, currentTime: '0h 30m'})
            } else {
              setNewWork({...newWork, currentTime: (currentHours - 1) + 'h 30m'})
            }
          }
        }}
        className="bg-zinc-700 w-10 h-10 rounded-full items-center justify-center">
          <Text className="text-white text-xl">-</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">{newWork.currentTime}</Text>
        <TouchableOpacity 
        onPress={() => {
          const currentHours = parseInt(newWork.currentTime.replace('h', ''));
          // Don't exceed 24h
          if (currentHours >= 24) return;
          
          if (newWork.currentTime.includes('m')) {
            setNewWork({...newWork, currentTime: (currentHours + 1) + 'h'})
          } else {
            setNewWork({...newWork, currentTime: currentHours + 'h 30m'})
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
				height={Platform.OS === 'android' ? 0.7 : 0.75}
			>
				<View className="flex-1 bg-zinc-900">
					<Text className="text-white text-3xl font-bold p-6 text-center bg-gradient-to-r from-zinc-400 to-zinc-500 bg-clip-text">
						Start Session
					</Text>

					<View className="flex-1 px-4">
						<TextInput
							className="bg-zinc-800/50 text-white p-4 rounded-xl text-lg mb-4"
							placeholder="Work Session Name"
							placeholderTextColor="#71717A"
							value={sessionName}
							onChangeText={setSessionName}
						/>

						<Text className="text-zinc-400 text-base mb-2">Set Duration</Text>
						<View className="bg-zinc-800/50 rounded-xl p-4">
							{Platform.OS === 'ios' ? (
								<DateTimePicker
									value={new Date(0, 0, 0, duration.hours, duration.minutes)}
									mode="time"
									display="spinner"
									onChange={(event, selectedDate) => {
										if (selectedDate) {
											setDuration({
												hours: selectedDate.getHours(),
												minutes: Math.round(selectedDate.getMinutes() / 5) * 5
											});
										}
									}}
									style={{height: 120}}
									textColor="white"
								/>
							) : (
								<View className="flex-row justify-between items-center">
									<View className="flex-row items-center">
										<TouchableOpacity
											onPress={() => setDuration(prev => ({
												...prev,
												hours: prev.hours > 0 ? prev.hours - 1 : 23
											}))}
											className="p-2"
										>
											<Text className="text-zinc-400 text-2xl">-</Text>
										</TouchableOpacity>
										<Text className="text-white text-xl mx-4">{duration.hours.toString().padStart(2, '0')}</Text>
										<TouchableOpacity
											onPress={() => setDuration(prev => ({
												...prev,
												hours: prev.hours < 23 ? prev.hours + 1 : 0
											}))}
											className="p-2"
										>
											<Text className="text-zinc-400 text-2xl">+</Text>
										</TouchableOpacity>
									</View>

									<Text className="text-white text-xl">:</Text>

									<View className="flex-row items-center">
										<TouchableOpacity
											onPress={() => setDuration(prev => ({
												...prev,
												minutes: prev.minutes > 0 ? prev.minutes - 5 : 55
											}))}
											className="p-2"
										>
											<Text className="text-zinc-400 text-2xl">-</Text>
										</TouchableOpacity>
										<Text className="text-white text-xl mx-4">{duration.minutes.toString().padStart(2, '0')}</Text>
										<TouchableOpacity
											onPress={() => setDuration(prev => ({
												...prev,
												minutes: prev.minutes < 55 ? prev.minutes + 5 : 0
											}))}
											className="p-2"
										>
											<Text className="text-zinc-400 text-2xl">+</Text>
										</TouchableOpacity>
									</View>
								</View>
							)}
						</View>
					</View>

					<View className="bg-zinc-900 p-4">
						<Text className="text-zinc-400 text-base mb-2">Select Work</Text>
						<ScrollView 
							horizontal 
							showsHorizontalScrollIndicator={false}
							className="mb-4"
						>
							<View className="flex-row space-x-2">
								{works.map((work, index) => (
									<TouchableOpacity
										key={index}
										onPress={() => setSelectedWork(work)}
										className={`p-4 rounded-xl border min-w-[140px] ${
											selectedWork === work 
											? 'bg-zinc-800/80 border-sky-500/50' 
											: 'bg-zinc-800/50 border-transparent'
										}`}
									>
										<View className="flex-row items-center mb-2">
											<View className="w-6 h-6 rounded-full overflow-hidden">
												<LinearGradient
													colors={work.colors}
													start={{x: 0, y: 0}}
													end={{x: 1, y: 1}}
													className="w-full h-full"
												/>
											</View>
											{selectedWork === work && (
												<View className="w-3 h-3 rounded-full bg-sky-500 ml-auto" />
											)}
										</View>
										<Text className="text-white text-base">{work.name}</Text>
									</TouchableOpacity>
								))}
							</View>
						</ScrollView>

						<TouchableOpacity 
							onPress={startSession}
							className="overflow-hidden rounded-xl"
						>
							<LinearGradient
								colors={['#0ea5e9', '#60a5fa']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 1}}
								className="py-4 flex-row justify-center items-center"
							>
								<Image source={icons.play} className="w-6 h-6 tint-white" />
								<Text className="text-white text-xl font-semibold ml-2">Start Session</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
				</View>
			</BottomPopup>

      <BottomPopup
        visible={isWorkEditPopupVisible}
        onClose={() => setIsWorkEditPopupVisible(false)}
        height={0.90}
      >
        <ScrollView className="flex-1 bg-zinc-900">
          <ScrollView className="p-4 rounded-t-3xl">
            <View className="flex-row justify-center items-center mb-4">
              <LinearGradient
                colors={editWork.colors}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                className="w-6 h-6 rounded-full mr-3"
              />
              <Text className="text-white text-2xl font-bold">{editWork.name}</Text>
            </View>

            <View className="flex-row justify-center items-center bg-zinc-800/30 rounded-full p-1 mb-6">
              <TouchableOpacity 
                onPress={() => setSelectedTab('stats')}
                className={`flex-1 py-2 px-4 rounded-full ${selectedTab === 'stats' ? 'bg-zinc-800' : ''}`}
              >
                <Text className={`text-base font-medium text-center ${selectedTab === 'stats' ? 'text-white' : 'text-zinc-500'}`}>Stats</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSelectedTab('sessions')}
                className={`flex-1 py-2 px-4 rounded-full ${selectedTab === 'sessions' ? 'bg-zinc-800' : ''}`}
              >
                <Text className={`text-base font-medium text-center ${selectedTab === 'sessions' ? 'text-white' : 'text-zinc-500'}`}>Sessions</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSelectedTab('edit')}
                className={`flex-1 py-2 px-4 rounded-full ${selectedTab === 'edit' ? 'bg-zinc-800' : ''}`}
              >
                <Text className={`text-base font-medium text-center ${selectedTab === 'edit' ? 'text-white' : 'text-zinc-500'}`}>Edit</Text>
              </TouchableOpacity>
            </View>

            {selectedTab === 'stats' && (
              <ScrollView className="mb-6">
                {/* Last 7 days */}
                <Text className="text-zinc-400 text-sm font-medium mb-4">Last 7 days</Text>

                {/* Weekly stats summary */}
                <View className="bg-zinc-800/30 rounded-2xl p-6 space-y-6 shadow-lg border border-zinc-800/50">
                  
                  {/* Top row stats */}
                  <View className="flex-row justify-between">
                    <View className="items-center bg-zinc-800/50 p-4 rounded-xl flex-1 mr-3">
                      <Text className="text-zinc-400 text-sm mb-2 font-medium">Weekly Total</Text>
                      <Text className="text-white text-2xl font-bold">{(() => {
                        if (editIndex === null) return '0:00';
                        
                        let totalMinutes = 0;
                        const today = new Date();
                        const sevenDaysAgo = new Date(today);
                        sevenDaysAgo.setDate(today.getDate() - 7);

                        user.workSessions
                          .filter(session => {
                            const [day, month, year] = session.date.split(':').map(Number);
                            const sessionDate = new Date(year, month - 1, day);
                            return session.workId === user.work[editIndex]._id && 
                                   sessionDate >= sevenDaysAgo && 
                                   sessionDate <= today;
                          })
                          .forEach(session => {
                            const [startHours, startMinutes] = session.startTime.split(':').map(Number);
                            const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                            const startInMinutes = startHours * 60 + startMinutes;
                            const endInMinutes = endHours * 60 + endMinutes;
                            totalMinutes += endInMinutes - startInMinutes;
                          });
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        return `${hours}:${minutes.toString().padStart(2, '0')}`;
                      })()}h</Text>
                    </View>

                    <View className="items-center bg-zinc-800/50 p-4 rounded-xl flex-1">
                      <Text className="text-zinc-400 text-sm mb-2 font-medium">Daily Average</Text>
                      <Text className="text-white text-2xl font-bold">{(() => {
                        if (editIndex === null) return '0:00';
                        
                        let totalMinutes = 0;
                        const today = new Date();
                        const sevenDaysAgo = new Date(today);
                        sevenDaysAgo.setDate(today.getDate() - 7);

                        user.workSessions
                          .filter(session => {
                            const [day, month, year] = session.date.split(':').map(Number);
                            const sessionDate = new Date(year, month - 1, day);
                            return session.workId === user.work[editIndex]._id && 
                                   sessionDate >= sevenDaysAgo && 
                                   sessionDate <= today;
                          })
                          .forEach(session => {
                            const [startHours, startMinutes] = session.startTime.split(':').map(Number);
                            const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                            const startInMinutes = startHours * 60 + startMinutes;
                            const endInMinutes = endHours * 60 + endMinutes;
                            totalMinutes += endInMinutes - startInMinutes;
                          });

                        const avgMinutesPerDay = totalMinutes / 7;
                        const hours = Math.floor(avgMinutesPerDay / 60);
                        const minutes = Math.round(avgMinutesPerDay % 60);
                        return `${hours}:${minutes.toString().padStart(2, '0')}`;
                      })()}h</Text>
                    </View>
                  </View>

                  <View className="items-center">
                    {(() => {
                      if (editIndex === null) return <Text className="text-zinc-400 text-xs">-</Text>;
                      
                      const today = new Date();
                      const sevenDaysAgo = new Date(today);
                      sevenDaysAgo.setDate(today.getDate() - 7);
                      const fourteenDaysAgo = new Date(today);
                      fourteenDaysAgo.setDate(today.getDate() - 14);
                      
                      let thisWeekTotal = 0;
                      let lastWeekTotal = 0;

                      // Calculate this week and last week totals
                      user.workSessions
                        .filter(session => session.workId === user.work[editIndex]._id)
                        .forEach(session => {
                          const [day, month, year] = session.date.split(':').map(Number);
                          const sessionDate = new Date(year, month - 1, day);
                          const [startHours, startMinutes] = session.startTime.split(':').map(Number);
                          const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                          const duration = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);

                          if (sessionDate >= sevenDaysAgo && sessionDate <= today) {
                            thisWeekTotal += duration;
                          } else if (sessionDate >= fourteenDaysAgo && sessionDate < sevenDaysAgo) {
                            lastWeekTotal += duration;
                          }
                        });

                      if (lastWeekTotal === 0 && thisWeekTotal === 0) {
                        return <Text className="text-zinc-400 text-xs">-</Text>;
                      }
                      
                      if (lastWeekTotal === 0 && thisWeekTotal > 0) {
                        return <Text className="text-emerald-400 text-xs font-medium">+100% from last week</Text>;
                      }

                      const percentChange = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;
                      const roundedChange = Math.round(percentChange);
                      const textColor = roundedChange >= 0 ? 'text-emerald-400' : 'text-red-400';

                      return (
                        <Text className={`${textColor} text-xs font-medium`}>
                          {`${roundedChange >= 0 ? '+' : ''}${roundedChange}% from last week`}
                        </Text>
                      );
                    })()}
                  </View>

                  {/* Divider */}
                  <View className="border-t border-zinc-800" />

                  {/* Middle row stats */}
                  <View className="flex-row justify-between">
                    <View className="items-center bg-zinc-800/50 p-4 rounded-xl flex-1 mr-3">
                      <Text className="text-zinc-400 text-sm mb-2 font-medium">Most Productive Day</Text>
                      <Text className="text-white text-2xl font-bold">
                        {(() => {
                          if (editIndex === null) return '-';
                          
                          const today = new Date();
                          const sevenDaysAgo = new Date(today);
                          sevenDaysAgo.setDate(today.getDate() - 7);

                          const dailyMinutes = {};
                          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                          user.workSessions
                            .filter(session => {
                              const [day, month, year] = session.date.split(':').map(Number);
                              const sessionDate = new Date(year, month - 1, day);
                              return session.workId === user.work[editIndex]._id && 
                                     sessionDate >= sevenDaysAgo && 
                                     sessionDate <= today;
                            })
                            .forEach(session => {
                              const [day, month, year] = session.date.split(':').map(Number);
                              const sessionDate = new Date(year, month - 1, day);
                              const dayName = dayNames[sessionDate.getDay()];
                              
                              const [startHours, startMinutes] = session.startTime.split(':').map(Number);
                              const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                              const sessionMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
                              
                              dailyMinutes[dayName] = (dailyMinutes[dayName] || 0) + sessionMinutes;
                            });

                          let bestDay = '-';
                          let maxMinutes = 0;
                          
                          Object.entries(dailyMinutes).forEach(([day, minutes]) => {
                            if (minutes > maxMinutes) {
                              maxMinutes = minutes;
                              bestDay = day;
                            }
                          });

                          return bestDay;
                        })()}
                      </Text>
                      <Text className="text-xs text-sky-400 font-medium">
                        {(() => {
                          if (editIndex === null) return '0h';
                          
                          const today = new Date();
                          const sevenDaysAgo = new Date(today);
                          sevenDaysAgo.setDate(today.getDate() - 7);

                          const dailyMinutes = {};

                          user.workSessions
                            .filter(session => {
                              const [day, month, year] = session.date.split(':').map(Number);
                              const sessionDate = new Date(year, month - 1, day);
                              return session.workId === user.work[editIndex]._id && 
                                     sessionDate >= sevenDaysAgo && 
                                     sessionDate <= today;
                            })
                            .forEach(session => {
                              const [startHours, startMinutes] = session.startTime.split(':').map(Number);
                              const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                              const sessionMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
                              
                              const [day, month, year] = session.date.split(':').map(Number);
                              const sessionDate = new Date(year, month - 1, day);
                              const dayName = sessionDate.toLocaleDateString('en-US', { weekday: 'short' });
                              
                              dailyMinutes[dayName] = (dailyMinutes[dayName] || 0) + sessionMinutes;
                            });

                          const maxMinutes = Math.max(...Object.values(dailyMinutes), 0);
                          const hours = Math.floor(maxMinutes / 60);
                          const minutes = Math.round(maxMinutes % 60);
                          
                          return `${hours}:${minutes.toString().padStart(2, '0')}h`;
                        })()}
                      </Text>
                    </View>

                    <View className="items-center bg-zinc-800/50 p-4 rounded-xl flex-1">
                      <Text className="text-zinc-400 text-sm mb-2 font-medium">Weekly Goal Progress</Text>
                      <Text className="text-white text-2xl font-bold">{(() => {
                        if (editIndex === null) return '0%';
                        
                        let totalMinutes = 0;
                        const today = new Date();
                        const sevenDaysAgo = new Date(today);
                        sevenDaysAgo.setDate(today.getDate() - 7);

                        user.workSessions
                          .filter(session => {
                            const [day, month, year] = session.date.split(':').map(Number);
                            const sessionDate = new Date(year, month - 1, day);
                            return session.workId === user.work[editIndex]._id && 
                                   sessionDate >= sevenDaysAgo && 
                                   sessionDate <= today;
                          })
                          .forEach(session => {
                            const [startHours, startMinutes] = session.startTime.split(':').map(Number);
                            const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                            const startInMinutes = startHours * 60 + startMinutes;
                            const endInMinutes = endHours * 60 + endMinutes;
                            totalMinutes += endInMinutes - startInMinutes;
                          });

                        const goalMinutes = parseInt(user.work[editIndex].currentTime) * 7 * 60;
                        const percentage = Math.round((totalMinutes / goalMinutes) * 100);
                        
                        return `${percentage}%`;
                      })()}</Text>
                      <Text className="text-sky-400 text-xs font-medium">{(() => {
                        if (editIndex === null) return '0:00h / 0:00h';
                        
                        let totalMinutes = 0;
                        const today = new Date();
                        const sevenDaysAgo = new Date(today);
                        sevenDaysAgo.setDate(today.getDate() - 7);

                        user.workSessions
                          .filter(session => {
                            const [day, month, year] = session.date.split(':').map(Number);
                            const sessionDate = new Date(year, month - 1, day);
                            return session.workId === user.work[editIndex]._id && 
                                   sessionDate >= sevenDaysAgo && 
                                   sessionDate <= today;
                          })
                          .forEach(session => {
                            const [startHours, startMinutes] = session.startTime.split(':').map(Number);
                            const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                            const startInMinutes = startHours * 60 + startMinutes;
                            const endInMinutes = endHours * 60 + endMinutes;
                            totalMinutes += endInMinutes - startInMinutes;
                          });

                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        
                        const goalHours = parseInt(user.work[editIndex].currentTime) * 7;
                        
                        return `${hours}:${minutes.toString().padStart(2, '0')}h / ${goalHours}:00h`;
                      })()}</Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="border-t border-zinc-800" />

                  {/* Bottom row stats */}
                  <View className="flex-row justify-between">
                    <View className="items-center bg-zinc-800/50 p-4 rounded-xl flex-1 mr-3">
                      <Text className="text-zinc-400 text-sm mb-2 font-medium">Longest Session</Text>
                      <Text className="text-white text-2xl font-bold">{(() => {
                        if (editIndex === null) return '0:00h';
                        
                        let longestDuration = 0;
                        const today = new Date();
                        const sevenDaysAgo = new Date(today);
                        sevenDaysAgo.setDate(today.getDate() - 7);

                        user.workSessions
                          .filter(session => {
                            const [day, month, year] = session.date.split(':').map(Number);
                            const sessionDate = new Date(year, month - 1, day);
                            return session.workId === user.work[editIndex]._id && 
                                   sessionDate >= sevenDaysAgo && 
                                   sessionDate <= today;
                          })
                          .forEach(session => {
                            const [startHours, startMinutes] = session.startTime.split(':').map(Number);
                            const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                            const startInMinutes = startHours * 60 + startMinutes;
                            const endInMinutes = endHours * 60 + endMinutes;
                            const duration = endInMinutes - startInMinutes;
                            longestDuration = Math.max(longestDuration, duration);
                          });

                        const hours = Math.floor(longestDuration / 60);
                        const minutes = longestDuration % 60;
                        return `${hours}:${minutes.toString().padStart(2, '0')}h`;
                      })()}</Text>
                      <Text className="text-emerald-400 text-xs font-medium">{(() => {
                        if (editIndex === null) return '';
                        
                        let longestSession = null;
                        let longestDuration = 0;
                        const today = new Date();
                        const sevenDaysAgo = new Date(today);
                        sevenDaysAgo.setDate(today.getDate() - 7);
                        
                        user.workSessions
                          .filter(session => {
                            const [day, month, year] = session.date.split(':').map(Number);
                            const sessionDate = new Date(year, month - 1, day);
                            return session.workId === user.work[editIndex]._id && 
                                   sessionDate >= sevenDaysAgo && 
                                   sessionDate <= today;
                          })
                          .forEach(session => {
                            const [startHours, startMinutes] = session.startTime.split(':').map(Number);
                            const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                            const startInMinutes = startHours * 60 + startMinutes;
                            const endInMinutes = endHours * 60 + endMinutes;
                            const duration = endInMinutes - startInMinutes;
                            
                            if (duration > longestDuration) {
                              longestDuration = duration;
                              longestSession = session;
                            }
                          });

                        if (!longestSession) return '';
                        
                        const [day, month, year] = longestSession.date.split(':').map(Number);
                        const date = new Date(year, month - 1, day);
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                        return `Started ${dayName} ${longestSession.startTime}`;
                      })()}</Text>
                    </View>
                    <View className="items-center bg-zinc-800/50 p-4 rounded-xl flex-1">
                      <Text className="text-zinc-400 text-sm mb-2 font-medium">Total Sessions</Text>
                      <Text className="text-white text-2xl font-bold">{(() => {
                        if (editIndex === null) return '0';
                        
                        const today = new Date();
                        const sevenDaysAgo = new Date(today);
                        sevenDaysAgo.setDate(today.getDate() - 7);
                        
                        const thisWeekSessions = user.workSessions.filter(session => {
                          const [day, month, year] = session.date.split(':').map(Number);
                          const sessionDate = new Date(year, month - 1, day);
                          return session.workId === user.work[editIndex]._id && 
                                 sessionDate >= sevenDaysAgo && 
                                 sessionDate <= today;
                        }).length;
                        
                        return thisWeekSessions;
                      })()}</Text>
                      <Text className={`text-xs font-medium ${(() => {
                        if (editIndex === null) return 'text-zinc-400';
                        
                        const today = new Date();
                        const sevenDaysAgo = new Date(today);
                        sevenDaysAgo.setDate(today.getDate() - 7);
                        const fourteenDaysAgo = new Date(today);
                        fourteenDaysAgo.setDate(today.getDate() - 14);
                        
                        const thisWeekSessions = user.workSessions.filter(session => {
                          const [day, month, year] = session.date.split(':').map(Number);
                          const sessionDate = new Date(year, month - 1, day);
                          return session.workId === user.work[editIndex]._id && 
                                 sessionDate >= sevenDaysAgo && 
                                 sessionDate <= today;
                        }).length;
                        
                        const lastWeekSessions = user.workSessions.filter(session => {
                          const [day, month, year] = session.date.split(':').map(Number);
                          const sessionDate = new Date(year, month - 1, day);
                          return session.workId === user.work[editIndex]._id && 
                                 sessionDate >= fourteenDaysAgo && 
                                 sessionDate < sevenDaysAgo;
                        }).length;
                        
                        const diff = thisWeekSessions - lastWeekSessions;
                        return diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-zinc-400';
                      })()}`}>{(() => {
                        if (editIndex === null) return '-';
                        
                        const today = new Date();
                        const sevenDaysAgo = new Date(today);
                        sevenDaysAgo.setDate(today.getDate() - 7);
                        const fourteenDaysAgo = new Date(today);
                        fourteenDaysAgo.setDate(today.getDate() - 14);
                        
                        const thisWeekSessions = user.workSessions.filter(session => {
                          const [day, month, year] = session.date.split(':').map(Number);
                          const sessionDate = new Date(year, month - 1, day);
                          return session.workId === user.work[editIndex]._id && 
                                 sessionDate >= sevenDaysAgo && 
                                 sessionDate <= today;
                        }).length;
                        
                        const lastWeekSessions = user.workSessions.filter(session => {
                          const [day, month, year] = session.date.split(':').map(Number);
                          const sessionDate = new Date(year, month - 1, day);
                          return session.workId === user.work[editIndex]._id && 
                                 sessionDate >= fourteenDaysAgo && 
                                 sessionDate < sevenDaysAgo;
                        }).length;
                        
                        const diff = thisWeekSessions - lastWeekSessions;
                        return diff > 0 ? `+${diff} from last week` : diff < 0 ? `${diff} from last week` : 'Same as last week';
                      })()}</Text>
                    </View>
                  </View>

                </View>
              </ScrollView>
            )}

            {selectedTab === 'sessions' && (
              <View style={{ height: '80%' }}>
                {/* Fixed Header */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1, backgroundColor: '#18181b', paddingHorizontal: 16 }}>
                  <View className="flex-row justify-center items-center bg-zinc-800/30 rounded-full p-1 mb-4">
                    <TouchableOpacity 
                      onPress={() => setSessionTimeframe('today')}
                      className={`flex-1 py-2 px-4 rounded-full ${sessionTimeframe === 'today' ? 'bg-zinc-800' : ''}`}
                    >
                      <Text className={`text-base font-medium text-center ${sessionTimeframe === 'today' ? 'text-white' : 'text-zinc-500'}`}>Today</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setSessionTimeframe('week')}
                      className={`flex-1 py-2 px-4 rounded-full ${sessionTimeframe === 'week' ? 'bg-zinc-800' : ''}`}
                    >
                      <Text className={`text-base font-medium text-center ${sessionTimeframe === 'week' ? 'text-white' : 'text-zinc-500'}`}>Last 7 Days</Text>
                    </TouchableOpacity>
                  </View>

                  <Text className="text-zinc-400 text-sm font-medium mb-4">
                    {sessionTimeframe === 'today' ? "Today's Sessions" : "Last 7 Days Sessions"}
                  </Text>
                </View>

                {/* Scrollable Content */}
                <ScrollView 
                  style={{ marginTop: 100 }}
                  contentContainerStyle={{ padding: 16 }}
                  showsVerticalScrollIndicator={true}
                >
                  {user.workSessions.filter(session => {
                    const [day, month, year] = session.date.split(':').map(Number);
                    const sessionDate = new Date(year, month - 1, day);
                    const today = new Date();
                    const sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(today.getDate() - 7);

                    if (sessionTimeframe === 'today') {
                      return session.workId === user.work[editIndex]._id && 
                             session.date === `${today.getDate()}:${today.getMonth() + 1}:${today.getFullYear()}`;
                    } else {
                      return session.workId === user.work[editIndex]._id && 
                             sessionDate >= sevenDaysAgo && 
                             sessionDate <= today;
                    }
                  }).map((session, index) => (
                    <View key={index} className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-800/50 shadow-lg mb-4">
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                          <View className="w-2 h-2 rounded-full bg-sky-400 mr-3" />
                          <Text className="text-white text-base font-medium">{session.name}</Text>
                        </View>
                        <View className="bg-zinc-800/50 px-3 py-1 rounded-full">
                          <Text className="text-sky-400 text-sm font-medium">
                            {session.startTime} - {session.endTime}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}

                  {user.workSessions.filter(session => 
                    session.workId === user.work[editIndex]._id && 
                    session.date === `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`
                  ).length === 0 && (
                    <View className="items-center py-6">
                      <Text className="text-zinc-600 text-base">No sessions today</Text>
                    </View>
                  )}

                  {/* Bottom Padding */}
                  <View className="h-32" />
                </ScrollView>
              </View>
            )}

            {selectedTab === 'edit' && (
              <View className="p-2 bg-zinc-900 rounded-t-3xl flex-1">
                {/* Work Name Input */}
                <View className="mb-6">
                  <Text className="text-zinc-400 text-sm font-medium mb-2">Work Name</Text>
                  <TextInput
                    className="bg-zinc-800/50 text-white p-4 rounded-xl border border-zinc-800"
                    placeholder="Work Name" 
                    placeholderTextColor="#71717A"
                    value={editWork.name}
                    onChangeText={(text) => setEditWork({...editWork, name: text})}
                    style={{fontSize: 16}}
                  />
                </View>

                {/* Color Selection */}
                <View className="mb-6">
                  <Text className="text-zinc-400 text-sm font-medium mb-3">Color Theme</Text>
                  <View className="flex-row justify-between px-2">
                    {ballColors.map((color, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          if (!works.some(work => work.colors[0] === color[0] && work.colors[1] === color[1]) || 
                              (initialEditWork.colors[0] === color[0] && initialEditWork.colors[1] === color[1])) {
                            setEditWork({...editWork, colors: color});
                          }
                        }}
                        className="p-1"
                      >
                        <LinearGradient
                          colors={color}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 1}}
                          className={`w-10 h-10 rounded-full shadow-lg ${
                            works.some(work => work.colors[0] === color[0] && work.colors[1] === color[1]) && 
                            (initialEditWork.colors[0] !== color[0] && initialEditWork.colors[1] !== color[1]) 
                              ? 'opacity-20' 
                              : ''
                          } ${
                            editWork.colors[0] === color[0] && editWork.colors[1] === color[1]
                              ? 'border-2 border-white'
                              : ''
                          }`}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Daily Target Time */}
                <View className="mb-6">
                  <Text className="text-zinc-400 text-sm font-medium mb-3">Daily Target Time</Text>
                  <View className="flex-row items-center justify-between bg-zinc-800/50 rounded-xl p-3 border border-zinc-800">
                    <TouchableOpacity 
                      onPress={() => {
                        if (editWork.currentTime.includes('m')) { 
                          setEditWork({...editWork, currentTime: parseInt(editWork.currentTime.replace('h', '')) + 'h'})
                        } else {
                          setEditWork({...editWork, currentTime: parseInt(editWork.currentTime.replace('h', '')) - 1 + 'h 30m'})
                        }
                      }}
                      className="bg-zinc-700/80 w-12 h-12 rounded-full items-center justify-center shadow-lg"
                    >
                      <Text className="text-white text-xl font-medium">-</Text>
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
                      className="bg-zinc-700/80 w-12 h-12 rounded-full items-center justify-center shadow-lg"
                    >
                      <Text className="text-white text-xl font-medium">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-1" />

                {/* Action Buttons */}
                <View className="flex-row justify-between space-x-3 mt-4">
                  <TouchableOpacity 
                    onPress={submitEditWork}
                    className="flex-1"
                  >
                    <LinearGradient
                      colors={['#0ea5e9', '#60a5fa']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      className="rounded-full py-4 items-center shadow-lg"
                    >
                      <Text className="text-white text-lg font-semibold">Save Changes</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={submitDeleteWork}
                    className="w-14 h-14"
                  >
                    <LinearGradient
                      colors={['#DC2626', '#991B1B']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      className="w-14 h-14 rounded-full items-center justify-center shadow-lg"
                    >
                      <Image source={icons.trash} className="w-6 h-6 tint-white" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}


          </ScrollView>
        </ScrollView>
      </BottomPopup>

      <BottomPopup
        visible={isSessionPageVisible}
        onClose={handleSessionClose}
        height={0.85}
      >
        <View className="flex-1 bg-zinc-900">
          {findCurrentSession() && (
            <>
              {/* Header Section */}
              <View className="px-6 pt-6 pb-8">
                <Animated.View
                  style={{
                    transform: [{ translateX: slideAnim }],
                    opacity: opacityAnim
                  }}
                >                
                  <View className="flex-row items-center mb-4">
                    <LinearGradient
                      colors={findTaskById(findCurrentSession().workId).colors}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      className="w-12 h-12 rounded-2xl mr-4 items-center justify-center"
                    >
                      <Image source={icons.target} className="w-6 h-6 tint-zinc-900" />
                    </LinearGradient>
                    <View>
                      <Text className="text-zinc-400 text-base font-medium mb-1">Current Session</Text>
                      <Text className="text-white text-2xl font-bold">
                        {findCurrentSession().name}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center">
                    <View className="w-1.5 h-1.5 rounded-full bg-zinc-700 mr-2" />
                    <Text className="text-zinc-500 font-medium">
                      {findTaskById(findCurrentSession().workId).name}
                    </Text>
                  </View>
                </Animated.View>
              </View>

              {/* Timer Section */}
              <View className="flex-1 px-6">
                <Animated.View 
                  style={{
                    transform: [{ translateX: timerSlideAnim }],
                    opacity: timerOpacityAnim
                  }}
                >
                  {/* Main Timer Display */}
                  <View className="bg-zinc-800/30 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800/50">
                    <View className="items-center">
                      <MaskedView
                        maskElement={
                          <Text className="text-8xl font-bold text-center tracking-tight">
                            {formatTime(timeInSeconds).split(':')[0]}
                          </Text>
                        }
                      >
                        <LinearGradient
                          colors={findTaskById(findCurrentSession().workId).colors}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                        >
                          <Text className="text-8xl font-bold text-center tracking-tight opacity-0">
                            {formatTime(timeInSeconds).split(':')[0]}
                          </Text>
                        </LinearGradient>
                      </MaskedView>
                      
                      <View className="flex-row items-center mt-2">
                        <Text className="text-2xl font-semibold text-zinc-400">
                          {formatTime(timeInSeconds).split(':').slice(1).join(':')}
                        </Text>
                        <View className="w-1 h-1 rounded-full bg-zinc-700 mx-3" />
                        <Text className="text-zinc-500 font-medium">remaining</Text>
                      </View>
                    </View>
                  </View>

                  {/* Time Details */}
                  <View className="mt-8 space-y-3 mb-24">
                    <View className="bg-zinc-800/30 backdrop-blur-xl rounded-2xl">
                      <View className="flex-row items-center p-4">
                        <View className="w-10 h-10 rounded-xl bg-zinc-700/30 items-center justify-center mr-4">
                          <Image source={icons.clockGray} className="w-5 h-5 tint-zinc-400" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-zinc-400 text-sm mb-1">Start Time</Text>
                          <Text className="text-white text-lg font-semibold">{findCurrentSession().startTime}</Text>
                        </View>
                      </View>
                    </View>

                    <View className="bg-zinc-800/30 backdrop-blur-xl rounded-2xl">
                      <View className="flex-row items-center p-4">
                        <View className="w-10 h-10 rounded-xl bg-zinc-700/30 items-center justify-center mr-4">
                          <Image source={icons.timerWhite} className="w-5 h-5 tint-zinc-400" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-zinc-400 text-sm mb-1">End Time</Text>
                          <Text className="text-white text-lg font-semibold">{findCurrentSession().endTime}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              </View>

              {/* End Session Button */}
              <View className="p-6 absolute bottom-0 left-0 right-0 bg-zinc-900">
                <TouchableOpacity 
                  onPress={endSession}
                  className="w-full"
                >
                  <LinearGradient
                    colors={findTaskById(findCurrentSession().workId).colors}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    className="w-full h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-black/50"
                  >
                    <Text className="text-zinc-900 text-lg font-semibold">End Session</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
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
          <ScrollView 
            className="flex-1"
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            contentContainerStyle={{flexGrow: 1}}
          >
            {user.workSessions
              .filter(session => session.date === selectedDate)
              .map((session, index) => (
                <TouchableOpacity
                  key={session.sessionId}
                  activeOpacity={0.7}
                >
                  <View 
                    className="bg-zinc-800/70 rounded-xl p-4 mb-3 border border-zinc-700/50"
                  >
                    <View className="flex-row justify-between items-center mb-2">
                      <View className="flex-row items-center">
                        <View 
                          className="w-1 h-10 rounded-full mr-3"
                          style={{backgroundColor: findTaskById(session.workId)?.colors?.[0] || 'white'}}
                        />
                        <Text className="text-white text-lg font-medium">{session.name}</Text>
                      </View>
                      <Text className="text-zinc-400">
                        {session.startTime} - {session.endTime}
                      </Text>
                    </View>
                    <Text className="text-zinc-500 text-sm ml-4">
                      {findTaskById(session.workId)?.name || '-'}
                    </Text>
                  </View>
                </TouchableOpacity>
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