import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, BackHandler, Dimensions, TouchableOpacity, Image, Platform, TextInput, Animated } from 'react-native';
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
import AlertPopup from '../components/AlertPopup';

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
	const [sessionName, setSessionName] = useState('');
	const [duration, setDuration] = useState({ hours: 0, minutes: 0 });
	const [showTimePicker, setShowTimePicker] = useState(false);

	const [alertPopupVisible, setAlertPopupVisible] = useState(false);
	const [alertPopupMessage, setAlertPopupMessage] = useState('');
	const [alertPopupType, setAlertPopupType] = useState('info');

	const [currentSession, setCurrentSession] = useState(null);

	const [isSessionPageVisible, setIsSessionPageVisible] = useState(false);

	const [sessionTasks, setSessionTasks] = useState([]);
	const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
	const [newTaskText, setNewTaskText] = useState('');

	const findTaskById = (id) => {
		return user.work.find(work => work._id === id)
	}

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

	const [currentTime, setCurrentTime] = useState(0);
  
	useEffect(() => {
	  const updateCurrentLine = () => {
		const currentTime = new Date();
		const hours24 = currentTime.getHours();
		const minutes = currentTime.getMinutes();
  
		let newCurrentLine = 10 + hours24 * 20 + minutes / 3;
  
		setCurrentTime(newCurrentLine);
	  };
  
	  updateCurrentLine();
	  const intervalId = setInterval(updateCurrentLine, 60000);
  
	  return () => clearInterval(intervalId);
	}, []);


	// useEffect(() =>{
	// 	const currentDate = new Date();
	// 	const dayOfMonth = currentDate.getDate();

	// 	let timeWorked = 0;
	// 	user.array[dayOfMonth-1].forEach(task => {
	// 		if(task[5] < currentTime-10){
	// 			timeWorked += task[5] - task[4]
	// 		}
			
	// 	})
	// 	timeWorked = Math.round(timeWorked);
	// 	console.log('timeWorked', timeWorked)
	// 	if(user.tracker.daily !== timeWorked){
	// 		axios.put('https://5f6e-188-2-139-122.ngrok-free.app/updateTracker', {
	// 		change: timeWorked,
	// 		id: user._id
	// 		})
	// 		.then(res => {
	// 			setUser(res.data)
	// 		})
	// 		.catch(e => {
	// 			console.error('Error updating tracker:', e);
	// 		})
	// 	}
	// }, [user])


	// const workToday = () => {
	// 	const currentDate = new Date();
	// 	const dayOfMonth = currentDate.getDate();

	// 	let timeWorked = 0;
	// 	user.array[dayOfMonth-1].forEach(task => {
	// 		if(task[5] < currentTime-10){
	// 			timeWorked += task[5] - task[4]
	// 		}
			
	// 	})
	// 	timeWorked = Math.round(timeWorked);

	// 	const hours = Math.floor(timeWorked / 20);
	// 	const minutes = Math.round((timeWorked / 20 - hours) * 60);
	// 	const time = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
	// 	return time
	// }
	const workToday = () => {
		const todaysSessions = user.workSessions.filter(session => session.date === `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`);
		
		const now = new Date();
		const currentHours = now.getHours();
		const currentMinutes = now.getMinutes();
		const currentTimeInMinutes = currentHours * 60 + currentMinutes;

		let totalMinutes = 0;
		todaysSessions.forEach(session => {
			const [endHours, endMinutes] = session.endTime.split(':').map(Number);
			const endTimeInMinutes = endHours * 60 + endMinutes;

			if (endTimeInMinutes <= currentTimeInMinutes) {
				const [startHours, startMinutes] = session.startTime.split(':').map(Number);
				const startInMinutes = startHours * 60 + startMinutes;
				totalMinutes += endTimeInMinutes - startInMinutes;
			}
		});

		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		
		return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
	}

	const today = new Date(); 
	const dayOfMonth = today.getDate();

	// useEffect(() => {
	// 	setCurrentSession(findCurrentSession())
	// }, [user])
	
	const findCurrentSession = () => {
		const currentDate = `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`;
		const currentTime = new Date();
		const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

		const session = user.workSessions.find(session => {
			const [startHours, startMinutes] = session.startTime.split(':').map(Number);
			const startTimeInMinutes = startHours * 60 + startMinutes;
			const [endHours, endMinutes] = session.endTime.split(':').map(Number);
			const endTimeInMinutes = endHours * 60 + endMinutes;

			return session.date === currentDate && currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
		});


		return session;
	}
	
	// TIMER
	
	
	const [currentLine, setCurrentLine] = useState();
	
		const [timeNow, setTimeNow] = useState(new Date());
	const [h, setH] = useState(timeNow.getHours());
	const [m, setM] = useState(timeNow.getMinutes());
	const [s, setS] = useState(timeNow.getSeconds());
	
		const session = findCurrentSession();

		const [timeInSeconds, setTimeInSeconds] = useState(0);

		useEffect(() => {
			if (!session) return;

			const updateTimer = () => {
				const currentTime = new Date();
				const currentHours = currentTime.getHours();
				const currentMinutes = currentTime.getMinutes();
				const currentSeconds = currentTime.getSeconds();

				// Convert session end time (in points) to seconds
				const sessionEndInSeconds = (pointsFromTime(session.endTime) / 20) * 3600;  // Convert points to seconds

				// Convert current time to seconds since start of day
				const currentTimeInSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

				// Calculate remaining time
				const remainingSeconds = Math.round(sessionEndInSeconds - currentTimeInSeconds);
				setTimeInSeconds(remainingSeconds);
			};

			// Initial update
			updateTimer();

			// Update every second
			const intervalId = setInterval(updateTimer, 1000);

			return () => clearInterval(intervalId);
		}, [session]);

		// Function to format seconds into HH:MM:SS
		const formatTime = (seconds) => {
			if (seconds < 0) return "00:00:00";
			
			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			const secs = seconds % 60;

			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		};


		const pointsFromTime = (time) => {
			const [hours, minutes] = time.split(':').map(Number);
			return (hours * 20) + Math.round(minutes / 3);
		}



	const timeFromPoints = (points) => {
		const hours = Math.floor(points / 20);
		const minutes = Math.round((points / 20 - hours) * 60);
		const time = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
		return time
	}

	const getGoalWork = () => {
		const totalMinutes = user.work.reduce((acc, workSession) => {
			const [hours, minutes] = workSession.currentTime.split(' ').map(t => parseInt(t));
			return acc + (hours * 60) + (isNaN(minutes) ? 0 : minutes);
		}, 0);
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
	}



	const points = {
		daily: [
			{
				points: 1,
				description: "Work 4 hours today",
				goal: 4,
				type: 'daily',
			},
			{
				points: 1,
				description: "Work 2 hours this morning",
				goal: 2,
				type: 'morning',
			},
			{
				points: 1,
				description: "Work 2 hours this afternoon",
				goal: 2,
				type: 'afternoon',
			},
			{
				points: 1,
				description: "Work 2 hours on one project",
				goal: 2,
				type: 'project',
			}
		],
		general: [
			{
				points: 3,
				description: "Work 20 hours",
				goal: 20,
				type: 'general',
			},
			{
				points: 5,
				description: "Work 100 hours",
				goal: 100,
				type: 'general',
			},
			{
				points: 15,
				description: "Work 200 hours",
				goal: 200,
				type: 'general',
			},
			{
				points: 20,
				description: "Work 500 hours",
				goal: 500,
				type: 'general',
			},
			{
				points: 25,
				description: "Work 1000 hours",
				goal: 400,
				type: 'general',
			}
		],
		generalPlus: [
			{
				points: 3,
				description: "Work 10 hours on morning",
				goal: 10,
				type: 'morning',
			},
			{
				points: 3,
				description: "Work 50 hours on afternoon",
				goal: 25,
				type: 'afternoon',
			},
			{
				points: 5,
				description: "Work 100 hours on one project",
				goal: 50,
				type: 'project',
			},
			{
				points: 10,
				description: "Work 300 hours on one project",
				goal: 200,
				type: 'project',
			}
		]
	}


	const [currentPoints, setCurrentPoints] = useState({
		daily: [
			{
				points: points.daily[user.points.currentDaily[0]].points,
				description: points.daily[user.points.currentDaily[0]].description,
				goal: points.daily[user.points.currentDaily[0]].goal,
				type: points.daily[user.points.currentDaily[0]].type,
			},
			{
				points: points.daily[user.points.currentDaily[1]].points,
				description: points.daily[user.points.currentDaily[1]].description,
				goal: points.daily[user.points.currentDaily[1]].goal,
				type: points.daily[user.points.currentDaily[1]].type,
			}
		],
		general: [
			{
				points: points.general[user.points.currentGeneral[0]].points,
				description: points.general[user.points.currentGeneral[0]].description,
				goal: points.general[user.points.currentGeneral[0]].goal,
				type: points.general[user.points.currentGeneral[0]].type,
			},
			{
				points: points.generalPlus[user.points.currentGeneralPlus[0]].points,
				description: points.generalPlus[user.points.currentGeneralPlus[0]].description,
				goal: points.generalPlus[user.points.currentGeneralPlus[0]].goal,
				type: points.generalPlus[user.points.currentGeneralPlus[0]].type,
			}
		]
	});


	useEffect(() => {
		const changeChallanges = () => {
			if(user.points.pointsDate !== `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`) {
				const date = `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`
				axios.put('https://b99d-109-245-203-91.ngrok-free.app/changeDaily', {
					id: user._id,
					date
				})
				.then(res => {
					setUser(res.data);
					setCurrentPoints({
						daily: [
							{
								points: points.daily[res.data.points.currentDaily[0]].points,
								description: points.daily[res.data.points.currentDaily[0]].description,
								goal: points.daily[res.data.points.currentDaily[0]].goal,
								type: points.daily[res.data.points.currentDaily[0]].type,
							},
							{
								points: points.daily[res.data.points.currentDaily[1]].points,
								description: points.daily[res.data.points.currentDaily[1]].description,
								goal: points.daily[res.data.points.currentDaily[1]].goal,
								type: points.daily[res.data.points.currentDaily[1]].type,
							}
						],
						general: [
							{
								points: points.general[res.data.points.currentGeneral[0]].points,
								description: points.general[res.data.points.currentGeneral[0]].description,
								goal: points.general[res.data.points.currentGeneral[0]].goal,
								type: points.general[res.data.points.currentGeneral[0]].type,
							},
							{
								points: points.generalPlus[res.data.points.currentGeneralPlus[0]].points,
								description: points.generalPlus[res.data.points.currentGeneralPlus[0]].description,
								goal: points.generalPlus[res.data.points.currentGeneralPlus[0]].goal,
								type: points.generalPlus[res.data.points.currentGeneralPlus[0]].type,
							}
						]
					});
				})
				.catch((e) => {
					console.error(e);
				})
				
		}
	}
	changeChallanges()
	}, [])


	const challangeDone = (challange, type) =>{
		if(type == 'daily'){
			if(challange.type == 'daily'){
				const todayDate = `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`;
				const todaysSessions = user.workSessions.filter(session => session.date === todayDate);
				const currentTime = new Date();
				const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
				
				let totalMinutes = 0;
				todaysSessions.forEach(session => {
					const [startHours, startMinutes] = session.startTime.split(':').map(Number);
					const [endHours, endMinutes] = session.endTime.split(':').map(Number);
					
					const startTotalMinutes = startHours * 60 + startMinutes;
					const endTotalMinutes = endHours * 60 + endMinutes;
					
					// If session is ongoing, only count time until now
					const actualEndMinutes = endTotalMinutes > currentMinutes ? currentMinutes : endTotalMinutes;
					
					totalMinutes += actualEndMinutes - startTotalMinutes;
				});
				
				const hours = Math.floor(totalMinutes / 60);
				const minutes = totalMinutes % 60;
				return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
			} else if(challange.type == 'morning'){
				const todayDate = `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`;
				const todaysSessions = user.workSessions.filter(session => session.date === todayDate);
				const currentTime = new Date();
				const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
				
				let totalMinutes = 0;
				todaysSessions.forEach(session => {
					const [startHours, startMinutes] = session.startTime.split(':').map(Number);
					const [endHours, endMinutes] = session.endTime.split(':').map(Number);
					
					// Only count work between 5am and 11am
					const startTime = Math.max(startHours * 60 + startMinutes, 5 * 60); // Don't start before 5am
					let endTime = Math.min(endHours * 60 + endMinutes, 11 * 60); // Don't go past 11am
					
					// If session is ongoing, only count time until now
					endTime = endTime > currentMinutes ? currentMinutes : endTime;
					
					if(startTime < 11 * 60 && endTime > 5 * 60) { // Only count if session overlaps with morning hours
						totalMinutes += endTime - startTime;
					}
				});
				
				const hours = Math.floor(totalMinutes / 60);
				const minutes = totalMinutes % 60;
				return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
			} else if(challange.type == 'afternoon'){
				const todayDate = `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`;
				const todaysSessions = user.workSessions.filter(session => session.date === todayDate);
				const currentTime = new Date();
				const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
				
				let totalMinutes = 0;
				todaysSessions.forEach(session => {
					const [startHours, startMinutes] = session.startTime.split(':').map(Number);
					const [endHours, endMinutes] = session.endTime.split(':').map(Number);
					
					// Only count work between 12pm and 6pm
					const startTime = Math.max(startHours * 60 + startMinutes, 12 * 60); // Don't start before 12pm
					let endTime = Math.min(endHours * 60 + endMinutes, 18 * 60); // Don't go past 6pm
					
					// If session is ongoing, only count time until now
					endTime = endTime > currentMinutes ? currentMinutes : endTime;
					
					if(startTime < 18 * 60 && endTime > 12 * 60) { // Only count if session overlaps with afternoon hours
						totalMinutes += endTime - startTime;
					}
				});
				
				const hours = Math.floor(totalMinutes / 60);
				const minutes = totalMinutes % 60;
				return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
			} else if(challange.type == 'project'){
				const todayDate = `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`;
				const todaysSessions = user.workSessions.filter(session => session.date === todayDate);
				const currentTime = new Date();
				const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
				
				// Group sessions by workId
				const sessionsByWork = {};
				todaysSessions.forEach(session => {
					if (!sessionsByWork[session.workId]) {
						sessionsByWork[session.workId] = [];
					}
					sessionsByWork[session.workId].push(session);
				});
				
				// Calculate total minutes for each workId
				let maxMinutes = 0;
				Object.values(sessionsByWork).forEach(sessions => {
					let workMinutes = 0;
					sessions.forEach(session => {
						const [startHours, startMinutes] = session.startTime.split(':').map(Number);
						const [endHours, endMinutes] = session.endTime.split(':').map(Number);
						
						const startTotalMinutes = startHours * 60 + startMinutes;
						const endTotalMinutes = endHours * 60 + endMinutes;
						
						// If session is ongoing, only count time until now
						const actualEndMinutes = endTotalMinutes > currentMinutes ? currentMinutes : endTotalMinutes;
						
						workMinutes += actualEndMinutes - startTotalMinutes;
					});
					maxMinutes = Math.max(maxMinutes, workMinutes);
				});
				
				const hours = Math.floor(maxMinutes / 60);
				const minutes = maxMinutes % 60;
				return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
			}
		} else {
			if(challange.type == 'general'){
				const currentTime = new Date();
				const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
				const todayDate = `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`;
				
				let totalMinutes = 0;
				user.workSessions.forEach(session => {
					const [startHours, startMinutes] = session.startTime.split(':').map(Number);
					const [endHours, endMinutes] = session.endTime.split(':').map(Number);
					
					const startTotalMinutes = startHours * 60 + startMinutes;
					const endTotalMinutes = endHours * 60 + endMinutes;
					
					// Only adjust end time for ongoing sessions if they're from today
					const actualEndMinutes = (endTotalMinutes > currentMinutes && session.date === todayDate) 
						? currentMinutes 
						: endTotalMinutes;
					
					// Ensure we don't get negative minutes by taking max of 0
					const sessionMinutes = Math.max(0, actualEndMinutes - startTotalMinutes);
					totalMinutes += sessionMinutes;
				});

				const hours = Math.floor(totalMinutes / 60);
				const minutes = totalMinutes % 60;
				return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
			} else if(challange.type == 'morning'){
				const currentTime = new Date();
				const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
				const todayDate = `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`;
				
				let totalMinutes = 0;
				user.workSessions.forEach(session => {
					const [startHours, startMinutes] = session.startTime.split(':').map(Number);
					const [endHours, endMinutes] = session.endTime.split(':').map(Number);
					
					const startTotalMinutes = startHours * 60 + startMinutes;
					const endTotalMinutes = endHours * 60 + endMinutes;
					
					// Only count time between 6:00 (360 minutes) and 12:00 (720 minutes)
					if(startTotalMinutes < 720 && endTotalMinutes > 360) {
						const adjustedStart = Math.max(startTotalMinutes, 360);
						const adjustedEnd = Math.min(endTotalMinutes, 720);
						
						// For ongoing sessions from today, further limit to current time
						const actualEnd = (endTotalMinutes > currentMinutes && session.date === todayDate)
							? Math.min(currentMinutes, 720)
							: adjustedEnd;
							
						totalMinutes += actualEnd - adjustedStart;
					}
				});

				const hours = Math.floor(totalMinutes / 60);
				const minutes = totalMinutes % 60;
				return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
			}
		}
		
		
	

	}


	const collectPoints = (challange, index) => {
		console.log('colect')
		axios.put('https://b99d-109-245-203-91.ngrok-free.app/collectDaily', {
			id: user._id,
			points: challange.points,
			index
		})
		.then(res => {
			setUser(res.data);
		})
		.catch((err) => {
			console.error(err);
		})

	}


	const collectGeneralPoints = (challange) => {
		axios.put('https://b99d-109-245-203-91.ngrok-free.app/collectGeneral', {
			id: user._id,
			points: challange.points,
			type: challange.type
	})
	.then(res => {
		setUser(res.data);
		setCurrentPoints({
			daily: [
				{
					points: points.daily[res.data.points.currentDaily[0]].points,
					description: points.daily[res.data.points.currentDaily[0]].description,
					goal: points.daily[res.data.points.currentDaily[0]].goal,
					type: points.daily[res.data.points.currentDaily[0]].type,
				},
				{
					points: points.daily[res.data.points.currentDaily[1]].points,
					description: points.daily[res.data.points.currentDaily[1]].description,
					goal: points.daily[res.data.points.currentDaily[1]].goal,
					type: points.daily[res.data.points.currentDaily[1]].type,
				}
			],
			general: [
				{
					points: points.general[res.data.points.currentGeneral[0]].points,
					description: points.general[res.data.points.currentGeneral[0]].description,
					goal: points.general[res.data.points.currentGeneral[0]].goal,
					type: points.general[res.data.points.currentGeneral[0]].type,
				},
				{
					points: points.generalPlus[res.data.points.currentGeneralPlus[0]].points,
					description: points.generalPlus[res.data.points.currentGeneralPlus[0]].description,
					goal: points.generalPlus[res.data.points.currentGeneralPlus[0]].goal,
					type: points.generalPlus[res.data.points.currentGeneralPlus[0]].type,
				}
			]
		});
	})
	.catch((err) => {
		console.error(err);
	})
}




	// const points = {
	// 	daily: [
	// 		{
	// 			points: 1,
	// 			description: 'Work 8 hours today',
	// 			current: '2h 24m',
	// 			done: false,
	// 		},
	// 		{
	// 			points: 1,
	// 			description: 'Work 2 hours on morning',
	// 			current: '2h 24m',
	// 			done: true,
	// 		}
	// 	],
	// 	general: [
	// 		{
	// 			points: 5,
	// 			description: 'Work 100 hours on one project',
	// 			current: '25h',
	// 			done: false,
	// 		},
	// 		{
	// 			points: 10,
	// 			description: 'Work 300 hours',
	// 			current: '120h',
	// 			done: false,
	// 		}
	// 	]
	// }



	const [works, setWorks] = useState(user?.work || []);

	useEffect(() => {
		setWorks(user.work)
		setUser(user)
	}, [user])

	

	useEffect(() => {;
		const email = user.email;

		axios.post('https://b99d-109-245-203-91.ngrok-free.app/getUser', { email })
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


	const startSession = () => {
		if(sessionName === ''){
			setAlertPopupVisible(true);
			setAlertPopupMessage('Please enter a session name');
			setAlertPopupType('info');
		} else if(!selectedWork) {
			setAlertPopupVisible(true);
			setAlertPopupMessage('Please select a work');
			setAlertPopupType('info');
		} else if(duration.hours === 0 && duration.minutes === 0) {
			setAlertPopupVisible(true);
			setAlertPopupMessage('Please select a duration');
			setAlertPopupType('info');
		} else {
			axios.put('https://b99d-109-245-203-91.ngrok-free.app/startSession', {
				sessionName,
				selectedWork,
				duration,
				id: user._id
			})
			.then(res => {
				if(res.data === 'Time overlap'){
					setAlertPopupVisible(true);
					setAlertPopupMessage('New Session overlaps with existing session');
					setAlertPopupType('error');
				} else {
					setAlertPopupVisible(true);
					setAlertPopupMessage('Session started');
					setAlertPopupType('success');
					setUser(res.data)
					setIsStartSessionPopupVisible(false)
				}
			})
			.catch((e) => {
				console.error('Error starting session:', e);
			})
		}
	}

       

	const buttonAnim = useRef(new Animated.Value(0)).current;

	const handleSessionPress = () => {
		// Animate button down with more aggressive parameters
		Animated.spring(buttonAnim, {
			toValue: 105,  // Increased from 5 to 15 for more movement
			useNativeDriver: true,
			tension: 100,  // Increased from 50 to 100 for faster movement
			friction: 4,   // Reduced from 7 to 4 for more bounce
			velocity: 3    // Added initial velocity for more aggressive start
		}).start();

		setIsSessionPageVisible(true);
	};

	const handleSessionClose = () => {
		// Animate button back up with same aggressive parameters
		Animated.spring(buttonAnim, {
			toValue: 0,
			useNativeDriver: true,
			tension: 100,
			friction: 7,
			velocity: 2
		}).start();

		setIsSessionPageVisible(false);
	};

	const slideAnim = useRef(new Animated.Value(-300)).current;  // Start from -400 (left)
	const opacityAnim = useRef(new Animated.Value(0)).current;  // Start fully transparent

	useEffect(() => {
		if (isSessionPageVisible) {
			// Animate when popup becomes visible
			Animated.parallel([
				Animated.spring(slideAnim, {
					toValue: 0,
					useNativeDriver: true,
					tension: 30,
					friction: 7,
					velocity: 2
				}),
				Animated.timing(opacityAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true
				})
			]).start();
		} else {
			// Reset animations when popup closes
			slideAnim.setValue(-300);  // Reset to -400 to start from left again
			opacityAnim.setValue(0);
		}
	}, [isSessionPageVisible]);

	const timerSlideAnim = useRef(new Animated.Value(400)).current;  // Start from right side
	const timerOpacityAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (isSessionPageVisible) {
			// Animate when popup becomes visible
			Animated.parallel([
				Animated.spring(timerSlideAnim, {
					toValue: 0,
					useNativeDriver: true,
					tension: 30,
					friction: 7,
					velocity: 2
				}),
				Animated.timing(timerOpacityAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true
				})
			]).start();
		} else {
			// Reset animations when popup closes
			timerSlideAnim.setValue(400);  // Reset to right side
			timerOpacityAnim.setValue(0);
		}
	}, [isSessionPageVisible]);

	const toggleTaskCompletion = (index) => {
		setSessionTasks(prev => prev.map((task, i) => 
			i === index ? {...task, completed: !task.completed} : task
		));
	};

	const handleAddTask = () => {
		if (newTaskText.trim()) {
			setSessionTasks(prev => [...prev, { text: newTaskText.trim(), completed: false }]);
			setNewTaskText('');
			setIsAddTaskVisible(false);
		}
	};


	const endSession = () => {
		axios.put('https://b99d-109-245-203-91.ngrok-free.app/endSession', {
			id: user._id,
			sessionId: findCurrentSession().sessionId
		})
		.then(res => {
			setUser(res.data)
			setIsSessionPageVisible(false)
			setAlertPopupVisible(true)
			setAlertPopupMessage('Session ended')
			setAlertPopupType('success')
		})
		.catch((e) => {
			console.error('Error ending session:', e);
		})
	}

	
	return (
		<SafeAreaView className="flex-1 bg-zinc-950" edges={['top']}>
			<View className="flex-1">
				<ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
				<AlertPopup
					visible={alertPopupVisible}
					message={alertPopupMessage}
					type={alertPopupType}
					onHide={() => setAlertPopupVisible(false)}
				/>
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
													height: `${100 - user.points.current}%`,
												}}
												start={{ x: 0, y: 0 }}
												end={{ x: 0, y: 1 }}
											/>
											<View style={{
												position: 'absolute',
												top: 0,
												left: 0,
												right: 0,
												bottom: `${100 - user.points.current}%`,
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
										alignItems: 'center',
										backgroundColor: 'transparent'
									}}>
									<Text style={{
										color: 'white', 
										fontSize: 30, 
										fontWeight: 'bold',
										textShadowColor: 'rgba(0, 0, 0, 0.75)',
										textShadowOffset: {width: -1, height: 1},
										textShadowRadius: 10
									}}>
										{user.points.current}%
									</Text>
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
									<Text className="text-white text-4xl font-bold">{workToday()}</Text>
								}
							>
								<LinearGradient
									colors={['#7DD3FC', '#2563eb']}
									start={{x: 0, y: 0}}
									end={{x: 0, y: 1}}
								>
									<Text className="text-white text-4xl font-bold opacity-0">{workToday()}</Text>
								</LinearGradient>
							</MaskedView>
							<Text className="text-white text-2xl font-bold mx-1">/</Text>
							<Text className="text-white text-xl font-bold">
								{getGoalWork()}
							</Text>
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

					{/* user.workSessions.filter(session => session.date === `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`) */}
					<View className="flex flex-col">
						{user.workSessions
							.filter(session => {
								const sessionDate = session.date === `${new Date().getDate()}:${new Date().getMonth() + 1}:${new Date().getFullYear()}`;
								const [endHours, endMinutes] = session.endTime.split(':').map(Number);
								const endTimeInMinutes = endHours * 60 + endMinutes;
								const currentTime = new Date();
								const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
								return sessionDate && endTimeInMinutes < currentTimeInMinutes;
							})
							.map((task, index) => (
								<TouchableOpacity key={index} className="flex-row justify-between items-center p-4">
									<View className="flex-row justify-center items-center">
										<LinearGradient
											colors={findTaskById(task.workId).colors}
											start={{x: 0, y: 0}}
											end={{x: 0, y: 1}}
											className="w-6 h-6 rounded-full"
										>
										</LinearGradient>
										<View className="flex-col justify-center items-start pl-2">
											<Text className="text-white text-base font-semibold">{findTaskById(task.workId).name}</Text>
											<Text className="text-gray-400 text-sm font-pregular">{task.name}</Text>
										</View>
									</View>
									<Text className="text-white text-base font-psemibold">{timeFromPoints(pointsFromTime(task.endTime) - pointsFromTime(task.startTime))}</Text>
								</TouchableOpacity>
							))}

					</View>
				</ScrollView>


				
				{/* Start Session Button */}
				<View className="px-4 pb-2">
            {!findCurrentSession() ? (
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

            ) : (
              <Animated.View style={{ transform: [{ translateY: buttonAnim }] }}>
                <TouchableOpacity 
                  onPress={handleSessionPress}
                  className="w-full rounded-full overflow-hidden shadow-lg pt-2"
                >
                  <LinearGradient
                    colors={['#27272a', '#18181b']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    className="w-full rounded-full h-14 flex-row justify-between items-center px-4"
                  >
                    <View className="flex-row items-center">
                      <LinearGradient
                        colors={findTaskById(findCurrentSession().workId).colors}
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                        className="w-6 h-6 rounded-full mr-1"
                      >
                      </LinearGradient>
                      <View className="flex-col items-start">
                        <Text className="text-white text-base font-semibold">{findCurrentSession().name}</Text>
                        <Text className="text-zinc-400 text-sm font-regular">{findTaskById(findCurrentSession().workId).name}</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-white text-base font-semibold">{timeFromPoints(Math.round(pointsFromTime(findCurrentSession().endTime)-(currentTime-10)))}</Text>
                      <Image source={icons.timerWhite} className="w-4 h-4 ml-1 tint-white" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}
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
								end={{x: 1, y: 1}}
							>
							<Text className="text-white text-3xl font-bold mb-6 text-center opacity-0">Work Depth</Text>
							</LinearGradient>
						</MaskedView>

					
					<View className="mb-6">
						<View className="flex-row justify-between items-center mb-2">
							<Text className="text-sky-400 text-lg font-semibold">{user.points.current}%</Text>
						</View>
						<View className="bg-zinc-800 h-2 rounded-full">
							<LinearGradient
								colors={['#38BDF8', '#216F92']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 0}}
								className="h-2 rounded-full"
								style={{ width: `${user.points.current}%` }}
							>
								<View className="bg-sky-400 h-2 rounded-full" style={{ width: `${user.points.current}%` }} />
							</LinearGradient>
						</View>
					</View>

					<View className="mb-6">
						<Text className="text-white text-xl font-semibold mb-4">Daily Points</Text>
						{currentPoints.daily.length === 0 || currentPoints.daily.every((_,index) => user.points.dailyDone.includes(index)) ? (
							<View className="py-6 px-4 bg-zinc-800/50 rounded-2xl">
								<MaskedView
									maskElement={
										<Text className="text-xl font-semibold text-center">All Challenges Complete!</Text>
									}
								>
									<LinearGradient
										colors={['#0EA5E9', '#0369A1']}
										start={{x: 0, y: 0}}
										end={{x: 1, y: 0}}
									>
										<Text className="text-xl font-semibold text-center opacity-0">All Challenges Complete!</Text>
									</LinearGradient>
								</MaskedView>
								<Text className="text-zinc-400 text-center mt-2">Check back tomorrow for new challenges</Text>
							</View>
						) : (
							currentPoints.daily.map((point, index) => (
								!user.points.dailyDone.includes(index) && parseInt(challangeDone(point, 'daily')?.split('h')[0]) >= point.goal ? (
								<View key={index} className="mb-3 flex flex-row justify-between items-center">
								<MaskedView
									maskElement={
										<Text className="text-zinc-400 font-pmedium">{point.description} <Text className="text-zinc-200">/ {challangeDone(point, 'daily')}</Text></Text>
									}
								>
								<LinearGradient
									colors={['#0369A1', '#0EA5E9']}
									start={{x: 0, y: 0}}
									end={{x: 1, y: 0}}
								>
									<Text className="text-zinc-400 font-pmedium opacity-0">{point.description} <Text className="text-zinc-200">/ {challangeDone(point, 'daily')}</Text></Text>
								</LinearGradient>
							</MaskedView>
							<TouchableOpacity 
								className="rounded-full self-start overflow-hidden"
								onPress={() => collectPoints(point, index)}
								>
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
								) : !user.points.dailyDone.includes(index) ? (
								<View key={index} className="mb-3 flex flex-row justify-between items-center">
									<Text className="text-zinc-400">{point.description} <Text className="text-zinc-200">/ {challangeDone(point, 'daily')}</Text></Text>
								<TouchableOpacity className="bg-zinc-800 py-2 px-4 rounded-full self-start">
									<Text className="text-zinc-400">collect {point.points}%</Text>
								</TouchableOpacity>
							</View>
								) : null
							))
						)}
					</View>

					<View>
						<Text className="text-white text-xl font-semibold mb-4">General Points</Text>
						{currentPoints.general.map((point, index) => (
							parseInt(challangeDone(point, 'general')?.split('h')[0]) >= point.goal ? (
							<View key={index} className="mb-3 flex flex-row justify-between items-center">
							<MaskedView
								maskElement={
									<Text className="text-zinc-400 font-pmedium">{point.description} <Text className="text-zinc-200">/ {challangeDone(point, 'general')}</Text></Text>
								}
							>
							<LinearGradient
								colors={['#0369A1', '#0EA5E9']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 0}}
							>
								<Text className="text-zinc-400 font-pmedium opacity-0">{point.description} <Text className="text-zinc-200">/ {challangeDone(point, 'general')}</Text></Text>
							</LinearGradient>
						</MaskedView>
						<TouchableOpacity className="rounded-full self-start overflow-hidden"
							onPress={() => collectGeneralPoints(point)}
						>
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
								<Text className="text-zinc-400">{point.description} <Text className="text-zinc-200">/ {challangeDone(point, 'general')}</Text></Text>
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
							value={sessionName}
							onChangeText={setSessionName}
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
					<TouchableOpacity onPress={() => {startSession()}}>
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
			<BottomPopup
				visible={isSessionPageVisible}
				onClose={handleSessionClose}
				height={0.9}
			>
				<View className="flex-1">
					{findCurrentSession() && (
						<>
							<View className="bg-zinc-900 rounded-t-3xl p-2">
								<Animated.View
									style={{
										transform: [{ translateX: slideAnim }],
										opacity: opacityAnim
									}}
									className="flex-row items-center justify-center"
								>								
								<MaskedView
								maskElement={
									<View className="flex-col justify-center items-center">
										<Text className="text-white text-2xl font-semibold text-center">
											{findCurrentSession().name}
										</Text>
										<Text className="text-zinc-200 text-lg font-regular text-center">
											{findTaskById(findCurrentSession().workId).name}
										</Text>
									</View>
								}
							>
								<LinearGradient
									colors={['#D4D4D8', findTaskById(findCurrentSession().workId).colors[0]]}
									start={{x: 0, y: 0}}
									end={{x: 0, y: 1}}
								>
									<View className="flex-col items-center justify-center opacity-0">
										<Text className="text-white text-2xl font-semibold text-center">
											{findCurrentSession().name}
										</Text>
										<Text className="text-zinc-200 text-lg font-regular text-center">
											{findTaskById(findCurrentSession().workId).name}
										</Text>
									</View>
								</LinearGradient>
							</MaskedView>
								</Animated.View>
							</View>
						
							<Animated.View 
								style={{
									transform: [{ translateX: timerSlideAnim }],
									opacity: timerOpacityAnim
								}} 
								className="justify-start items-center mt-12"
							>
								<MaskedView
									maskElement={
										<Text className="text-white text-6xl font-semibold">
											{formatTime(timeInSeconds)}
										</Text>
									}
								>
									<LinearGradient
										colors={['#52525b', findTaskById(findCurrentSession().workId).colors[0]]}
										start={{x: 0, y: 0}}
										end={{x: 2, y: 2}}
									>
										<Text className="text-white text-6xl font-semibold opacity-0">
											{formatTime(timeInSeconds)}
										</Text>
									</LinearGradient>
								</MaskedView>
							</Animated.View>

							{/* New Task List Section */}
							<View className="flex-1 px-4 mt-12">
								<View className="flex-row justify-between items-center mb-4">
									<Text className="text-zinc-400 text-lg font-semibold">Session Tasks</Text>
									<TouchableOpacity 
										onPress={() => setIsAddTaskVisible(true)}
										className="bg-zinc-800 p-2 rounded-full"
									>
										<Image source={icons.plus} className="w-5 h-5 tint-white" />
									</TouchableOpacity>
								</View>

								<ScrollView className="flex-1">
									{sessionTasks.map((task, index) => (
										<TouchableOpacity 
											key={index}
											onPress={() => toggleTaskCompletion(index)}
											className="flex-row items-center bg-zinc-800/50 p-4 rounded-xl mb-2"
										>
											<View className={`w-5 h-5 rounded-full border-2 mr-3 
												${task.completed ? 'bg-sky-500 border-sky-500' : 'border-zinc-600'}`}
											>
												{task.completed && (
													<Image 
														source={icons.check} 
														className="w-3 h-3 tint-white m-auto" 
													/>
												)}
											</View>
											<Text className={`text-base ${task.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>
												{task.text}
											</Text>
										</TouchableOpacity>
									))}
								</ScrollView>
							</View>
						</>
					)}

					<TouchableOpacity onPress={endSession} className="mt-4 mb-4 mx-4">
						<LinearGradient
							colors={['#3f3f46', '#27272a']}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 1}}
							className="w-full rounded-full h-14 flex-row justify-center items-center"
						>
							<Text className="text-zinc-300 text-lg font-semibold">End Session</Text>
						</LinearGradient>
					</TouchableOpacity>

				</View>
			</BottomPopup>

			{/* Add Task Popup */}
			<BottomPopup
				visible={isAddTaskVisible}
				onClose={() => setIsAddTaskVisible(false)}
				height={0.4}
			>
				<View className="p-4">
					<Text className="text-white text-xl font-bold mb-4">Add Task</Text>
					<TextInput
						className="bg-zinc-800 text-white p-4 rounded-xl mb-4"
						placeholder="Enter task..."
						placeholderTextColor="#71717A"
						value={newTaskText}
						onChangeText={setNewTaskText}
					/>
					<TouchableOpacity 
						onPress={handleAddTask}
						className="w-full rounded-full overflow-hidden"
					>
						<LinearGradient
							colors={['#0ea5e9', '#60a5fa']}
							start={{x: 0, y: 0}}
							end={{x: 1, y: 1}}
							className="w-full h-14 flex-row justify-center items-center"
						>
							<Text className="text-white text-lg font-semibold">Add Task</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
			</BottomPopup>
		</SafeAreaView>
	);
};

export default Home;
