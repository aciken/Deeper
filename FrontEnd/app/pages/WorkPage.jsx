import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';
import { icons } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Svg, { 
  Circle, 
  Path, 
  Defs, 
  LinearGradient as SvgLinearGradient, 
  Stop,
  G 
} from 'react-native-svg';
import { Dimensions } from 'react-native';
import AlertPopup from '../components/AlertPopup';

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

const WorkPage = () => {
  const router = useRouter();
  const { user, setUser } = useGlobalContext();
  const { workId } = useLocalSearchParams();
  const [sessionTimeframe, setSessionTimeframe] = useState('today');
  const [selectedTab, setSelectedTab] = useState('stats');
  const [editWork, setEditWork] = useState(null);
  const [points, setPoints] = useState([
    { day: 'Mon', value: 0 },
    { day: 'Tue', value: 0 },
    { day: 'Wed', value: 0 },
    { day: 'Thu', value: 0 },
    { day: 'Fri', value: 0 },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 },
  ]);
  const [works, setWorks] = useState(user.work);
  const [editIndex, setEditIndex] = useState(null);
  const [alertPopupVisible, setAlertPopupVisible] = useState(false);
  const [alertPopupMessage, setAlertPopupMessage] = useState('');
  const [alertPopupType, setAlertPopupType] = useState('info');

  const screenWidth = Dimensions.get('window').width;
  const graphHeight = 200;

  const work = user.work.find(w => w._id === workId);

  const ballColors = [
    ['#DC2626', '#761414'],
    ['#16A34A', '#083D1C'],
    ['#2563EB', '#153885'],
    ['#9333EA', '#531D84'],
    ['#FACC15', '#94790C'],
    ['#0EA5E9', '#085D83'],
    ['#EC4899', '#862957'],
  ];

  useEffect(() => {
    if (!editWork && work) {
      setEditWork({
        ...work,
        currentTime: work.currentTime || '1h'
      });
    }
  }, [work]);

  useEffect(() => {
    if (work) {
      const index = user.work.findIndex(w => w._id === workId);
      setEditIndex(index);
    }
  }, [work]);

  useEffect(() => {
    if (!work) return;

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const dailyMinutes = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Initialize all days with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dailyMinutes[dayNames[date.getDay()]] = 0;
    }

    // Calculate minutes for each day
    user.workSessions
      .filter(session => {
        const [day, month, year] = session.date.split(':').map(Number);
        const sessionDate = new Date(year, month - 1, day);
        return session.workId === workId && 
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

    const maxMinutes = Math.max(...Object.values(dailyMinutes), 60);
    const newPoints = Object.entries(dailyMinutes).map(([day, minutes]) => ({
      day,
      value: graphHeight - (minutes / maxMinutes) * graphHeight + 40
    }));

    setPoints(newPoints);
  }, [work, user.workSessions]);

  const submitEditWork = () => {
    axios.put('https://deeper.onrender.com/editJob', {
      editWork,
      index: editIndex,
      id: user._id,
    }).then(res => {
      setUser(res.data)
      // Navigate back before setting any other state
      router.back()
    }).catch(error => {
      setAlertPopupMessage('Error updating work');
      setAlertPopupType('error');
      setAlertPopupVisible(true);
    })
  }
  
  const submitDeleteWork = () => {
    if(user.work.length !== 1){
      axios.put('https://deeper.onrender.com/deleteJob', {
        index: editIndex,
        id: user._id,
      }).then(res => {
        // First update user state
        setUser(res.data);
        router.back();


      }).catch(error => {
        setAlertPopupMessage('Error deleting work');
        setAlertPopupType('error');
        setAlertPopupVisible(true);
      });
    } else {
      setAlertPopupMessage('You need to have at least one work');
      setAlertPopupType('error');
      setAlertPopupVisible(true);
    }
  }

  if (!work) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1">
        {/* Header with work color - simplified */}
        <View className="flex-row items-center px-4 mb-2">
          <View className="w-5 h-5 rounded-full overflow-hidden mr-3">
            <LinearGradient
              colors={work.colors}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              className="w-full h-full"
            />
          </View>
          <Text className="text-white text-xl font-bold">{work.name}</Text>
        </View>

        {/* Tabs */}
        <View className="px-4 py-3">
          <View className="flex-row justify-center items-center bg-zinc-800/30 rounded-full p-1 mb-4">
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
        </View>

        {selectedTab === 'stats' && (
          <ScrollView className="mb-6">
            <Text className="text-zinc-400 text-sm font-medium mb-4 px-4">Last 7 days</Text>

            {/* Weekly stats summary - lighter background */}
            <View className="bg-zinc-900/80 rounded-2xl p-6 space-y-6 shadow-lg border border-zinc-800/30 mx-4">
              
              {/* Top row stats - lighter backgrounds */}
              <View className="flex-row justify-between">
                <View className="items-center bg-zinc-800/50 p-4 rounded-xl flex-1 mr-3 border border-zinc-800/30">
                  <Text className="text-zinc-400 text-sm mb-2 font-medium">Weekly Total</Text>
                  <Text className="text-white text-2xl font-bold">{(() => {
                    let totalMinutes = 0;
                    const today = new Date();
                    const sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(today.getDate() - 7);

                    user.workSessions
                      .filter(session => {
                        const [day, month, year] = session.date.split(':').map(Number);
                        const sessionDate = new Date(year, month - 1, day);
                        return session.workId === workId && 
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

                <View className="items-center bg-zinc-800/50 p-4 rounded-xl flex-1 border border-zinc-800/30">
                  <Text className="text-zinc-400 text-sm mb-2 font-medium">Daily Average</Text>
                  <Text className="text-white text-2xl font-bold">{(() => {
                    let totalMinutes = 0;
                    const today = new Date();
                    const sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(today.getDate() - 7);

                    user.workSessions
                      .filter(session => {
                        const [day, month, year] = session.date.split(':').map(Number);
                        const sessionDate = new Date(year, month - 1, day);
                        return session.workId === workId && 
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

              {/* Divider - more subtle */}
              <View className="border-t border-zinc-800/20" />

              {/* Middle row stats - lighter backgrounds */}
              <View className="flex-row justify-between">
                <View className="items-center bg-zinc-800/50 p-4 rounded-xl flex-1 mr-3 border border-zinc-800/30">
                  <Text className="text-zinc-400 text-sm mb-2 font-medium">Most Productive Day</Text>
                  <Text className="text-white text-2xl font-bold">
                    {(() => {
                      const today = new Date();
                      const sevenDaysAgo = new Date(today);
                      sevenDaysAgo.setDate(today.getDate() - 7);

                      const dailyMinutes = {};
                      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                      user.workSessions
                        .filter(session => {
                          const [day, month, year] = session.date.split(':').map(Number);
                          const sessionDate = new Date(year, month - 1, day);
                          return session.workId === workId && 
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
                      const today = new Date();
                      const sevenDaysAgo = new Date(today);
                      sevenDaysAgo.setDate(today.getDate() - 7);

                      const dailyMinutes = {};

                      user.workSessions
                        .filter(session => {
                          const [day, month, year] = session.date.split(':').map(Number);
                          const sessionDate = new Date(year, month - 1, day);
                          return session.workId === workId && 
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

                <View className="items-center bg-zinc-800/50 p-4 rounded-xl flex-1 border border-zinc-800/30">
                  <Text className="text-zinc-400 text-sm mb-2 font-medium">Weekly Goal Progress</Text>
                  <Text className="text-white text-2xl font-bold">{(() => {
                    let totalMinutes = 0;
                    const today = new Date();
                    const sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(today.getDate() - 7);

                    user.workSessions
                      .filter(session => {
                        const [day, month, year] = session.date.split(':').map(Number);
                        const sessionDate = new Date(year, month - 1, day);
                        return session.workId === workId && 
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

                    const goalMinutes = parseInt(work.currentTime) * 7 * 60;
                    const percentage = Math.round((totalMinutes / goalMinutes) * 100);
                    
                    return `${percentage}%`;
                  })()}</Text>
                  <Text className="text-sky-400 text-xs font-medium">{(() => {
                    let totalMinutes = 0;
                    const today = new Date();
                    const sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(today.getDate() - 7);

                    user.workSessions
                      .filter(session => {
                        const [day, month, year] = session.date.split(':').map(Number);
                        const sessionDate = new Date(year, month - 1, day);
                        return session.workId === workId && 
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
                    
                    const goalHours = parseInt(work.currentTime) * 7;
                    
                    return `${hours}:${minutes.toString().padStart(2, '0')}h / ${goalHours}:00h`;
                  })()}</Text>
                </View>
              </View>

              {/* Divider - more subtle */}
              <View className="border-t border-zinc-800/20" />

              {/* Bottom row stats - lighter backgrounds */}
              <View className="flex-row justify-between">
                <View className="items-center bg-zinc-800/50 p-4 rounded-xl flex-1 mr-3 border border-zinc-800/30">
                  <Text className="text-zinc-400 text-sm mb-2 font-medium">Longest Session</Text>
                  <Text className="text-white text-2xl font-bold">{(() => {
                    let longestDuration = 0;
                    const today = new Date();
                    const sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(today.getDate() - 7);

                    user.workSessions
                      .filter(session => {
                        const [day, month, year] = session.date.split(':').map(Number);
                        const sessionDate = new Date(year, month - 1, day);
                        return session.workId === workId && 
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
                    let longestSession = null;
                    let longestDuration = 0;
                    const today = new Date();
                    const sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(today.getDate() - 7);
                    
                    user.workSessions
                      .filter(session => {
                        const [day, month, year] = session.date.split(':').map(Number);
                        const sessionDate = new Date(year, month - 1, day);
                        return session.workId === workId && 
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
                <View className="items-center bg-zinc-800/50 p-4 rounded-xl flex-1 border border-zinc-800/30">
                  <Text className="text-zinc-400 text-sm mb-2 font-medium">Total Sessions</Text>
                  <Text className="text-white text-2xl font-bold">{(() => {
                    const today = new Date();
                    const sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(today.getDate() - 7);
                    
                    const thisWeekSessions = user.workSessions.filter(session => {
                      const [day, month, year] = session.date.split(':').map(Number);
                      const sessionDate = new Date(year, month - 1, day);
                      return session.workId === workId && 
                             sessionDate >= sevenDaysAgo && 
                             sessionDate <= today;
                    }).length;
                    
                    return thisWeekSessions;
                  })()}</Text>
                  <Text className={`text-xs font-medium ${(() => {
                    const today = new Date();
                    const sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(today.getDate() - 7);
                    const fourteenDaysAgo = new Date(today);
                    fourteenDaysAgo.setDate(today.getDate() - 14);
                    
                    const thisWeekSessions = user.workSessions.filter(session => {
                      const [day, month, year] = session.date.split(':').map(Number);
                      const sessionDate = new Date(year, month - 1, day);
                      return session.workId === workId && 
                             sessionDate >= sevenDaysAgo && 
                             sessionDate <= today;
                    }).length;
                    
                    const lastWeekSessions = user.workSessions.filter(session => {
                      const [day, month, year] = session.date.split(':').map(Number);
                      const sessionDate = new Date(year, month - 1, day);
                      return session.workId === workId && 
                             sessionDate >= fourteenDaysAgo && 
                             sessionDate < sevenDaysAgo;
                    }).length;
                    
                    const diff = thisWeekSessions - lastWeekSessions;
                    return diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-zinc-400';
                  })()}`}>{(() => {
                    const today = new Date();
                    const sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(today.getDate() - 7);
                    const fourteenDaysAgo = new Date(today);
                    fourteenDaysAgo.setDate(today.getDate() - 14);
                    
                    const thisWeekSessions = user.workSessions.filter(session => {
                      const [day, month, year] = session.date.split(':').map(Number);
                      const sessionDate = new Date(year, month - 1, day);
                      return session.workId === workId && 
                             sessionDate >= sevenDaysAgo && 
                             sessionDate <= today;
                    }).length;
                    
                    const lastWeekSessions = user.workSessions.filter(session => {
                      const [day, month, year] = session.date.split(':').map(Number);
                      const sessionDate = new Date(year, month - 1, day);
                      return session.workId === workId && 
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
          <View className="flex-1">
            {/* Time Filter */}
            <View className="px-4">
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
            </View>

            {/* Sessions List */}
            <ScrollView 
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
            >
              {user.workSessions.filter(session => {
                const [day, month, year] = session.date.split(':').map(Number);
                const sessionDate = new Date(year, month - 1, day);
                const today = new Date();
                const sevenDaysAgo = new Date(today);
                sevenDaysAgo.setDate(today.getDate() - 7);

                if (sessionTimeframe === 'today') {
                  return session.workId === workId && 
                         session.date === `${today.getDate()}:${today.getMonth() + 1}:${today.getFullYear()}`;
                } else {
                  return session.workId === workId && 
                         sessionDate >= sevenDaysAgo && 
                         sessionDate <= today;
                }
              }).map((session, index) => (
                <View key={index} className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-800/50 shadow-lg mb-4">
                  {/* Session Date */}
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-zinc-400 text-sm">
                      {(() => {
                        const [day, month, year] = session.date.split(':').map(Number);
                        const date = new Date(year, month - 1, day);
                        return date.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        });
                      })()}
                    </Text>
                  </View>

                  {/* Session Main Info */}
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center flex-1">
                      <View className="w-2 h-2 rounded-full bg-sky-400 mr-3" />
                      <View>
                        <Text className="text-white text-base font-medium">{session.name}</Text>
                        <Text className="text-zinc-400 text-sm">
                          {(() => {
                            const [startHours, startMinutes] = session.startTime.split(':').map(Number);
                            const [endHours, endMinutes] = session.endTime.split(':').map(Number);
                            const startInMinutes = startHours * 60 + startMinutes;
                            const endInMinutes = endHours * 60 + endMinutes;
                            const duration = endInMinutes - startInMinutes;
                            const hours = Math.floor(duration / 60);
                            const minutes = duration % 60;
                            return `${hours}h ${minutes}m`;
                          })()}
                        </Text>
                      </View>
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
                session.workId === workId && 
                session.date === `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`
              ).length === 0 && (
                <View className="items-center py-6">
                  <Text className="text-zinc-600 text-base">No sessions today</Text>
                </View>
              )}

              {/* Bottom Padding */}
              <View className="h-20" />
            </ScrollView>
          </View>
        )}

        {selectedTab === 'edit' && (
          <View className="flex-1">
            <ScrollView className="flex-1 px-4">
              {/* Work Name Input */}
              <View className="mb-6">
                <Text className="text-zinc-400 text-sm font-medium mb-2">Work Name</Text>
                <TextInput
                  className="bg-zinc-800/50 text-white p-4 rounded-xl border border-zinc-800"
                  placeholder="Work Name" 
                  placeholderTextColor="#71717A"
                  value={editWork?.name}
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
                        if (!user.work.some(w => w.colors[0] === color[0] && w.colors[1] === color[1] && w._id !== work._id)) {
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
                          user.work.some(w => w.colors[0] === color[0] && w.colors[1] === color[1] && w._id !== work._id)
                            ? 'opacity-20' 
                            : ''
                        } ${
                          editWork?.colors[0] === color[0] && editWork?.colors[1] === color[1]
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
                <View className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-800">
                  <View className="flex-row items-center justify-between">
                    <TouchableOpacity 
                      onPress={() => {
                        let currentMinutes;
                        if (editWork?.currentTime.includes('h') && editWork?.currentTime.includes('m')) {
                          const [h, m] = editWork.currentTime.split('h ');
                          currentMinutes = parseInt(h) * 60 + parseInt(m);
                        } else if (editWork?.currentTime.includes('h')) {
                          currentMinutes = parseInt(editWork.currentTime) * 60;
                        } else {
                          currentMinutes = parseInt(editWork.currentTime);
                        }
                        
                        // Don't go below 30m
                        if (currentMinutes <= 30) return;
                        
                        const newMinutes = currentMinutes - 30;
                        if (newMinutes < 60) {
                          setEditWork({...editWork, currentTime: `${newMinutes}m`});
                        } else {
                          const hours = Math.floor(newMinutes / 60);
                          const minutes = newMinutes % 60;
                          setEditWork({
                            ...editWork, 
                            currentTime: minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
                          });
                        }
                      }}
                      className="bg-zinc-700/80 w-12 h-12 rounded-full items-center justify-center shadow-lg"
                    >
                      <Text className="text-white text-xl font-medium">-</Text>
                    </TouchableOpacity>
                      
                    <Text className="text-white text-2xl font-bold">{editWork?.currentTime}</Text>
                      
                    <TouchableOpacity 
                      onPress={() => {
                        let currentMinutes;
                        if (editWork?.currentTime.includes('h') && editWork?.currentTime.includes('m')) {
                          const [h, m] = editWork.currentTime.split('h ');
                          currentMinutes = parseInt(h) * 60 + parseInt(m);
                        } else if (editWork?.currentTime.includes('h')) {
                          currentMinutes = parseInt(editWork.currentTime) * 60;
                        } else {
                          currentMinutes = parseInt(editWork.currentTime);
                        }
                        
                        // Don't go above 24h (1440 minutes)
                        if (currentMinutes >= 1440) return;
                        
                        const newMinutes = currentMinutes + 30;
                        if (newMinutes < 60) {
                          setEditWork({...editWork, currentTime: `${newMinutes}m`});
                        } else {
                          const hours = Math.floor(newMinutes / 60);
                          const minutes = newMinutes % 60;
                          setEditWork({
                            ...editWork, 
                            currentTime: minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
                          });
                        }
                      }}
                      className="bg-zinc-700/80 w-12 h-12 rounded-full items-center justify-center shadow-lg"
                    >
                      <Text className="text-white text-xl font-medium">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons - Fixed at bottom */}
            <View className="px-4 py-6 bg-zinc-950/80 border-t border-zinc-800/50">
              <View className="flex-row justify-between space-x-3">
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
          </View>
        )}
      </View>

      {/* Add AlertPopup */}
      <AlertPopup
        visible={alertPopupVisible}
        message={alertPopupMessage}
        type={alertPopupType}
        onClose={() => setAlertPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

export default WorkPage;
