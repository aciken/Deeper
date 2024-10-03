import React, { useState } from 'react';
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
	const [newAll, setNewAll] = useState(false);
	const [startTime, setStartTime] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);

	const changeEditVisible = () => {
		setIsEditVisible(!isEditVisible);
	};

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

	const submitWork = (start, end, name) => {
		console.log(start, end);
	
		const data  = [start,end, name]

		console.log(data);

		axios.put('https://8c98-188-2-139-122.ngrok-free.app/addWork', {
		  data,
		  id: user._id,
		  clicked,
		  newAll
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
						tasks={multiSelect ? [] : (all ? user.allArray : user.array[clicked - 1])}
						clicked={clicked}
						todayDateNumber={todayDateNumber}
						all={all}
						changeEditVisible={() => setIsEditVisible(!isEditVisible)}
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
						onPress={() => {if(!multiSelect) router.push({ pathname: 'log/taskList', params: {clicked, all} })}}
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
								<Text className="text-white font-bold">Start: {startTime.toLocaleTimeString()}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									setShowStartPicker(false);
									setShowEndPicker(true);
								}}
								className="flex-1 ml-2 py-3 rounded-xl items-center bg-gray-700"
							>
								<Text className="text-white font-bold">End: {endTime.toLocaleTimeString()}</Text>
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
					<TouchableOpacity
						onPress={handleAddDeepWork}
						className=" h-16 mt-4 overflow-hidden"
					>
						<LinearGradient
							colors={['#38bdf8', '#818cf8']}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 1}}
							className="w-full h-full rounded-xl justify-center items-center"
						>
							<Text className="text-white font-bold text-lg">
								Start Deep Work
							</Text>
						</LinearGradient>
					</TouchableOpacity>
				</BottomPopup>

				<BottomPopup
					visible={isPopupVisible}
					onClose={() => setIsPopupVisible(false)}
				>
					<Text className="text-3xl font-bold text-white mb-6 text-center">Add Deep Work Session</Text>
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
								<Text className="text-white font-bold">Start: {startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									setShowStartPicker(false);
									setShowEndPicker(true);
								}}
								className="flex-1 ml-2 py-3 rounded-xl items-center bg-gray-700"
							>
								<Text className="text-white font-bold">End: {endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
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
					<TouchableOpacity
						onPress={() => submitWork(startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), sessionName)}
						className=" h-16 mt-4 overflow-hidden"
					>
						<LinearGradient
							colors={['#38bdf8', '#818cf8']}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 1}}
							className="w-full h-full rounded-xl justify-center items-center"
						>
							<Text className="text-white font-bold text-lg">
								Start Deep Work
							</Text>
						</LinearGradient>
					</TouchableOpacity>
				</BottomPopup>
			</View>
		</SafeAreaView>
	);
};

export default Schedule;
