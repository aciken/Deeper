import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';

const TabsLayout = () => {
  const insets = useSafeAreaInsets();

  const TabIcon = ({ icon, color, name }) => {
    return (
      <View className="items-center justify-center py-2 px-2">
        <Image 
          source={icon}
          resizeMode='contain'
          tintColor={color}
          className="w-6 h-6"
        />
        <Text className={`text-[10px] mt-1 text-center ${color === '#ffffff' ? 'text-white' : 'text-gray-500'}`}>
          {name}
        </Text>
      </View>
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#1f2937',
          tabBarStyle: {
            backgroundColor: '#09090b',
            borderTopColor: '#27272a',
            borderTopWidth: 1,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 4,
          },
        }}
      >
        <Tabs.Screen name="Home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({color}) => (
              <TabIcon icon={icons.home} color={color} name='Home'/>
            )
          }}
        />
        <Tabs.Screen name="Tasks"
          options={{
            title: 'Tasks',
            headerShown: false,
            tabBarIcon: ({color}) => (
              <TabIcon icon={icons.plus} color={color} name='Tasks'/>
            )
          }}
        />
        <Tabs.Screen name="Profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({color}) => (
              <TabIcon icon={icons.profile} color={color} name='Profile'/>
            )
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
