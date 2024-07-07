import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'

const Button = ({title, containerStyles, handlePress, isLoading, textStyles}) => {
  return (
    <TouchableOpacity
    className={`bg-blue-500 rounded-xl min-h-[62px] justify-center items-center ${containerStyles}`}
    onPress={handlePress}
    activeOpacity={0.7}
    disabled={isLoading}
    >
        <Text className={`text-white font-psemibold text-lg ${textStyles}`}>
            {title}
        </Text>

    </TouchableOpacity>
  )
}

export default Button