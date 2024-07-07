import { View, Text, Image } from 'react-native'
import {Tabs , Redirect} from 'expo-router'
import React from 'react'

import {icons} from '../../constants';

const TabsLayout = () => {

  const TabIcon = ({icon, color, name, focused}) => {
    return (
      <View className={"items-center justify-center gap-2"}>
        <Image 
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className="w-6 h-6"
         />
         <Text className={`${focused ? 'font-psemibold text-blue-500' : 'font-pregular text-gray-400'} text-xs`}>
            {name}
         </Text>
      </View>
    )
  }

  return (
    <>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#3b82f6',
            tabBarInactiveTintColor: '#9ca3af',
            tabBarStyle:{
              backgroundColor: '#1f2937',
              borderTopColor: '#374151',
              borderTopWidth: 1,
              height: 60
            }
          }}
        >
            <Tabs.Screen name="home"
            options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({color, focused}) => (
                <TabIcon icon={icons.home} color={color} focused={focused} name='Home'/>
              )
            }}
            />
            <Tabs.Screen name="achievements"
            options={{
              title: 'Achievements',
              headerShown: false,
              tabBarIcon: ({color, focused}) => (
                <TabIcon icon={icons.bookmark} color={color} focused={focused} name='Achievements'/>
              )
            }}
            />
            <Tabs.Screen name="tasks"
            options={{
              title: 'Tasks',
              headerShown: false,
              tabBarIcon: ({color, focused}) => (
                <TabIcon icon={icons.plus} color={color} focused={focused} name='Tasks'/>
              )
            }}
            />
            <Tabs.Screen name="profile"
            options={{
              title: 'Profile',
              headerShown: false,
              tabBarIcon: ({color, focused}) => (
                <TabIcon icon={icons.profile} color={color} focused={focused} name='Profile'/>
              )
            }}
            />
        </Tabs>
    </>

  )
}

export default TabsLayout