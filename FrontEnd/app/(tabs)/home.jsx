import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, BackHandler, Dimensions, TouchableOpacity, Image, Platform } from 'react-native';
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
		name: 'Pro',
		progress: 20, // percentage of progress (0-100)
	};

	useEffect(() => {
		console.log('Home');
		const email = user.email;

		axios.post('https://505c-188-2-139-122.ngrok-free.app/getUser', { email })
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
						
								<View className="flex-col justify-center items-start pl-1">
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
						
								<View className="flex-col justify-center items-start pl-1">
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
			
			<BottomPopup
				visible={isChallengePopupVisible}
				onClose={() => setIsChallengePopupVisible(false)}
			>
				<Text className="text-3xl font-bold text-white mb-6 text-center">Challenges</Text>
			</BottomPopup>
		</SafeAreaView>
	);
};

export default Home;
