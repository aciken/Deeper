import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'

const TouchableText = ({TextStyle,Title,handlePress,ContainerStyle}) => {

  return (
    <TouchableOpacity 
        className={`${ContainerStyle}`}
        onPress = {handlePress}
        activeOpacity={0.4}
    >
      <Text className={`${TextStyle}`}>{Title}</Text>
    </TouchableOpacity>
  )
}

export default TouchableText