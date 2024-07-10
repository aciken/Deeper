import { View, Text,ScrollView,TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import TouchableText from './TouchableText';

const SelectTime = () => {
    const [selectedHour, setSelectedHour] = useState(12);
    const [selectedMinute, setSelectedMinute] = useState(12);
    const [selectedPart, setSelectedPart] = useState("AM");
  return (
<View className="relative h-full w-full">
  <View className="absolute w-[80%] h-[60%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 drop-shadow-xl flex items-center justify-center">
    <Text>asd</Text>
  </View>
<View className="flex-row justify-center items-center space-x-3 pt-10 backdrop-blur">
        <TouchableText 
          Title={selectedHour}
          handlePress={() => {}}
          TextStyle="text-5xl font-bold text-gray-200"
          ContainerStyle={"rounded-xl"}

        />
        <Text className="text-5xl font-bold text-gray-200 mr-2">:</Text>
        <TouchableText
          Title={selectedMinute}
          handlePress={() => {}}
          TextStyle="text-5xl font-bold text-gray-200"
          ContainerStyle={"rounded-xl"}
        />
        <TouchableText
          Title={selectedPart}
          handlePress={() => {if(selectedPart === "AM"){setSelectedPart("PM")}else{setSelectedPart("AM")} }}
          TextStyle="text-5xl font-bold text-gray-200"
          ContainerStyle={"rounded-xl ml-2"}
        />
</View>
        {/* <Text className="text-5xl font-bold text-gray-200">{selectedHour}</Text>
        <Text className="text-5xl font-bold text-gray-200">{selectedMinute}</Text>
        <Text className="text-5xl font-bold text-gray-200">{selectedPart}</Text> */}
    </View>
  )
}

export default SelectTime