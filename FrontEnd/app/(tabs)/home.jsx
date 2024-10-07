import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, BackHandler, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalProvider';
import { Ionicons } from '@expo/vector-icons';
import icons from '../../constants/icons';
const Home = () => {
	const { setUser, user, setIsLoading } = useGlobalContext();
	const isFocused = useIsFocused();
	const screenWidth = Dimensions.get('window').width;
	const barWidth = (screenWidth - 80) / 7; // 80 is total padding

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

	useEffect(() => {
		console.log('Home');
		const email = user.email;

		axios.post('https://912a-188-2-139-122.ngrok-free.app/getUser', { email })
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

	return (
		<SafeAreaView className="h-full bg-gray-950">
			<ScrollView>
				{/* Logo and Welcome Section */}
				<View className="flex-row items-center justify-start mt-6 mb-4 ml-4">
					<Text className="text-white text-4xl font-bold">deeper</Text>
				</View>

				{/* Quick Actions */}
				<View className="flex-row justify-around mb-6">
					<TouchableOpacity className="items-center">
						<View className="bg-gray-800 p-3 rounded-full border border-gray-700">
							<Image source={icons.plusGrad} className="w-8 h-8"  />
						</View>
						<Text className="text-white mt-1">New Task</Text>
					</TouchableOpacity>
					<TouchableOpacity className="items-center">
						<View className="bg-gray-800 p-3 rounded-full border border-gray-700">
							<Image source={icons.taskGrad} className="w-8 h-8"  />
						</View>
						<Text className="text-white mt-1">Analytics</Text>
					</TouchableOpacity>
					<TouchableOpacity className="items-center">
						<View className="bg-gray-800 p-3 rounded-full border border-gray-700">
							<Image source={icons.clockGrad} className="w-8 h-8"  />
						</View>
						<Text className="text-white mt-1">Settings</Text>
					</TouchableOpacity>
				</View>

				{/* Today's Focus */}
				<View className="mx-4 mb-6 p-4 bg-gray-800 rounded-lg">
					<Text className="text-white text-xl font-bold mb-2">Next Work Session</Text>
					<Text className="text-gray-300">Coding</Text>
					<View className="flex-row items-center mt-2">
						<Ionicons name="time-outline" size={16} color="#9CA3AF" />
						<Text className="text-gray-400 ml-1">Begins in: 3 hours</Text>
					</View>
				</View>

				{/* Weekly Work Schedule (existing code) */}
				<View className="w-full justify-start items-center px-4 my-6 p-4">
					<Text className="text-white text-2xl font-bold mb-6">Last Week's Work Schedule</Text>
					<View className="flex-row justify-between w-full h-60 bg-gray-900 rounded-lg p-4 border border-gray-700">
						{weekData.map((day, index) => (
							<TouchableOpacity key={index} onPress={() => {}} className="items-center">
								<View className="flex-1 justify-end">
									<LinearGradient
										colors={['#0ea5e9', '#3b82f6']}
										style={{
											width: barWidth - 8,
											height: `${barHeights[index]}%`,
											borderRadius: 5,
										}}
									/>
								</View>
								<Text className="text-white mt-2 font-medium">{day.day}</Text>
								<Text className="text-gray-400 text-xs">{day.hours}h</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Home;