import React from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { icons } from '../../constants';

const TabsLayout = () => {
  const insets = useSafeAreaInsets();

  const TabIcon = ({ icon, color, name, focused }) => {
    const slideAnim = React.useRef(new Animated.Value(0)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      if (focused) {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -5,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [focused]);

    return (
      <View className="items-center justify-center py-2 px-2">
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }} className="items-center">
          <Image 
            source={icon}
            resizeMode='contain'
            tintColor={color}
            className="w-6 h-6"
          />
          <Text className={`${focused ? 'font-semibold text-white' : 'font-regular text-gray-500'} text-[10px] mt-1 text-center`}>
            {name}
          </Text>
        </Animated.View>
        <Animated.View 
          style={{
            opacity: fadeAnim,
            position: 'absolute',
            bottom: -4,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#ffffff',
            shadowColor: '#ffffff',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 5,
          }}
        />
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#1f2937', // gray-500
        tabBarStyle: {
          backgroundColor: '#030712', // gray-900
          borderTopColor: '#1f2937', // gray-800
          borderTopWidth: 1,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen name="Home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
            <TabIcon icon={icons.home} color={color} focused={focused} name='Home'/>
          )
        }}
      />
      <Tabs.Screen name="Tasks"
        options={{
          title: 'Tasks',
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
            <TabIcon icon={icons.plus} color={color} focused={focused} name='Tasks'/>
          )
        }}
      />
      {/* <Tabs.Screen name="Schedule"
        options={{
          title: 'Schedule',
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
            <TabIcon icon={icons.bookmark} color={color} focused={focused} name='Schedule'/>
          )
        }}
      /> */}
      <Tabs.Screen name="Profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
            <TabIcon icon={icons.profile} color={color} focused={focused} name='Profile'/>
          )
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;