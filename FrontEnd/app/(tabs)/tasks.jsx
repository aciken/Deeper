import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomPopup from '../components/BottomPopup';
import icons from '../../constants/icons';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalProvider';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import DateTimePicker from '@react-native-community/datetimepicker';



const Tasks = () => {
  const { user } = useGlobalContext();
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


  const [isStartSessionPopupVisible, setIsStartSessionPopupVisible] = useState(false);


  

  const works = [
    {
      name: "Mobile app",
      colors: ['#0EA5E9', '#085D83'],
      currentTime: 22,
      totalTime: 40
    },
    {
      name: "School",
      colors: ['#DC2626', '#761414'],
      currentTime: 9,
      totalTime: 8,
    },
    {
      name: "Learning Coding",
      colors: ['#22C55E', '#105F2D'],
      currentTime: 7,
      totalTime: 8,
    }
  ]

  const existingColors = [
    ['#DC2626', '#761414'],
    ['#16A34A', '#083D1C'],
    ['#2563EB', '#153885'],
  ]

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

const onTimeChange = (event, selectedTime) => {
  setShowTimePicker(Platform.OS === 'ios');
  if (selectedTime) {
    setDuration({
      hours: selectedTime.getHours(),
      minutes: selectedTime.getMinutes(),
    });
  }
};


  return(
      <SafeAreaView className="flex-1 h-full bg-zinc-950" edges={['top']}>
        <View className="flex-1">
          <ScrollView className="flex-1 h-full px-4" contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-row items-start justify-start mt-2 mb-2">
							<Text className="text-white text-2xl font-bold">Next</Text>
            </View>

            <TouchableOpacity className="flex-row justify-between items-center p-4 bg-zinc-900 rounded-xl mb-4">
							<View className="flex-row justify-center items-center">
							<LinearGradient
									colors={['#0EA5E9', '#085D83']}
									start={{x: 0, y: 0}}
									end={{x: 0, y: 1}}
									className="w-6 h-6 rounded-full"
								>
								</LinearGradient>
						
								<View className="flex-col justify-center items-start pl-2">
									<Text className="text-white text-base font-semibold">Mobile app</Text>
									<Text className="text-gray-400 text-sm font-pregular">coding</Text>
								</View>
							</View>
              <View className="flex-row justify-center items-center bg-zinc-800 rounded-xl px-2 py-1">
                <Image source={icons.clockGray} className="w-3 h-3 mr-1" />
                <Text className="text-gray-400 text-xs font-pregular">starting in 1h 37m</Text>
              </View>
						</TouchableOpacity>

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
                <TouchableOpacity key={index} className="flex-row justify-between items-center w-full mb-6">
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
                    <Text className={` text-base font-psemibold ${work.currentTime >= work.totalTime ? 'text-sky-400' : 'text-white'}`}>{work.currentTime}h <Text className={`${work.currentTime >= work.totalTime ? 'text-sky-400' : 'text-gray-400'}`}>/ {work.totalTime}h week</Text></Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

          </ScrollView>

          <View className="px-4 pb-2">
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
				</View>
			</View>

      <BottomPopup
  visible={isWorkVisible}
  onClose={() => setIsWorkVisible(false)}
  height={0.65}
>
  <View className="p-2 bg-zinc-900 rounded-t-3xl flex-1">
    <Text className="text-white text-3xl font-bold mb-6 text-center">Add Work</Text>
    
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
            onPress={() => setNewWork({...newWork, colors: color})}
          >
            <LinearGradient
              colors={color}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              className={`w-8 h-8 rounded-full ${existingColors.some(ec => ec[0] === color[0] && ec[1] === color[1]) ? 'opacity-20' : ''} ${newWork.colors[0] === color[0] && newWork.colors[1] === color[1] ? 'border-2 border-white' : ''}`}
            >
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

    </View>
    
    <View className="mb-4">
      <Text className="text-gray-400 text-sm mb-2">Targeted work per week:</Text>
      <View className="flex-row items-center justify-between bg-zinc-800 rounded-xl p-2">
        <TouchableOpacity 
        onPress={() => {
          if (newWork.currentTime.includes('m')) { 
            setNewWork({...newWork, currentTime: parseInt(newWork.currentTime.replace('h', '')) - 1 + 'h'})
          } else {
            setNewWork({...newWork, currentTime: parseInt(newWork.currentTime.replace('h', '')) + 'h 30m'})
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
      <Text className="text-gray-500 text-sm mt-2 text-center">overall work per week left: 37h 30m</Text>
    </View>
    
    <View className="flex-1" />
    
    <View className="pb-2">
        <TouchableOpacity 
          onPress={() => {}}
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
