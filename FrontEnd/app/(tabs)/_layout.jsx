import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { icons } from '../../constants';

const TabsLayout = () => {
  const insets = useSafeAreaInsets();

  const TabIcon = ({ icon, color, name }) => {
    return (
      <View style={styles.tabIconContainer}>
        <Image 
          source={icon}
          resizeMode='contain'
          tintColor={color}
          style={styles.tabIcon}
        />
        <Text 
          style={[
            styles.tabLabel,
            { color: color === '#ffffff' ? '#ffffff' : '#6b7280' }
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#09090b' }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#1f2937',
          tabBarStyle: {
            backgroundColor: '#09090b',
            borderTopColor: '#27272a',
            borderTopWidth: 1,
            height: 50 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 2,
          },
          headerShown: false,
          contentStyle: {
            backgroundColor: '#09090b'
          }
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
      </Tabs>
    </View>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 60,
  },
  tabIcon: {
    width: 20,
    height: 20,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
});

export default TabsLayout;
