import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Image, TextInput } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalProvider';
import { icons } from '../../constants';
import HourTable from '../components/HourTable';
import IconButton from '../components/IconButton';
import { useRouter, Redirect } from 'expo-router';
import BottomPopup from '../components/BottomPopup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import MaskedView from '@react-native-masked-view/masked-view';
import AlertPopup from '../components/AlertPopup';
import { useLocalSearchParams } from 'expo-router';


const DownButton = ({buttonText, icon, onPress}) => {
	return(
		<TouchableOpacity onPress={onPress}  className="w-28 h-16 rounded-2xl shadow-lg justify-center items-center m-1 bg-zinc-900 border border-zinc-700">
			<View className="items-center">
			<MaskedView
				maskElement={
					<Image source={icon} className="w-6 h-6 tint-white mb-1" />
				}
				>
				<LinearGradient
					colors={['#d4d4d8', '#52525b']}
					start={{x: 0, y: 0}}
					end={{x: 0, y: 1}}
				>
					<Image source={icon} className="w-6 h-6 tint-white mb-1 opacity-0" />
				</LinearGradient>
			</MaskedView>

			<MaskedView
				maskElement={
					<Text className="text-white text-xs font-semibold">{buttonText}</Text>
				}
				>
				<LinearGradient
					colors={['#d4d4d8', '#52525b']}
					start={{x: 0, y: 0}}
					end={{x: 0, y: 1}}
				>
				<Text className="text-white text-xs font-semibold opacity-0">{buttonText}</Text>
				</LinearGradient>
			</MaskedView>

			</View>
		</TouchableOpacity>
	)
}


const SchedulePage = () => {
	const { user, setUser, setSelected } = useGlobalContext();
	const { message, status } = useLocalSearchParams();
	const router = useRouter();
	const navigation = useNavigation();
	const todayDateNumber = new Date().getDate();
	const [clicked, setClicked] = useState(todayDateNumber);
	const [all, setAll] = useState(false);
	const [multiSelect, setMultiSelect] = useState(false);
	const [selectedDates, setSelectedDates] = useState([]);
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [isEditVisible, setIsEditVisible] = useState(false);
	const [isTaskListVisible, setIsTaskListVisible] = useState(false);
	const [newAll, setNewAll] = useState(false);
	const [startTime, setStartTime] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);
	const [index,setIndex] = useState(null)


	useEffect(() => {
		if(message && status){
			setAlertPopupVisible(true);
			setAlertPopupMessage(message);
			setAlertPopupType(status);
		}
	}, [message, status])


	const [showWorkPicker, setShowWorkPicker] = useState(false);
	const [isWorkDropdownVisible, setIsWorkDropdownVisible] = useState(false);



	if (!user) {
		return <Redirect to="/" />;
	}

	const handleAddDeepWork = () => {
		console.log(`Adding deep work session from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}`);
		setIsPopupVisible(false);
	};

	const handleTimeChange = (event, selectedTime, isStartTime) => {
		if (Platform.OS === 'android') {
			setShowStartPicker(false);
			setShowEndPicker(false);
		}

		if (selectedTime) {
			if (isStartTime) {
				setStartTime(selectedTime);
			} else {
				setEndTime(selectedTime);
			}
		}
	};

	const getDayName = (date) => {
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		return days[new Date(new Date().getFullYear(), new Date().getMonth(), date).getDay()];
	};

	const handleDateClick = (date) => {
		if (multiSelect) {
			setSelectedDates(prev => 
				prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
			);
		} else {
			setClicked(date);
		}
	};

	const ButtonGradient = ({ colors, children, onPress, disabled }) => (
		<TouchableOpacity onPress={onPress} disabled={disabled} className="w-28 h-16 rounded-2xl shadow-lg justify-center items-center m-1">
			<LinearGradient colors={colors} className="w-full h-full rounded-2xl justify-center items-center">
				{children}
			</LinearGradient>
		</TouchableOpacity>
	);

	const [sessionName, setSessionName] = useState('');

	const [alertPopupVisible, setAlertPopupVisible] = useState(false);
	const [alertPopupMessage, setAlertPopupMessage] = useState('');
	const [alertPopupType, setAlertPopupType] = useState('info');

	const submitWork = (start, end, name,dates) => {
		const dayIndices = dates.map(date => new Date(date).getDate() - 1);

		
	
		const data  = [start,end, name, selectedWork]



		axios.put('https://080d-188-2-139-122.ngrok-free.app/addWork', {
		  data,
		  id: user._id,
		  clicked,
		  dayIndices,
		}).then(res => {
			console.log('data', res.data)
		  if(res.data == 'Time overlap'){
			console.log('works are overlapping')
			setAlertPopupVisible(true);
			setAlertPopupMessage("Sessions can't overlap");
			setAlertPopupType('error')
		  } else if(res.data == 'No Name'){
			setAlertPopupVisible(true);
			setAlertPopupMessage("You need to enter a session name");
			setAlertPopupType('error')
		  }else{
			setUser(res.data);
			setIsPopupVisible(false);
		  }
		}).catch(err => {
		  if (err.response) {
			console.log('Error response:', err.response.data);
		  } else if (err.request) {
			console.log('Error request:', err.request);
		  } else {
			console.log('Error:', err.message);
		  }
		})
	}

	
    const deleteFunc = () => {
        axios.put('https://080d-188-2-139-122.ngrok-free.app/deleteWork', {
            id: user._id,
            index,
            clicked,
        }).then(res => {
            setUser(res.data);
			setIsEditVisible(!isEditVisible)

        }).catch((e) => {
            console.error(e);
        })
    }


    const editFunc = (start, end, name) => {

        const data  = [start,end, name, selectedWork]

        axios.put('https://080d-188-2-139-122.ngrok-free.app/editWork', {
            data,
            id: user._id,
            index,
            clicked,
        }).then(res => {
            if(res.data === 'Time overlap'){
				setAlertPopupVisible(true);
				setAlertPopupMessage("Sessions can't overlap");
				setAlertPopupType('error')
            } else {
                setUser(res.data);
                setIsEditVisible(!isEditVisible)
            }
        }).catch((e) => {
            console.error(e);
        })
    }

	const changeEditData = (start, end, name, work) => {
		setStartTime(start)
		setEndTime(end)
		setSessionName(name)
		setSelectedWork(work)
	}

	const formatTime = (time) => {
		if (time instanceof Date) {
			return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		}
		return ''; // Return an empty string or some default value if time is not a Date
	};

	// Add this function to handle task editing


	function convertTimeStringToDate(timeString) {
		const [hours, minutes] = timeString.split(':');
		
		let date = new Date();
		date.setHours(parseInt(hours, 10));
		date.setMinutes(parseInt(minutes, 10));
		date.setSeconds(0);
		date.setMilliseconds(0);
		
		return date;
	  }

	  
	const [selectedWork, setSelectedWork] = useState(user.work[0]._id)

	const [selectedDate, setSelectedDate] = useState(null);
	const [showDatePicker, setShowDatePicker] = useState(false);


	

	
	const [isPresetPopupVisible, setIsPresetPopupVisible] = useState(false);
	const [presets, setPresets] = useState([
		{
			name: "Morning Work",
			time: "4h",
			sessions: [
				['06:00', '08:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 120,160],
				['09:00', '11:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 180,220],
				['12:00', '14:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 240,280]
			]
		},
		{
			name: "Evening Work",
			time: "5h 30m",
			sessions: [
				['15:00', '17:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 210,250],
				['18:00', '20:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 270,310],
				['21:00', '23:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 330,370]
			]
		},
		{
			name: "Noon Work",
			time: "2h",
			sessions: [
				['12:00', '14:00', {name: 'mobile app', colors: ['#0EA5E9', '#60A5FA'], currentTime: '2h'}, 240,280]
			]
		}
	])

	const timeFromPoints = (points) => {
		const hours = Math.floor(points / 20);
		const minutes = Math.round((points / 20 - hours) * 60);
		const time = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
		return time
	}

	const workLength = (sessions) => {
		let total = 0;
		sessions.forEach(session => {
			total += session[5] - session[4]
		})
		total = Math.round(total)
		return timeFromPoints(total)
		
	}

	const findTaskById = (id) => {
		const task = user.work.find(work => work._id === id)
		console.log('id', id)
		console.log('user.work', user.work)
		console.log('task', task)
		return task
	}
	  

	return (
		<SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
			<View className="flex-1 p-4">
				<AlertPopup
					visible={alertPopupVisible}
					message={alertPopupMessage}
					type={alertPopupType}
					onHide={() => setAlertPopupVisible(false)}
				/>
				<View className="flex-row items-center justify-between mb-4 underline ">
					<TouchableOpacity 
						onPress={() => navigation.goBack()}
						className="flex-row items-center"
					>
						<Image 
							source={icons.backIcon} 
							className="w-6 h-6 tint-white ml-1"
						/>
						<Text className="text-white text-lg font-medium ml-2">Back</Text>
					</TouchableOpacity>

				</View>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="mb-4"
				>
					{[...Array(14)].map((_, index) => {
						const date = new Date();
						date.setDate(date.getDate() + index);
						const isToday = index === 0;
						const isSelected = date.getDate() === clicked;

						return (
							<TouchableOpacity
								key={index}
								onPress={() => handleDateClick(date.getDate())}
								className={`w-12 h-16 justify-center items-center rounded-lg mr-2`}
							>
								<LinearGradient
									colors={isSelected ? ['#0EA5E9', '#7dd3fc'] : ['#18181B', '#27272A']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 1}}
									className="w-full h-full rounded-lg justify-center items-center border border-zinc-700"
								>
									<Text className={`text-xs mb-0.5 ${
										isSelected ? 'text-zinc-100' : 'text-zinc-400'
									}`}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
									<Text className={`text-base font-bold ${
										isSelected ? 'text-zinc-100' : 'text-zinc-400'
									}`}>{date.getDate()}</Text>
									{isToday && (
										<View className="absolute bottom-0.5 w-1 h-1 bg-sky-500 rounded-full" />
									)}
								</LinearGradient>
							</TouchableOpacity>
						);
					})}
				</ScrollView>

				<View className="h-[70%]"> 
					<HourTable
						user={user}
						clicked={clicked}
						todayDateNumber={todayDateNumber}
						all={all}
						changeEditVisible={() => setIsEditVisible(true)}
						changeEditData={changeEditData}
						setIndex= {setIndex}
					/>
				</View>

				<View className="flex-row justify-center items-center mt-4">
				</View>

				<View className="flex-row justify-center pb-4 ">
						<DownButton buttonText="Add Task" icon={icons.plusGray} onPress={() => setIsPopupVisible(true)} />
						<DownButton buttonText="Task List" icon={icons.listBlue} onPress={() => setIsTaskListVisible(!isTaskListVisible)} />
						<DownButton buttonText="Presets" icon={icons.presets} onPress={() => {setIsPresetPopupVisible(true)}} />
				</View>

				<BottomPopup
					visible={isEditVisible}
					onClose={() => setIsEditVisible(false)}
					height={0.5}
				>
					<ScrollView className="flex-grow">
					
						<MaskedView
							maskElement={
								<Text className="text-white text-3xl font-bold mb-6 text-center">Edit Deep Work Session</Text>
							}
						>
							<LinearGradient
								colors={['#D4D4D8', '#71717A']}
								start={{x: 0, y: 0}}
								end={{x: 0, y: 1}}
							>
								<Text className="text-white text-3xl font-bold mb-6 text-center opacity-0">Edit Deep Work Session</Text>
							</LinearGradient>
						</MaskedView>

						<View className="mb-4">
							<TextInput
								placeholder="Enter session name"
								placeholderTextColor="#52525b"
								className="bg-zinc-800 text-base text-white py-3 px-4 rounded-xl mb-4"
								onChangeText={(text) => setSessionName(text)}
								value={sessionName}
							/>
						</View>

						<View className="mb-4 z-10">
							<TouchableOpacity 
								onPress={() => setShowWorkPicker(!showWorkPicker)}
								className="bg-zinc-800 py-3 px-4 rounded-xl mb-4 flex-row justify-between items-center"
							>
								<View className="flex-row items-center">
									{selectedWork ? (
										<LinearGradient
											colors={findTaskById(selectedWork).colors}
											start={{x: 0, y: 0}}
											end={{x: 1, y: 1}}
											className="w-4 h-4 rounded-full mr-2"
										/>
									) : (
										<Image source={icons.workGray} className="w-4 h-4 mr-2 tint-gray-400" />
									)}
									<Text className={`text-base ${selectedWork ? 'text-white' : 'text-zinc-400'}`}>
										{selectedWork ? findTaskById(selectedWork).name : "Select a work"}
									</Text>
								</View>
								<Image 
									source={icons.chevronRight} 
									className={`w-4 h-4 tint-gray-400 ${showWorkPicker ? 'rotate-90' : ''}`} 
								/>
							</TouchableOpacity>
							
							{showWorkPicker && (
								<View className="absolute top-full left-0 right-0 bg-zinc-800 rounded-xl mt-2 p-2 border border-zinc-700">
									<ScrollView>
										{user.work.map((work, index) => (
											<TouchableOpacity
												key={index}
												onPress={() => {
													setSelectedWork(work);
													setShowWorkPicker(false);
												}}
												className="py-2 px-4 border-b border-zinc-700 flex-row items-center"
											>
												<LinearGradient
													colors={work.colors}
													start={{x: 0, y: 0}}
													end={{x: 1, y: 1}}
													className="w-4 h-4 rounded-full mr-2"
												/>
												<Text className="text-white">{work.name}</Text>
											</TouchableOpacity>
										))}
									</ScrollView>
								</View>
							)}
						</View>

						<View className="flex-row justify-between items-center mb-4 h-10">
							<TouchableOpacity
								onPress={() => {
									if(showStartPicker){
										setShowStartPicker(false);
									} else {
										setShowStartPicker(true);
										setShowEndPicker(false);
									}
								}}
								className="flex-1 mr-2 overflow-hidden"
							>
								<LinearGradient
									colors={showStartPicker ? ['#38bdf8', '#3b82f6'] : ['#27272a', '#27272a']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 1}}
									className="w-full h-full rounded-xl justify-center items-center"
								>
									<Text className={`font-bold text-base ${showStartPicker ? 'text-white' : 'text-zinc-400'}`}>
										Start: {formatTime(startTime)}
									</Text>
								</LinearGradient>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									if(showEndPicker){
										setShowEndPicker(false);
									} else {
										setShowStartPicker(false);
										setShowEndPicker(true);
									}
								}}
								className="flex-1 ml-2 overflow-hidden"
							>
								<LinearGradient
									colors={showEndPicker ? ['#38bdf8', '#3b82f6'] : ['#27272a', '#27272a']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 1}}
									className="w-full h-full rounded-xl justify-center items-center"
								>
									<Text className={`font-bold text-base ${showEndPicker ? 'text-white' : 'text-zinc-400'}`}>
										End: {formatTime(endTime)}
									</Text>
								</LinearGradient>
							</TouchableOpacity>
						</View>

						{Platform.OS === 'ios' ? (
							<>
								{showStartPicker && (
									<DateTimePicker
										value={startTime}
										mode="time"
										is24Hour={true}
										display="spinner"
										onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, true)}
										textColor="white"
										style={{backgroundColor: 'transparent'}}
									/>
								)}
								{showEndPicker && (
									<DateTimePicker
										value={endTime}
											mode="time"
											is24Hour={true}
											display="spinner"
											onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, false)}
											textColor="white"
											style={{backgroundColor: 'transparent'}}
									/>
								)}
							</>
						) : (
							(showStartPicker || showEndPicker) && (
								<DateTimePicker
									value={showStartPicker ? startTime : endTime}
									mode="time"
									is24Hour={true}
									display="default"
									onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, showStartPicker)}
									className="z-10"
								/>
							)
						)}

					</ScrollView>


						<View className="flex-row justify-between mb-4">
							<TouchableOpacity
								onPress={() => editFunc(formatTime(startTime), formatTime(endTime), sessionName)}
								className="flex-1 mr-2 h-14 rounded-full overflow-hidden"
							>
								<LinearGradient
									colors={['#0ea5e9', '#60a5fa']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 1}}
									className="w-full h-full rounded-full justify-center items-center"
								>
									<Text className="text-white text-lg font-semibold">Edit Work Session</Text>
								</LinearGradient>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => deleteFunc()}
								className="w-14 h-14 rounded-full overflow-hidden"
							>
								<LinearGradient
									colors={['#ef4444', '#b91c1c']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 1}}
									className="w-full h-full rounded-full justify-center items-center"
								>
									<Image source={icons.trash} className="w-6 h-6 tint-white" />
								</LinearGradient>
							</TouchableOpacity>
						</View>
				</BottomPopup>

				<BottomPopup
					visible={isPopupVisible}
					onClose={() => setIsPopupVisible(false)}
					height={0.65}
				>
					<ScrollView className="flex-grow">
					<MaskedView
              maskElement={
				<Text className="text-3xl font-bold text-white mb-6 text-center">Add Deep Work Session</Text>
                  }
                >
                <LinearGradient
                  colors={['#D4D4D8', '#71717A']}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                >
					<Text className="text-3xl font-bold text-white mb-6 text-center opacity-0">Add Deep Work Session</Text>
                </LinearGradient>
              </MaskedView>
						
						{/* Date selection */}
						<View className="mb-6">
							<ScrollView 
								horizontal 
								showsHorizontalScrollIndicator={false}
								className="mb-4"
							>
								{[...Array(14)].map((_, index) => {
									const date = new Date();
									date.setDate(date.getDate() + index);
									const isClickedDate = date.getDate() === clicked;
									const isSelected = selectedDates.some(selectedDate => 
										selectedDate.toDateString() === date.toDateString()
									);
									if(selectedDates.length === 0){
										const newDate = new Date();
										newDate.setDate(clicked);
										console.log(newDate);
										setSelectedDates([newDate]);
									}
									return (
										<TouchableOpacity
											key={index}
											onPress={() => {
												const newSelectedDates = [...selectedDates];
												const existingIndex = newSelectedDates.findIndex(
													selectedDate => selectedDate.toDateString() === date.toDateString()
												);
	
												if (existingIndex !== -1) {
													newSelectedDates.splice(existingIndex, 1);
												} else {
													newSelectedDates.push(date);
												}
												setSelectedDates(newSelectedDates);
											}}
											className={`w-16 h-20 justify-center items-center rounded-xl mr-2 ${
												isSelected || (isClickedDate && selectedDates.length === 0) ? 'bg-sky-500' : 'bg-zinc-700'
											}`}
										>
											<LinearGradient
												colors={isSelected || (isClickedDate && selectedDates.length === 0) ? ['#0EA5E9', '#7dd3fc'] : ['#18181B', '#27272A']}
												start={{x: 0, y: 0}}
												end={{x: 1, y: 1}}
												className="w-full h-full rounded-xl justify-center items-center border border-zinc-700"
											>
												<Text className={`text-xs mb-1 ${
													isSelected || (isClickedDate && selectedDates.length === 0) ? 'text-zinc-100' : 'text-zinc-400'
												}`}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
												<Text className="text-zinc-100 text-lg font-bold">{date.getDate()}</Text>
											</LinearGradient>
										</TouchableOpacity>
									);
								})}
							</ScrollView>
						</View>

						<View className="mb-6">
							<TextInput
								placeholder="Enter session name"
								placeholderTextColor="#52525b"
								className="bg-zinc-800 text-base text-white py-3 px-4 rounded-xl mb-4"
								onChangeText={(text) => setSessionName(text)}
								value={sessionName}
							/>
							<View className="relative z-10">
								<TouchableOpacity 
									onPress={() => {setShowWorkPicker(!showWorkPicker)}}
									className="bg-zinc-800 py-3 px-4 rounded-xl mb-4 flex-row justify-between items-center"
								>

									<View className="flex-row items-center">
										{findTaskById(selectedWork).colors[0] !== '' ? (
											<LinearGradient
												colors={findTaskById(selectedWork).colors}
												start={{x: 0, y: 0}}
												end={{x: 1, y: 1}}
												className="w-4 h-4 rounded-full mr-2"
											>
											</LinearGradient>
										) : (
											<Image source={icons.workGray} className="w-4 h-4 mr-2 tint-gray-400" />
										)}
										<Text className={`text-base ${findTaskById(selectedWork).colors[0] ? 'text-white' : 'text-zinc-400'}`}>{findTaskById(selectedWork).name || "Select a work"}</Text>
									</View>
									<Image 
										source={icons.chevronRight} 
										className={`w-4 h-4 tint-gray-400 ${showWorkPicker ? 'rotate-90' : ''}`} 
									/>
								</TouchableOpacity>
								
								{showWorkPicker && (
									<View className="z-20 p-2 mb-2 bg-zinc-800 rounded-xl shadow-lg border border-zinc-700">
										{user.work.map((work, index) => (
											<TouchableOpacity
												key={index}
												onPress={() => {
													setSelectedWork(work);
													setShowWorkPicker(false);
												}}
												className="p-3 flex-row items-center"
											>
												<LinearGradient
													colors={work.colors}
													start={{x: 0, y: 0}}
													end={{x: 1, y: 1}}
													className="w-4 h-4 rounded-full mr-2"
												/>
												<Text className="text-white text-base">{work.name}</Text>
											</TouchableOpacity>
										))}
									</View>
								)}
							</View>
							<View className="flex-row justify-between items-center mb-4 h-10">
								<TouchableOpacity
									onPress={() => {
										if(showStartPicker){
											setShowStartPicker(false);
										} else {
											setShowStartPicker(true);
											setShowEndPicker(false);
										}
									}}
									className="flex-1 mr-2 overflow-hidden"
								>
									<LinearGradient
										colors={showStartPicker ? ['#38bdf8', '#3b82f6'] : ['#27272a', '#27272a']}
										start={{x: 0, y: 0}}
										end={{x: 1, y: 1}}
										className="w-full h-full  rounded-xl justify-center items-center"
									>
										<Text className={`font-bold text-base ${showStartPicker ? 'text-white' : 'text-zinc-400'}`}>Start: {formatTime(startTime)}</Text>
									</LinearGradient>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => {
										if(showEndPicker){
											setShowEndPicker(false);
										} else {
											setShowStartPicker(false);
											setShowEndPicker(true);
										}
									}}
									className="flex-1 ml-2 overflow-hidden"
								>
									<LinearGradient
										colors={showEndPicker ? ['#38bdf8', '#3b82f6'] : ['#27272a', '#27272a']}
										start={{x: 0, y: 0}}
										end={{x: 1, y: 1}}
										className="w-full h-full  rounded-xl justify-center items-center"
									>
										<Text className={`font-bold text-base ${showEndPicker ? 'text-white' : 'text-zinc-400'}`}>End: {formatTime(endTime)}</Text>
									</LinearGradient>
								</TouchableOpacity>
							</View>
						</View>
						{Platform.OS === 'ios' ? (
							<>
								{showStartPicker && (
									<DateTimePicker
										value={startTime}
										mode="time"
										is24Hour={true}
										display="spinner"
										onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, true)}
										textColor="white"
										style={{backgroundColor: 'transparent'}}
										className="z-10"
									/>
								)}
								{showEndPicker && (
									<DateTimePicker
										value={endTime}
										mode="time"
										is24Hour={true}
										display="spinner"
										onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, false)}
										textColor="white"
										style={{backgroundColor: 'transparent'}}
										className="z-10"
									/>
								)}
							</>
						) : (
							<>
								{(showStartPicker || showEndPicker) && (
									<DateTimePicker
										value={showStartPicker ? startTime : endTime}
										mode="time"
										is24Hour={true}
										display="default"
										onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, showStartPicker)}
									/> 
								)}
							</>
						)}
					</ScrollView>
					{/* <TouchableOpacity
						onPress={() => submitWork(formatTime(startTime), formatTime(endTime), sessionName, selectedDates)}
						className="h-16 mt-4 overflow-hidden"
					>
						<LinearGradient
							colors={['#38bdf8', '#818cf8']}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 1}}
							className="w-full h-full rounded-xl justify-center items-center"
						>
							<Text className="text-white font-bold text-lg">
								Schedule Work Session
							</Text>
						</LinearGradient>
					</TouchableOpacity> */}
					<TouchableOpacity 
          onPress={() => submitWork(formatTime(startTime), formatTime(endTime), sessionName, selectedDates)}
          className="w-full rounded-full overflow-hidden shadow-lg pt-2 mb-4"
        >
          <LinearGradient
            colors={['#0ea5e9', '#60a5fa']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className="w-full rounded-full h-14 flex-row justify-center items-center"
          >
						<Text className="text-white text-lg font-semibold">Schedule Work Session</Text>
					</LinearGradient>
					</TouchableOpacity>
				</BottomPopup>

				<BottomPopup
					visible={isTaskListVisible}
					onClose={() => setIsTaskListVisible(false)}
					height={0.65}
				>
					<MaskedView
						maskElement={
							<Text className="text-3xl font-bold text-white mb-6 text-center">Session List</Text>
                  }
                >
                <LinearGradient
                  colors={['#D4D4D8', '#71717A']}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
							>
								<Text className="text-3xl font-bold text-white mb-6 text-center opacity-0">Session List</Text>
							</LinearGradient>
						</MaskedView>
					<ScrollView className="w-full max-h-[70vh]">
						{user && user.array && user.array[clicked - 1] && user.array[clicked - 1].length > 0 ? (
							user.array[clicked - 1]
								.map((task, index) => ({ task, index }))
								.sort((a, b) => {
									const timeA = a.task[0].split(':').map(Number);
									const timeB = b.task[0].split(':').map(Number);
									return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
								})
								.map(({ task, index }) => (
									<TouchableOpacity
										key={index}
										className="w-full flex-row items-center justify-between p-2 bg-zinc-800 rounded-xl  mb-4"
										onPress={() => {
											setIsTaskListVisible(false);
											changeEditData(
												convertTimeStringToDate(task[0]),
												convertTimeStringToDate(task[1]),
												task[2],
												task[3]
											)
											setTimeout(() => {
												setIsEditVisible(true);
												setIndex(index)
											}, 250);
										}}
										activeOpacity={0.8}
									>
										<View className="flex-row items-center">
											<LinearGradient
												colors={findTaskById(task[3]).colors}
												start={{x: 0, y: 0}}
												end={{x: 1, y: 1}}
												className="w-6 h-6 rounded-full mr-1"
											/>
											<View className="flex-col items-start">
												<Text className="text-zinc-200 text-base font-psemibold">{task[2]}</Text>
												<Text className="text-zinc-500 text-sm font-pmedium">{findTaskById(task[3]).name}</Text>
											</View>
										</View>
										<Text className="text-zinc-200 text-lg font-psemibold">{task[0]}-{task[1]}</Text>
									</TouchableOpacity>
								))
						) : (
							<View className="w-full flex-col justify-center items-center">
								<Text className="font-semibold text-zinc-200 text-lg">No tasks yet</Text>
							</View>
						)}
					</ScrollView>
					<TouchableOpacity 
						onPress={() => {
							setIsTaskListVisible(false);
							setTimeout(() => {
								setIsPopupVisible(true);
							}, 250);
						}}
						className="w-full rounded-full overflow-hidden shadow-lg pt-2 mb-4"
					>
          <LinearGradient
            colors={['#0ea5e9', '#60a5fa']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            className="w-full rounded-full h-14 flex-row justify-center items-center"
          >
						<Text className="text-white text-lg font-semibold">Add New Session</Text>
					</LinearGradient>
					</TouchableOpacity>
				</BottomPopup>
				<BottomPopup
					visible={isPresetPopupVisible}
					onClose={() => setIsPresetPopupVisible(false)}
					height={0.65}
				>
					<ScrollView className="flex-grow">
					<MaskedView
              maskElement={
				<Text className="text-3xl font-bold text-white mb-6 text-center">Presets</Text>
                  }
                >
                <LinearGradient
                  colors={['#D4D4D8', '#71717A']}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                >
					<Text className="text-3xl font-bold text-white mb-6 text-center opacity-0">Presets</Text>
                </LinearGradient>
					</MaskedView>
				  <View className="flex-col justify-center items-center">
					{user.preset.map((preset, index) => (
						<TouchableOpacity 
							onPress={() => {
								console.log(preset)
								router.push({
									pathname: 'log/addPreset', 
									params: { preset: JSON.stringify(preset) }
								});
								setTimeout(() => {
									setIsPresetPopupVisible(false);
								}, 200);
							}}
						key={index} className="w-full flex-row items-center justify-between p-2 bg-zinc-800 rounded-xl  mb-4">
							<Text className="text-zinc-200 text-base font-psemibold">{preset.name}</Text>
							<View className="flex-row items-center justify-center rounded-2xl p-2 bg-zinc-900">
								<Image source={icons.clockGray} className="w-3 h-3 mr-1" />
								<Text className="text-zinc-400 text-sm font-pregular">{workLength(preset.sessions)} of work</Text>
							</View>
						</TouchableOpacity>
					))}
				  </View>
					</ScrollView>

					<View className="flex-col justify-center items-start w-full">
					<View className="flex-row items-center justify-start">
						<Image source={icons.alertCircle} className="w-5 h-5 mr-2" />
						<Text className="text-blue-500 text-xs font-pregular">Added presets will delete overlapping sessions</Text>
					</View>
						<TouchableOpacity 
								  onPress={() => {
									router.push({
										pathname: 'log/createPreset', 
									})
									setTimeout(() => {
										setIsPresetPopupVisible(false);
									}, 200);
								  }}
								  className="w-full rounded-full overflow-hidden shadow-lg pt-2 mb-4"
								>
									
								  <LinearGradient
									colors={['#0ea5e9', '#60a5fa']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 1}}
									className="w-full rounded-full h-14 flex-row justify-center items-center"
								  >
							<Text className="text-white text-lg font-semibold">Create New Preset</Text>
						</LinearGradient>
						</TouchableOpacity>
					</View>
				</BottomPopup>


			</View>
		</SafeAreaView>
	);
};



export default SchedulePage;
