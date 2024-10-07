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


const Schedule = () => {
	const { user, setUser, setSelected } = useGlobalContext();
	const router = useRouter();
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

	console.log(user.array[clicked-1])


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

	const [sessionName, setSessionName] = useState('Work Session');

	const submitWork = (start, end, name,dates) => {
		const dayIndices = dates.map(date => new Date(date).getDate() - 1);

		
	
		const data  = [start,end, name]



		axios.put('https://912a-188-2-139-122.ngrok-free.app/addWork', {
		  data,
		  id: user._id,
		  clicked,
		  dayIndices,
		}).then(res => {
			console.log('data', res.data)
		  if(res.data == 'Time overlap'){
			console.log('works are overlapping')
			alert('Works are overlapping')
		  } else {
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
		console.log(index)
        axios.put('https://912a-188-2-139-122.ngrok-free.app/deleteWork', {
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

        const data  = [start,end, name]

        axios.put('https://912a-188-2-139-122.ngrok-free.app/editWork', {
            data,
            id: user._id,
            index,
            clicked,
        }).then(res => {
            if(res.data === 'Time overlap'){
                alert('Works are overlapping')
            } else {
                setUser(res.data);
                setIsEditVisible(!isEditVisible)
            }
        }).catch((e) => {
            console.error(e);
        })
    }

	const changeEditData = (start, end, name) => {
		setStartTime(start)
		setEndTime(end)
		setSessionName(name)
	}

	const formatTime = (time) => {
		if (time instanceof Date) {
			return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		}
		return ''; // Return an empty string or some default value if time is not a Date
	};

	// Add this function to handle task editing
	const handleEditTask = (task, index) => {
		// Implement the logic to edit the task
		console.log('Editing task:', task, 'at index:', index);
		// You might want to navigate to an edit task screen or show another popup
	};

	function convertTimeStringToDate(timeString) {
		const [hours, minutes] = timeString.split(':');
		
		let date = new Date();
		date.setHours(parseInt(hours, 10));
		date.setMinutes(parseInt(minutes, 10));
		date.setSeconds(0);
		date.setMilliseconds(0);
		
		return date;
	  }

	  
	const [selectedWork, setSelectedWork] = useState('');
	const [selectedDate, setSelectedDate] = useState(null);
	const [showDatePicker, setShowDatePicker] = useState(false);

	useEffect(() => {
		console.log(selectedDates)
	}, [selectedDates])
	  

	return (
		<SafeAreaView className="flex-1 bg-gray-950">
			<View className="flex-1 p-4">
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className=""
				>
					{user.array && user.array.map((_, index) => {
						if (index + 1 > todayDateNumber - 1 && index < todayDateNumber + 6) {
							const currentDate = index + 1;
							return (
								<TouchableOpacity
									key={currentDate}
									onPress={() => handleDateClick(currentDate)}
									className={`w-12 h-16 justify-center items-center rounded-xl mr-2 ${
										(multiSelect ? selectedDates.includes(currentDate) : currentDate === clicked)
											? 'bg-sky-500'
											: 'bg-gray-800'
									} ${multiSelect ? 'border border-gray-300' : ''}`}
								>
									<Text className={`text-xs mb-1 ${
										(multiSelect ? selectedDates.includes(currentDate) : currentDate === clicked)
											? 'text-gray-100'
											: 'text-gray-400'
									}`}>{getDayName(currentDate)}</Text>
									<Text className="text-gray-100 text-lg font-bold">{currentDate}</Text>
								</TouchableOpacity>
							);
						}
						return null;
					})}
				</ScrollView>

				<View className="h-[73%]"> 
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

				<View className="flex-row justify-center ">
					<TouchableOpacity onPress={() => setIsPopupVisible(true)}  className="w-28 h-16 rounded-2xl shadow-lg justify-center items-center m-1 bg-gray-800">
						<View className="items-center">
							<Image source={icons.plusBlue} className="w-6 h-6 tint-white mb-1" />
							<Text className="text-white text-xs font-semibold">Add Task</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity 	
						onPress={() => {if(!multiSelect) setIsTaskListVisible(!isTaskListVisible)}}
						disabled={multiSelect ? true : false}
						className={`w-28 h-16 rounded-2xl shadow-lg justify-center items-center m-1 ${multiSelect ? 'bg-gray-900 opacity-60' : 'bg-gray-800'}`}
					>
						<View className="items-center">
							<Image source={icons.listBlue} className="w-6 h-6 tint-white mb-1" />
							<Text className="text-white text-xs font-semibold">Task List</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity 	
						onPress={() => {
							setMultiSelect(!multiSelect);
							if (!multiSelect) {
								setSelectedDates([]);
							}
						}}
						className={`w-28 h-16 rounded-2xl shadow-lg justify-center items-center m-1 ${multiSelect ? 'bg-sky-500' : 'bg-gray-800'}`}
					>
						<View className="items-center">
							<Image 
								source={icons.calendar} 
								className={`w-6 h-6 ${multiSelect ? 'tint-white' : 'tint-white'} mb-1`}
							/>
							<Text className="text-white text-xs font-semibold">
								{multiSelect ? 'Multi On' : 'Multi Off'}
							</Text>
						</View>
					</TouchableOpacity>
				</View>

				<BottomPopup
					visible={isEditVisible}
					onClose={() => setIsEditVisible(false)}
				>
					<Text className="text-3xl font-bold text-white mb-6 text-center">Edit Deep Work Session</Text>
					<View className="mb-6">
						<Text className="text-lg text-blue-300 mb-2">Session Name:</Text>
						<TextInput
							placeholder="Enter session name"
							placeholderTextColor="#9CA3AF" 
							className="bg-gray-700 text-white py-3 px-4 rounded-xl mb-4"
							onChangeText={(text) => setSessionName(text)}
							value={sessionName}
						/>
						<Text className="text-lg text-blue-300 mb-2">Duration:</Text>
						<View className="flex-row justify-between items-center mb-4">
							<TouchableOpacity
								onPress={() => {
									setShowStartPicker(true);
									setShowEndPicker(false);
								}}
								className="flex-1 mr-2 py-3 rounded-xl items-center bg-gray-700"
							>
								<Text className="text-white font-bold">Start: {formatTime(startTime)}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									setShowStartPicker(false);
									setShowEndPicker(true);
								}}
								className="flex-1 ml-2 py-3 rounded-xl items-center bg-gray-700"
							>
								<Text className="text-white font-bold">End: {formatTime(endTime)}</Text>
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
							/>
						)
					)}
					<View className="flex-row justify-center items-center gap-4 w-full">
						<TouchableOpacity
							onPress={() => editFunc(formatTime(startTime), formatTime(endTime), sessionName)}
						className=" h-16 mt-4 overflow-hidden w-[70%]"
					>
						<LinearGradient
							colors={['#38bdf8', '#818cf8']}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 1}}
							className="w-full h-full rounded-xl justify-center items-center"
						>
							<Text className="text-sky-100 font-bold text-lg">
								Edit Work Session
							</Text>
						</LinearGradient>
					</TouchableOpacity>
						<TouchableOpacity
							onPress={() => deleteFunc()}
							className=" h-16 w-16 mt-4 overflow-hidden"
						>
							<LinearGradient
								colors={['#ef4444', '#b91c1c']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 1}}
								className="w-full h-full rounded-xl justify-center items-center"
							>
								<Image source={icons.trash} className="w-8 h-8 tint-white" />
							</LinearGradient>
						</TouchableOpacity>	
					</View>
				</BottomPopup>

				<BottomPopup
					visible={isPopupVisible}
					onClose={() => setIsPopupVisible(false)}
				>
					<ScrollView className="flex-grow">
						<Text className="text-3xl font-bold text-white mb-6 text-center">Add Deep Work Session</Text>
						
						{/* Date selection */}
						<View className="mb-6">
							<Text className="text-lg text-blue-300 mb-2">Select Date(s):</Text>
							<ScrollView 
								horizontal 
								showsHorizontalScrollIndicator={false}
								className="mb-4"
							>
								{[...Array(7)].map((_, index) => {
									const date = new Date();
									date.setDate(date.getDate() + index);
									const isClickedDate = date.getDate() === clicked;
									const isSelected = selectedDates.some(selectedDate => 
										selectedDate.toDateString() === date.toDateString()
									);
									if(selectedDates.length == 0){
										const newDate = new Date();
										newDate.setDate(newDate.getDate(), clicked)
										console.log(newDate)
										setSelectedDates([...selectedDates, newDate])
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
												isSelected || (isClickedDate && selectedDates.length === 0) ? 'bg-sky-500' : 'bg-gray-700'
											}`}
										>
											<LinearGradient
												colors={isSelected || (isClickedDate && selectedDates.length === 0) ? ['#38bdf8', '#3b82f6'] : ['#374151', '#374151']}
												start={{x: 0, y: 0}}
												end={{x: 1, y: 1}}
												className="w-full h-full rounded-xl justify-center items-center"
											>
												<Text className={`text-xs mb-1 ${
													isSelected || (isClickedDate && selectedDates.length === 0) ? 'text-gray-100' : 'text-gray-400'
												}`}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
												<Text className="text-gray-100 text-lg font-bold">{date.getDate()}</Text>
											</LinearGradient>
										</TouchableOpacity>
									);
								})}
							</ScrollView>
						</View>

						<View className="mb-6">
							<Text className="text-lg text-blue-300 mb-2">Session Name:</Text>
							<TextInput
								placeholder="Enter session name"
								placeholderTextColor="#9CA3AF"
								className="bg-gray-700 text-white py-3 px-4 rounded-xl mb-4"
								onChangeText={(text) => setSessionName(text)}
								value={sessionName}
							/>
							<Text className="text-lg text-blue-300 mb-2">Select Work:</Text>
							<TouchableOpacity
								onPress={() => {/* TODO: Implement work selection */}}
								className="bg-gray-700 py-3 px-4 rounded-xl mb-4"
							>
								<Text className="text-white">
									{selectedWork ? selectedWork : "Select a work"}
								</Text>
							</TouchableOpacity>
							<Text className="text-lg text-blue-300 mb-2">Duration:</Text>
							<View className="flex-row justify-between items-center mb-4 h-10">
								<TouchableOpacity
									onPress={() => {
										setShowStartPicker(true);
										setShowEndPicker(false);
									}}
									className="flex-1 mr-2 overflow-hidden"
								>
									<LinearGradient
										colors={showStartPicker ? ['#38bdf8', '#3b82f6'] : ['#374151', '#374151']}
										start={{x: 0, y: 0}}
										end={{x: 1, y: 1}}
										className="w-full h-full  rounded-xl justify-center items-center"
									>
										<Text className={`font-bold ${showStartPicker ? 'text-gray-100' : 'text-white'}`}>Start: {formatTime(startTime)}</Text>
									</LinearGradient>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => {
										setShowStartPicker(false);
										setShowEndPicker(true);
									}}
									className="flex-1 ml-2 overflow-hidden"
								>
									<LinearGradient
										colors={showEndPicker ? ['#38bdf8', '#3b82f6'] : ['#374151', '#374151']}
										start={{x: 0, y: 0}}
										end={{x: 1, y: 1}}
										className="w-full h-full  rounded-xl justify-center items-center"
									>
										<Text className={`font-bold ${showEndPicker ? 'text-gray-100' : 'text-white'}`}>End: {formatTime(endTime)}</Text>
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
					<TouchableOpacity
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
					</TouchableOpacity>
				</BottomPopup>

				<BottomPopup
					visible={isTaskListVisible}
					onClose={() => setIsTaskListVisible(false)}
				>
					<Text className="text-3xl font-bold text-white mb-6 text-center">Task List</Text>
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
										className="w-full flex-row items-center justify-between h-20 bg-gray-700 rounded-xl border border-gray-600 p-2 mb-4"
										onPress={() => {
											setIsTaskListVisible(false);
											changeEditData(
												convertTimeStringToDate(task[0]),
												convertTimeStringToDate(task[1]),
												task[2]
											)
											setTimeout(() => {
												setIsEditVisible(true);
												setIndex(index)
											}, 250);
										}}
										activeOpacity={0.8}
									>
										<Text className="text-gray-200 text-lg font-semibold">{task[2]}</Text>
										<Text className="text-gray-200 text-lg font-semibold">{task[0]}-{task[1]}</Text>
									</TouchableOpacity>
								))
						) : (
							<View className="w-full flex-col justify-center items-center">
								<Text className="font-semibold text-gray-200 text-lg">No tasks yet</Text>
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
						className="mt-4 w-full bg-blue-600 h-12 rounded-xl justify-center items-center"
					>
						<LinearGradient
							colors={['#38bdf8', '#818cf8']}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 1}}
							className="w-full h-full rounded-xl justify-center items-center"
						>
							<Text className="text-white font-bold text-lg">Add New Task</Text>
						</LinearGradient>
					</TouchableOpacity>
				</BottomPopup>
			</View>
		</SafeAreaView>
	);
};

export default Schedule;