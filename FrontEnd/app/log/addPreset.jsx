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

const AddPreset = () => {
	const { user, setUser, setSelected } = useGlobalContext();
	const { preset: presetString } = useLocalSearchParams();
	const preset = JSON.parse(presetString);
	const [newPreset, setNewPreset] = useState(JSON.parse(presetString));
	const router = useRouter();


    const todayDateNumber = new Date().getDate();
    const [clickedDates, setClickedDates] = useState([]);

    const handleDateClick = (date) => {
        setClickedDates(prevDates => {
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

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [sessionName, setSessionName] = useState(null);
    const [selectedWork, setSelectedWork] = useState(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);


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
	}, [newPreset])



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

		setNewPreset(prev => {
			const updatedSessions = [...prev.sessions];
			updatedSessions[index] = data;
			return {...prev, sessions: updatedSessions};
		});
	} else {
		setAlertPopupVisible(true);
		setAlertPopupMessage('Sessions are overlapping');
		setAlertPopupType('error');
	}
		setIsEditVisible(false);


		console.log(data)


    }






const saveEdit = () => {
	const presetIndex = user.preset.findIndex(pre=> pre.name == newPreset.name)
	axios.put('https://bf9f-188-2-139-122.ngrok-free.app/editPreset', {
		preset: newPreset,
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
	if(clickedDates.length == 0){
		setAlertPopupVisible(true);
		setAlertPopupMessage('You need to select at least one date');
		setAlertPopupType('info')
	} else {
	axios.put('https://bf9f-188-2-139-122.ngrok-free.app/addToSchedule', {	
		preset: newPreset,
		id: user._id,
		clickedDates,
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
						onPress={() => {addToSchedule()}}
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
								<Text className="text-white text-lg font-medium ml-2">Add to Schedule</Text>
							}
						>
							<LinearGradient
								colors={['#16a34a', '#4ade80']}
								start={{x: 0, y: 0}}
								end={{x: 1, y: 1}}
							>
								<Text className="text-white text-lg font-medium ml-2 opacity-0">Add to Schedule</Text>
							</LinearGradient>
						</MaskedView>
					</TouchableOpacity>


				</View>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className=""
				>
					{user.array && user.array.map((_, index) =>{
						if (index + 1 > todayDateNumber - 1 && index < todayDateNumber + 6){
							const currentDate = index + 1;
							return(
								<TouchableOpacity
									key={currentDate}
									onPress={() => handleDateClick(currentDate)}
									className={`w-12 h-16 justify-center items-center rounded-xl mr-2`}
									>
										{clickedDates.includes(currentDate) ?
										<LinearGradient
											colors={['#0EA5E9', '#60A5FA']}
											start={{x: 0, y: 0}}
											end={{x: 0, y: 1}}
											className="w-full h-full rounded-xl justify-center items-center"
										>
											<Text className="text-white text-xs mb-1">{getDayName(currentDate)}</Text>
											<Text className="text-white text-lg font-bold">{currentDate}</Text>
										</LinearGradient>
										:
										<LinearGradient
											colors={['#18181B', '#27272A']}
											start={{x: 0, y: 0}}
											end={{x: 0, y: 1}}
											className="w-full h-full rounded-xl justify-center items-center"
										>
											<Text className="text-zinc-400 text-xs mb-1">{getDayName(currentDate)}</Text>
											<Text className="text-zinc-400 text-lg font-bold">{currentDate}</Text>
										</LinearGradient>
										}
									</TouchableOpacity>
									
							)
						}
					})}

				</ScrollView>

				<View className="h-[70%]"> 
                    <PresetsTable 
                    preset={newPreset} 
                    changeEditVisible={() => setIsEditVisible(true)} 
                    changeEditData={changeEditData} 
                    setIndex={setIndex} 
                    work={user.work}
                    />
				</View>

				<View className="flex-row justify-center items-center mt-4">
				</View>

				<View className="flex-row justify-center pb-4 ">
						<DownButton buttonText="Add Task" icon={icons.plusGray} onPress={() => {}} backgorundColor={'bg-zinc-900'} textColor={['#d4d4d8', '#52525b']} />
						<DownButton buttonText="Save Changes" icon={icons.save} onPress={() => {if(saveTrue)saveEdit()}} backgorundColor={saveTrue ?'bg-sky-500' : 'bg-zinc-900'} textColor={saveTrue ? ['#e0f2fe', '#bfdbfe'] : ['#d4d4d8', '#52525b']} />
							{preset.name == 'Morning Work' || preset.name == 'Evening Work' || preset.name == 'Noon Work' ? 
							<DownButton buttonText="Restart" icon={icons.restart} onPress={() => {}} backgorundColor={'bg-red-500'} textColor={['#fee2e2', '#fecdd3']} />
							: 
							<DownButton buttonText="Delete" icon={icons.trash} onPress={() => {}} backgorundColor={'bg-red-500'} textColor={['#fecaca', '#ffffff']} />
							}

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
			</View>    
		</SafeAreaView>
    )
}

export default AddPreset;
