import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, BackHandler, Dimensions, TouchableOpacity, Image } from 'react-native';
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

const Home = () => {
	const { setUser, user, setIsLoading } = useGlobalContext();
	const isFocused = useIsFocused();
	const screenWidth = Dimensions.get('window').width;
	const barWidth = (screenWidth - 80) / 7; // 80 is total padding

	const [isChallengePopupVisible, setIsChallengePopupVisible] = useState(false);

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
		name: 'Intermediate',
		progress: 40, // percentage of progress (0-100)
	};

	useEffect(() => {
		console.log('Home');
		const email = user.email;

		axios.post('https://c3b8-188-2-139-122.ngrok-free.app/getUser', { email })
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

				{/* New Iceberg Level Design Section */}
				<View className="mx-4 mb-8 bg-gray-900 p-6 rounded-2xl">
					<Text className="text-white text-xl font-bold mb-4">Knowledge Depth</Text>
					<TouchableOpacity onPress={() => setIsChallengePopupVisible(true)} className="items-center">
						<MaskedView
							style={{ width: 200, height: 200, zIndex: 2, opacity: 0.9 }}
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
											colors={['#93c5fd', '#030712']}
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
									<Text className="text-white text-lg font-bold z-10">{currentLevel.name}</Text>
								</View>

						</MaskedView>
						<View style={{ width: 200, height: 200, position: 'absolute' }}>	
							<Image
								source={iceberg}
								style={{ width: 200, height: 200, zIndex: 1 }}
								resizeMode="contain"
							/>
						</View>

					</TouchableOpacity>
						<Text className="text-gray-400 text-sm mt-2 text-center">
							Dive deeper to unlock new levels of understanding
						</Text>
				</View>

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
				<BottomPopup
					visible={isChallengePopupVisible}
					onClose={() => setIsChallengePopupVisible(false)}
				>
					<Text className="text-3xl font-bold text-white mb-6 text-center">Challenges</Text>
				</BottomPopup>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Home;
