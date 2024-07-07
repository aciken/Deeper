import { View, Text,TouchableOpacity,Image } from 'react-native'
import React from 'react'

const ClickableIcon = ({containerStyles, handlePress, ImageSource, imageStyle}) => {
  return (
    <TouchableOpacity
    className={`absolute ${containerStyles}`}
    onPress={handlePress}
    >
        <Image 
            source={ImageSource}
            className={`${imageStyle}`}
            resizeMode='contain'
        />

    </TouchableOpacity>
  )
}

export default ClickableIcon