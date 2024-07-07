import { View, Text,TextInput,TouchableOpacity,Image } from 'react-native'
import React,{useState} from 'react'

import {icons} from '../../constants'

const FormField = ({containerStyles,title, placeholder, value,handleTextChange}) => {

    const [showPassword, setShowPassword] = useState(false)

  return (
    <View className={`space-y-2 ${containerStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">
        {title}
      </Text>

      <View className="w-full h-16 px-4 border-2 border-gray-800 bg-gray-700 rounded-2xl focus:border-blue-400 items-center flex-row">
        <TextInput
            className="flex-1 text-white font-psemibold text-base"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#64748b"
            onChangeText={handleTextChange}
            secureTextEntry={title === 'Password' && !showPassword}
            />
            {title === 'Password' && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}> 
                    <Image 
                    source={!showPassword ? icons.eye : icons.eyeHide}
                    className="w-6 h-6"
                    resizeMode='contain'
                     />
                </TouchableOpacity>
            )}

      </View>
    </View>
  )
}

export default FormField