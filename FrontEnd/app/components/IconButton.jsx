import { View, Text,TouchableOpacity,Image } from 'react-native'
import React from 'react'

const IconButton = ({containerStyles, handlePress, isLoading, ImageSource}) => {
  return (
    <TouchableOpacity
    className={`flex-row rounded-xl min-h-[62px] justify-center items-center ${containerStyles}`}
    onPress={handlePress}
    activeOpacity={0.7}
    disabled={isLoading}
    >
        <Image
          source={ImageSource}
          className="w-6 h-6" 
          resizeMode='contain'
        />
    </TouchableOpacity>
  )
}

export default IconButton