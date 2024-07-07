import { View, Text,TouchableOpacity,Image } from 'react-native'
import React from 'react'

const ImageButton = ({title, containerStyles, handlePress, isLoading, textStyles, ImageSource}) => {
  return (
    <TouchableOpacity
    className={`bg-white rounded-xl min-h-[62px] justify-center items-center ${containerStyles}`}
    onPress={handlePress}
    activeOpacity={0.7}
    disabled={isLoading}
    >
      <View className="flex-row ">
        <Image
          source={ImageSource}
          className="w-6 h-6 mr-2" 
          resizeMode='contain'
        />
        <Text className={`text-blue-900 font-psemibold text-lg text-center ${textStyles}`}>
          {title}
        </Text>
      </View>

    </TouchableOpacity>
  )
}

export default ImageButton