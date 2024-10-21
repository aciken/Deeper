import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, BackHandler, Dimensions, TouchableOpacity, Image, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalProvider';
import { Ionicons } from '@expo/vector-icons';
import icons from '../../constants/icons';
import iceberg from '../../assets/images/iceberg.png';
import BottomPopup from '../components/BottomPopup';
import MaskedView from '@react-native-masked-view/masked-view';
import DateTimePicker from '@react-native-community/datetimepicker';


const Home = () => {
	const { setUser, user, setIsLoading } = useGlobalContext();
	const isFocused = useIsFocused();
	const screenWidth = Dimensions.get('window').width;
	const barWidth = (screenWidth - 80) / 7; // 80 is total padding

	const [isChallengePopupVisible, setIsChallengePopupVisible] = useState(false);
	const [isStartSessionPopupVisible, setIsStartSessionPopupVisible] = useState(false);
	const [isWorkDropdownVisible, setIsWorkDropdownVisible] = useState(false);
	const [isDurationDropdownVisible, setIsDurationDropdownVisible] = useState(false);
	const [selectedWork, setSelectedWork] = useState(null);
	const [duration, setDuration] = useState({ hours: 0, minutes: 0 });
	const [showTimePicker, setShowTimePicker] = useState(false);

	// Sample data for the last week (hours worked each day)
	const weekData = [
		{ day: 'Mon', hours: 6 },
		{ day: 'Tue', hours: 8 },
		{ day: 'Wed', hours: 7 },
		{ day: 'Thu', hours: 9 },
		{ day: 'Fri', hours: 5 },
		{ day: 'Sat', hours: 3 },
		{ day: 'Sun', hours: 2 },
	];

	const maxHours = Math.max(...weekData.map(d => d.hours));

	// Use state for animation instead of Animated.Value
	const [barHeights, setBarHeights] = useState(weekData.map(() => 0));

	// Add this new constant for level data
	const currentLevel = {
		name: 'Pro',
		progress: 20, // percentage of progress (0-100)
	};


	const points = {
		daily: [
			{
				points: 1,
				description: 'Work 8 hours today',
				current: '2h 24m',
				done: false,
			},
			{
				points: 1,
				description: 'Work 2 hours on morning',
				current: '2h 24m',
				done: true,
			}
		],
		general: [
			{
				points: 5,
				description: 'Work 100 hours on one project',
				current: '25h',
				done: false,
			},
			{
				points: 10,
				description: 'Work 300 hours',
				current: '120h',
				done: false,
			}
		]
	}



	const [works, setWorks] = useState(user?.work || []);

	useEffect(() => {
		console.log('Home');
		const email = user.email;

		axios.post('https://421e-188-2-139-122.ngrok-free.app/getUser', { email })
			.then(res => {
				setIsLoading(false);
				setUser(res.data);
			})
			.catch((e) => {
				console.error('Error fetching user data:', e);
			});

		// Animate bars using setTimeout instead of Animated API
		const animateBars = () => {
			const duration = 300; // 1 second
			const steps = 60; // 60 steps for smooth animation
			let currentStep = 0;

			const interval = setInterval(() => {
				currentStep++;
				const progress = currentStep / steps;
				setBarHeights(weekData.map((day) => 
					(day.hours / maxHours) * 100 * progress
				));

				if (currentStep >= steps) {
					clearInterval(interval);
				}
			}, duration / steps);
		};

		animateBars();
	}, []);

	useEffect(() => {
		if (isFocused) {
			const backAction = () => {
				BackHandler.exitApp();
				return true;
			};

			const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
			return () => backHandler.remove();
		}
	}, [isFocused]);

	const onTimeChange = (event, selectedTime) => {
		setShowTimePicker(Platform.OS === 'ios');
		if (selectedTime) {
			setDuration({
				hours: selectedTime.getHours(),
				minutes: selectedTime.getMinutes(),
			});
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
			<View className="flex-1">
				<ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
					{/* Logo and Welcome Section */}
					<View className="flex-row items-center justify-start mt-2 mb-4 ml-4">
							<Text className="text-white text-4xl font-bold">deeper</Text>
					</View>

					{/* New Iceberg Level Design Section */}
					<TouchableOpacity onPress={() => setIsChallengePopupVisible(true)} className="mx-4 mb-8 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
						<Text className="text-zinc-300 text-xl font-bold mb-4">Work Depth</Text>
						<View className="items-center">
							<MaskedView
								style={{ width: 200, height: 200, zIndex: 2, opacity: 0.95 }}
								maskElement={
									<View style={{ backgroundColor: 'transparent' }}>
										<Image
											source={iceberg}
											style={{ width: 200, height: 200 }}
											resizeMode="contain"
										/>
									</View>
								}
							>

									<View style={{ flex: 1 }}>
											<LinearGradient
												colors={['#27272a', '#18181b']}
												style={{
													position: 'absolute',
													bottom: 0,
													left: 0,
													right: 0,
													height: `${100 - currentLevel.progress}%`,
												}}
												start={{ x: 0, y: 0 }}
												end={{ x: 0, y: 1 }}
											/>
											<View style={{
												position: 'absolute',
												top: 0,
												left: 0,
												right: 0,
												bottom: `${100 - currentLevel.progress}%`,
												backgroundColor: 'transparent',
											}} />
									</View>
									<View style={{ 
										position: 'absolute', 
										top: 0, 
										left: 0, 
										right: 0, 
										bottom: 0, 
										justifyContent: 'center', 
										alignItems: 'center' 
									}}>
									<MaskedView
										maskElement={
											<Text className="text-white text-3xl font-bold z-10">{currentLevel.progress}%</Text>
										}
									>
										<LinearGradient
											colors={['#fafafa', '#3f3f46']}
											start={{x: 0, y: 0}}
											end={{x: 0, y: 1}}
										>
										<Text className="text-white text-3xl font-bold z-10 opacity-0">{currentLevel.progress}%</Text>
										</LinearGradient>
									</MaskedView>
										
									</View>

							</MaskedView>
							<View style={{ width: 200, height: 200, position: 'absolute' }}>	
								<Image
									source={iceberg}
									style={{ width: 200, height: 200, zIndex: 1 }}
									resizeMode="contain"
								/>
							</View>
							</View>

							<View className="flex flex-col justify-center items-center">
									<MaskedView
										maskElement={
											<Text className="text-sm font-semibold mt-2 text-center">
												Work more to go deeper
											</Text>
										}
									>
										<LinearGradient
											colors={['#a1a1aa', '#27272a']}
											start={{x: 0, y: 0}}
											end={{x: 0, y: 1.5}}
										>
											<Text className="text-sm mt-2 font-semibold text-center opacity-0">
											Work more to go deeper
											</Text>
										</LinearGradient>
									</MaskedView>
									<MaskedView
										maskElement={
											<Text className="text-center rotate-90 font-bold text-3xl">
												{'>'}
											</Text>
										}
									>
										<LinearGradient
											colors={['#a1a1aa', '#27272a']}
											start={{x: 0, y: 0}}
											end={{x: 0, y: 1}}
										>
											<Text className="text-center rotate-90 font-bold text-3xl opacity-0">
											{'>'}
											</Text>
										</LinearGradient>
									</MaskedView>


							</View>

							</TouchableOpacity>

					{/* Quick Actions */}
					{/* <View className="flex-row justify-around mb-6">
						<TouchableOpacity className="items-center">
							<View className="bg-gray-800 p-3 rounded-full border border-gray-700">
								<Image source={icons.plusGrad} className="w-8 h-8"  />
							</View>
							<Text className="text-white mt-1">Start Session</Text>
						</TouchableOpacity>
						<TouchableOpacity className="items-center">
							<View className="bg-gray-800 p-3 rounded-full border border-gray-700">
								<Image source={icons.taskGrad} className="w-8 h-8"  />
							</View>
							<Text className="text-white mt-1">Challenge</Text>
						</TouchableOpacity>
						<TouchableOpacity className="items-center">
							<View className="bg-gray-800 p-3 rounded-full border border-gray-700">
								<Image source={icons.clockGrad} className="w-8 h-8"  />
							</View>
							<Text className="text-white mt-1">Schedule</Text>
						</TouchableOpacity>
					</View> */}

					{/* Today's Focus */}
					<View className="flex flex-col justify-center items-center">
						<View className="flex-row justify-center items-baseline px-4">
							<MaskedView
								maskElement={
									<Text className="text-white text-4xl font-bold">2h 24m</Text>
								}
							>
								<LinearGradient
									colors={['#7DD3FC', '#2563eb']}
									start={{x: 0, y: 0}}
									end={{x: 0, y: 1}}
								>
									<Text className="text-white text-4xl font-bold opacity-0">2h 24m</Text>
								</LinearGradient>
							</MaskedView>
							<Text className="text-white text-2xl font-bold mx-1">/</Text>
							<Text className="text-white text-xl font-bold">8h</Text>
						</View>
						<MaskedView
								maskElement={
									<Text className="text-white text-lg font-semibold">Deep work today</Text>
								}
							>
							<LinearGradient
								colors={['#7DD3FC', '#2563eb']}
								start={{x: 0, y: 0}}
								end={{x: 0, y: 1}}
							>
								<Text className="text-white text-lg font-semibold opacity-0">Deep work today</Text>
							</LinearGradient>
						</MaskedView>

					</View>


					<View className="flex flex-col">
						<TouchableOpacity className="flex-row justify-between items-center p-4">
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
							<Text className="text-white text-base font-psemibold">1h 24m</Text>
						</TouchableOpacity>

						<TouchableOpacity className="flex-row justify-between items-center p-4">
							<View className="flex-row justify-center items-center">
							<LinearGradient
									colors={['#DC2626', '#761414']}
									start={{x: 0, y: 0}}
									end={{x: 0, y: 1}}
									className="w-6 h-6 rounded-full"
								>
								</LinearGradient>
						
								<View className="flex-col justify-center items-start pl-2">
									<Text className="text-white text-base font-semibold">School</Text>
									<Text className="text-gray-400 text-sm font-pregular">Homework</Text>
								</View>
							</View>
							<Text className="text-white text-base font-psemibold">1h</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>


				
				{/* Start Session Button */}
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
				visible={isChallengePopupVisible}
				onClose={() => setIsChallengePopupVisible(false)}
				height={0.65}
			>
				<View className="p-2 bg-zinc-900 rounded-t-3xl">
				<MaskedView
								maskElement={
									<Text className="text-white text-3xl font-bold mb-6 text-center">Work Depth</Text>
								}
							>
							<LinearGradient
								colors={['#D4D4D8', '#71717A']}
								start={{x: 0, y: 0}}
								end={{x: 0, y: 1}}
							>
							<Text className="text-white text-3xl font-bold mb-6 text-center opacity-0">Work Depth</Text>
							</LinearGradient>
						</MaskedView>

					
					<View className="mb-6">
						<View className="flex-row justify-between items-center mb-2">
							<Text className="text-sky-400 text-lg font-semibold">20%</Text>
						</View>
						<View className="bg-zinc-800 h-2 rounded-full">
							<LinearGradient
								colors={['#38BDF8', '#216F92']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 0}}
								className="h-2 rounded-full"
								style={{ width: '20%' }}
							>
								<View className="bg-sky-400 h-2 rounded-full" style={{ width: '20%' }} />
							</LinearGradient>
						</View>
					</View>

					<View className="mb-6">
						<Text className="text-white text-xl font-semibold mb-4">Daily Points</Text>
						{points.daily.map((point, index) => (
							point.done ? (

							<View key={index} className="mb-3 flex flex-row justify-between items-center">
							<MaskedView
								maskElement={
									<Text className="text-zinc-400 font-pmedium">{point.description} <Text className="text-zinc-200">/ {point.current}</Text></Text>
								}
							>
							<LinearGradient
								colors={['#0369A1', '#0EA5E9']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 0}}
							>
								<Text className="text-zinc-400 font-pmedium opacity-0">{point.description} <Text className="text-zinc-200">/ {point.current}</Text></Text>
							</LinearGradient>
						</MaskedView>
						<TouchableOpacity className="rounded-full self-start overflow-hidden">
							<LinearGradient
								colors={['#0369A1', '#0EA5E9']}
								start={{x: 1, y: 1}}
								end={{x: 0, y: 0}}
								className="py-2 px-4"
							>
								<Text className="text-white font-semibold">collect {point.points}%</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
							) : 
							(
							<View key={index} className="mb-3 flex flex-row justify-between items-center">
								<Text className="text-zinc-400">{point.description} <Text className="text-zinc-200">/ {point.current}</Text></Text>
							<TouchableOpacity className="bg-zinc-800 py-2 px-4 rounded-full self-start">
								<Text className="text-zinc-400">collect {point.points}%</Text>
							</TouchableOpacity>
						</View>
							)
						))}
					</View>

					<View>
						<Text className="text-white text-xl font-semibold mb-4">General Points</Text>
						{points.general.map((point, index) => (
							point.done ? (
							<View key={index} className="mb-3 flex flex-row justify-between items-center">
							<MaskedView
								maskElement={
									<Text className="text-zinc-400 font-pmedium">{point.description} <Text className="text-zinc-200">/ {point.current}</Text></Text>
								}
							>
							<LinearGradient
								colors={['#0369A1', '#0EA5E9']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 0}}
							>
								<Text className="text-zinc-400 font-pmedium opacity-0">{point.description} <Text className="text-zinc-200">/ {point.current}</Text></Text>
							</LinearGradient>
						</MaskedView>
						<TouchableOpacity className="rounded-full self-start overflow-hidden">
							<LinearGradient
								colors={['#0369A1', '#0EA5E9']}
								start={{x: 1, y: 1}}
								end={{x: 0, y: 0}}
								className="py-2 px-4"
							>
								<Text className="text-white font-semibold">collect {point.points}%</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
							) :
						(
						<View key={index} className="mb-3 flex flex-row justify-between items-center">
							<Text className="text-zinc-400">{point.description} <Text className="text-zinc-200">/ {point.current}</Text></Text>
							<TouchableOpacity className="bg-zinc-800 py-2 px-4 rounded-full self-start">
								<Text className="text-zinc-400">collect {point.points}%</Text>
							</TouchableOpacity>
							</View>
						)
						))}
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
	);
};

export default Home;
