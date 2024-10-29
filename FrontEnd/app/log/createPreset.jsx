import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { icons } from '../../constants';
import MaskedView from '@react-native-masked-view/masked-view';
import { useGlobalContext } from '../context/GlobalProvider';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import PresetsTable from '../components/PresetsTable';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomPopup from '../components/BottomPopup';
import axios from 'axios';
import AlertPopup from '../components/AlertPopup';







const DownButton = ({buttonText, icon, onPress, backgorundColor, textColor}) => {
	return(
		<TouchableOpacity onPress={onPress}  className={`w-28 h-16 rounded-2xl shadow-lg justify-center items-center m-1 ${backgorundColor} border border-zinc-700`}>
			<View className="items-center">
			<MaskedView
				maskElement={
					<Image source={icon} className="w-6 h-6 tint-white mb-1" />
				}
				>
				<LinearGradient
					colors={textColor}
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
					colors={textColor}
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

const CreatePreset = () => {
	const { user, setUser, setSelected } = useGlobalContext();
	const [newPreset, setNewPreset] = useState({
        name: '',
        sessions: [],
    }
	);
	const [editedPreset, setEditedPreset] = useState({
		name: '',
		sessions: [],
	});
	const router = useRouter();


    const todayDateNumber = new Date().getDate();
    const [selectedDates, setSelectedDates] = useState([]);

    const handleDateClick = (date) => {
        setSelectedDates(prevDates => {
            if (prevDates.includes(date)) {
                return prevDates.filter(d => d !== date);
            } else {
                return [...prevDates, date];
            }
        });
    }

    const getDayName = (date) => {
        const day = new Date(date, 0, 1).getDay();
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
    }

    const [isEditVisible, setIsEditVisible] = useState(false);
    const [editData, setEditData] = useState(null);
    const [index, setIndex] = useState(null);
	const [isPopupVisible, setIsPopupVisible] = useState(false);

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [sessionName, setSessionName] = useState(null);
    const [selectedWork, setSelectedWork] = useState(user.work[0]);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [presetName, setPresetName] = useState('');


	const [alertPopupVisible, setAlertPopupVisible] = useState(false);
	const [alertPopupMessage, setAlertPopupMessage] = useState('');
	const [alertPopupType, setAlertPopupType] = useState('info');

	const [saveTrue, setSaveTrue] = useState(false);

	useEffect(() => {
		for(let i = 0; i < newPreset.sessions.length; i++){
			if(newPreset.sessions[i][4] !== preset.sessions[i][4] || newPreset.sessions[i][5] !== preset.sessions[i][5] || newPreset.sessions[i][2] !== preset.sessions[i][2]){
				setSaveTrue(true);
			}
		}
		if(editedPreset.sessions.length > 0){
			setSaveTrue(true);
		}
	}, [newPreset, editedPreset])



    const formatTime = (time) => {
		if (time instanceof Date) {
			return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		}
		return ''; // Return an empty string or some default value if time is not a Date
	};

    const changeEditData = (start, end, name, work) => {
		setStartTime(start)
		setEndTime(end)
		setSessionName(name)
		setSelectedWork(work)
	}

    const handleTimeChange = (event, selectedTime, isStart) => {
        if (isStart) {
            setStartTime(selectedTime);
        } else {
            setEndTime(selectedTime);
        }
    }

    const [showWorkPicker, setShowWorkPicker] = useState(false);

	const findTaskById = (id) => {
		const task = user.work.find(work => work._id === id)
		console.log('id', id)
		console.log('user.work', user.work)
		console.log('task', task)
		return task
	}



	const editFunc = (start, end, name, work) => {

        // const data  = [start,end, name, work._id]

        // axios.put('https://2727-188-2-139-122.ngrok-free.app/editPreset', {
        //     data,
        //     id: user._id,
        //     index,
        //     clicked,
        // }).then(res => {
        //     if(res.data === 'Time overlap'){
        //         alert('Works are overlapping')
        //     } else {
        //         setUser(res.data);
        //         setIsEditVisible(!isEditVisible)
        //     }
        // }).catch((e) => {
        //     console.error(e);
        // })
		const startHour = parseInt(start.split(':')[0]);
		const startMinute = parseInt(start.split(':')[1]);
		const endHour = parseInt(end.split(':')[0]);
		const endMinute = parseInt(end.split(':')[1]);

		const startPoints = startHour * 20 + startMinute / 3;
		const endPoints = endHour * 20 + endMinute / 3;

		const data = [start, end, name, work._id, startPoints, endPoints];


		


		let counter = 0;

		for(let i = 0; i < newPreset.sessions.length; i++){
			console.log(startPoints, endPoints)
			console.log(newPreset.sessions[i])
			if(i == index){
				counter++;       
			}
			if((startPoints > newPreset.sessions[i][4] && startPoints >= newPreset.sessions[i][5]) || (endPoints <= newPreset.sessions[i][4] && endPoints < newPreset.sessions[i][5])){

				counter++;
			}
		}
		console.log(counter, newPreset.sessions.length)
		if(counter == newPreset.sessions.length || counter > newPreset.sessions.length){

		setEditedPreset(prev => {
			if (prev.sessions.length === 0 && prev.name === '') {
				// If editedPreset is empty, copy everything from newPreset
				const updatedSessions = [...newPreset.sessions];
				updatedSessions[index] = data;
				return {...newPreset, sessions: updatedSessions};
			} else {
				// If editedPreset has data, just update the specific index
				const updatedSessions = [...prev.sessions];
				updatedSessions[index] = data;
				return {...prev, sessions: updatedSessions};
			}
		});
	} else {
		setAlertPopupVisible(true);
		setAlertPopupMessage('Sessions are overlapping');
		setAlertPopupType('error');
	}
		setIsEditVisible(false);


		console.log(data)


    }


	const addSession = (start, end, name, work) => {

		const startHour = parseInt(start.split(':')[0]);
		const startMinute = parseInt(start.split(':')[1]);
		const endHour = parseInt(end.split(':')[0]);
		const endMinute = parseInt(end.split(':')[1]);

		const startPoints = startHour * 20 + startMinute / 3;
		const endPoints = endHour * 20 + endMinute / 3;

		const data = [start, end, name, work._id, startPoints, endPoints];


		let counter = 0;

		for(let i = 0; i < newPreset.sessions.length; i++){
			if((startPoints > newPreset.sessions[i][4] && startPoints >= newPreset.sessions[i][5]) || (endPoints <= newPreset.sessions[i][4] && endPoints < newPreset.sessions[i][5])){

				counter++;
			}
		}
		console.log(counter, newPreset.sessions.length)
		if(counter == newPreset.sessions.length || counter > newPreset.sessions.length){

			setEditedPreset(prev => {
				if (prev.sessions.length === 0 && prev.name === '') {
					// If editedPreset is empty, copy everything from newPreset and add data
					return {name: newPreset.name, sessions: [...newPreset.sessions, data]};
				} else {
					// If editedPreset has data, just add new data to existing sessions
					return {...prev, sessions: [...prev.sessions, data]};
				}
			});
			console.log(editedPreset)

	} else {
		setAlertPopupVisible(true);
		setAlertPopupMessage('Sessions are overlapping');
		setAlertPopupType('error');
	}
		setIsPopupVisible(false);



	}



const saveEdit = () => {
	const presetIndex = user.preset.findIndex(pre=> pre.name == newPreset.name)
	axios.put('https://080d-188-2-139-122.ngrok-free.app/editPreset', {
		preset: editedPreset.sessions.length > 0 ? editedPreset : newPreset,
		id: user._id,
		presetIndex,
	}).then(res => {
		setUser(res.data);
		setSaveTrue(false);
	})
	.catch((e) => {
		console.error(e);
	})
}

const addToSchedule = () => {
	if(selectedDates.length == 0){
		setAlertPopupVisible(true);
		setAlertPopupMessage('You need to select at least one date');
		setAlertPopupType('info')
	} else {
	axios.put('https://080d-188-2-139-122.ngrok-free.app/addToSchedule', {	
		preset: editedPreset.sessions.length > 0 ? editedPreset : newPreset,
		id: user._id,
		clickedDates: selectedDates,
	})
	.then(res => {
		setUser(res.data);
		router.back();
	})
	.catch((e) => {
		console.error(e);
	})
}
}

const deleteFunc = () => {
	console.log(index)

		if(editedPreset.sessions.length > 0){
			setEditedPreset(prev => ({
				...prev,
				sessions: prev.sessions.filter((_, i) => i !== index)
			}));
		} else {
			setEditedPreset({
				...newPreset,
				sessions: newPreset.sessions.filter((_, i) => i !== index)
			});
        }
        setIsEditVisible(false);
    }



const createPreset = () => {
	if(editedPreset.name == ''){
		setAlertPopupVisible(true);
		setAlertPopupMessage('Preset name is required');
		setAlertPopupType('info')
	} else if(editedPreset.sessions.length == 0){
		setAlertPopupVisible(true);
		setAlertPopupMessage('You need to add at least one session');
		setAlertPopupType('info')
	} else { 
		
    axios.put('https://080d-188-2-139-122.ngrok-free.app/createNewPreset', {
        preset: editedPreset,
        id: user._id,
    }).then(res => {
        setUser(res.data);
        router.back();
    })
    .catch((e) => {
        console.error(e);
		})
	}
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
						onPress={() => router.back()}
						className="flex-row items-center"
					>
						<MaskedView
							maskElement={
								<Image 
									source={icons.cancel} 
									className="w-6 h-6 tint-white ml-1"
								/>
							}
						>
							<LinearGradient
								colors={['#f87171', '#ef4444']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 1}}
							>
								<Image source={icons.cancel} className="w-6 h-6 tint-white ml-1 opacity-0" />
							</LinearGradient>
						</MaskedView>

						<MaskedView
							maskElement={
								<Text className="text-white text-lg font-medium ml-2">Cancel</Text>
							}
						>
							<LinearGradient
								colors={['#f87171', '#ef4444']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 1}}
							>
								<Text className="text-white text-lg font-medium ml-2 opacity-0">Cancel</Text>
							</LinearGradient>
						</MaskedView>
					</TouchableOpacity>

                    <TouchableOpacity 
						onPress={() => {createPreset()}}
						className="flex-row items-center"
					>
						<MaskedView
							maskElement={
								<Image 
									source={icons.check} 
									className="w-6 h-6 tint-white ml-1"
								/>
							}
						>
							<LinearGradient
								colors={['#16a34a', '#4ade80']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 1}}
							>
								<Image source={icons.cancel} className="w-6 h-6 tint-white ml-1 opacity-0" />
							</LinearGradient>
						</MaskedView>

						<MaskedView
							maskElement={
								<Text className="text-white text-lg font-medium ml-2">Create Preset</Text>
							}
						>
							<LinearGradient
								colors={['#16a34a', '#4ade80']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 1}}
							>
								<Text className="text-white text-lg font-medium ml-2 opacity-0">Create Preset</Text>
							</LinearGradient>
						</MaskedView>
					</TouchableOpacity>


				</View>

                <TextInput
                    placeholder="Enter preset name"
                    placeholderTextColor="#52525b"
                    className="bg-zinc-800 text-base text-white py-3 px-4 rounded-xl mb-4"
                    onChangeText={(text) => setEditedPreset({...editedPreset, name: text})}
                    value={editedPreset.name}
                />



				<View className="h-[70%]"> 
                    <PresetsTable 
                    preset={editedPreset} 
                    changeEditVisible={() => setIsEditVisible(true)} 
                    changeEditData={changeEditData} 
                    setIndex={setIndex} 
                    work={user.work}
                    />
				</View>

				<View className="flex-row justify-center items-center mt-4">
				</View>

				<View className="flex-row justify-center pb-4 ">
						<DownButton buttonText="Add Task" icon={icons.plusGray} onPress={() => {setIsPopupVisible(true)}} backgorundColor={'bg-zinc-900'} textColor={['#d4d4d8', '#52525b']} />
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
											colors={selectedWork.colors}
											start={{x: 0, y: 0}}
											end={{x: 1, y: 1}}
											className="w-4 h-4 rounded-full mr-2"
										/>
									) : (
										<Image source={icons.workGray} className="w-4 h-4 mr-2 tint-gray-400" />
									)}
									<Text className={`text-base ${selectedWork ? 'text-white' : 'text-zinc-400'}`}>
										{selectedWork ? selectedWork.name : "Select a work"}
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
								onPress={() => editFunc(formatTime(startTime), formatTime(endTime), sessionName, selectedWork)}
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
					height={0.6}
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
										{selectedWork[0] !== '' ? (
											<LinearGradient
												colors={selectedWork.colors}
												start={{x: 0, y: 0}}
												end={{x: 1, y: 1}}
												className="w-4 h-4 rounded-full mr-2"
											>
											</LinearGradient>
										) : (
											<Image source={icons.workGray} className="w-4 h-4 mr-2 tint-gray-400" />
										)}
										<Text className={`text-base ${selectedWork.colors[0] ? 'text-white' : 'text-zinc-400'}`}>{selectedWork.name || "Select a work"}</Text>
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
					<TouchableOpacity 
          onPress={() => {addSession(formatTime(startTime), formatTime(endTime), sessionName, selectedWork)}}
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
			</View>    
		</SafeAreaView>
    )
}

export default CreatePreset;
