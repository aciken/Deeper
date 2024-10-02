import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalProvider';
import { icons } from '../../constants';
import HourTable from '../components/HourTable';
import IconButton from '../components/IconButton';
import { useRouter, Redirect } from 'expo-router';
import BottomPopup from '../components/BottomPopup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';


const Schedule = () => {
	const { user, setSelected } = useGlobalContext();
	const router = useRouter();
	const todayDateNumber = new Date().getDate();
	const [clicked, setClicked] = useState(todayDateNumber);
	const [all, setAll] = useState(false);
	const [multiSelect, setMultiSelect] = useState(false);
	const [selectedDates, setSelectedDates] = useState([]);
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [startTime, setStartTime] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);

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
		<TouchableOpacity onPress={onPress} disabled={disabled}>
			<LinearGradient
				colors={colors}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				className="w-20 h-20 rounded-2xl shadow-lg justify-center items-center m-1"
			>
				{children}
			</LinearGradient>
		</TouchableOpacity>
	);

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
											? 'bg-teal-500'
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
					/>
				</View>

				<View className="flex-row justify-center items-center mt-4">

				</View>

				<View className="flex-row justify-center translate-y-4">
					<ButtonGradient
						colors={['#334155', '#1e293b', '#0f172a']}
						onPress={() => setIsPopupVisible(true)}
					>
						<View className="items-center">
							<Image source={icons.plusBlue} className="w-8 h-8 tint-white mb-1" />
							<Text className="text-white text-xs font-semibold">Add Task</Text>
						</View>
					</ButtonGradient>

					<ButtonGradient
						colors={['#334155', '#1e293b', '#0f172a']}
						onPress={() => {if(!multiSelect) router.push({ pathname: 'log/taskList', params: {clicked, all} })}}
						disabled={multiSelect}
					>
						<View className="items-center">
							<Image source={icons.listBlue} className="w-8 h-8 tint-white mb-1" />
							<Text className="text-white text-xs font-semibold">Task List</Text>
						</View>
					</ButtonGradient>

					<ButtonGradient
						colors={multiSelect ? ['#6ee7b7', '#10b981'] : ['#334155', '#1e293b', '#0f172a']}
						onPress={() => {
							setMultiSelect(!multiSelect);
							if (!multiSelect) {
								setSelectedDates([]);
							}
						}}
					>
						<View className="items-center">
							<Image 
								source={icons.calendar} 
								className={`w-8 h-8 ${multiSelect ? 'tint-white' : 'tint-white'} mb-1`}
							/>
							<Text className="text-white text-xs font-semibold">
								{multiSelect ? 'Multi On' : 'Multi Off'}
							</Text>
						</View>
					</ButtonGradient>

					<BottomPopup
						visible={isPopupVisible}
						onClose={() => setIsPopupVisible(false)}
					>
						<Text className="text-3xl font-bold text-white mb-6 text-center">Add Deep Work Session</Text>
						<View className="mb-6">
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
							className="py-4 rounded-xl items-center overflow-hidden bg-gradient-to-r from-green-500 to-green-600"
						>
							
							<Text className="text-white font-bold text-lg z-10">Start Deep Work</Text>
						</TouchableOpacity>
					</BottomPopup>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Schedule;
