import { StyleSheet, Text, View, Image, Animated, Platform } from 'react-native';
import { Slot, SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import GlobalProvider from './context/GlobalProvider';

const RootLayout = () => {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require('../assets/fonts/Poppins-Black.ttf'),
    "Poppins-Bold": require('../assets/fonts/Poppins-Bold.ttf'),
    "Poppins-ExtraBold": require('../assets/fonts/Poppins-ExtraBold.ttf'),
    "Poppins-Medium": require('../assets/fonts/Poppins-Medium.ttf'),
    "Poppins-Regular": require('../assets/fonts/Poppins-Regular.ttf'),
    "Poppins-SemiBold": require('../assets/fonts/Poppins-SemiBold.ttf'),
    "Poppins-Thin": require('../assets/fonts/Poppins-Thin.ttf'),
    "Poppins-ExtraLight": require('../assets/fonts/Poppins-ExtraLight.ttf'),
    "Poppins-Light": require('../assets/fonts/Poppins-Light.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      // Start opening animation
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 20,
            friction: 7,
            useNativeDriver: true,
          })
        ]),
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1.1,
            tension: 20,
            friction: 7,
            useNativeDriver: true,
          })
        ])
      ]).start(() => {
        setSplashAnimationFinished(true);
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !splashAnimationFinished) {
    return (
      <View className="h-full w-full bg-zinc-950 flex-row justify-center items-center">
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }}
        >
          <Image
            className="w-96 h-56"
            source={require('../assets/images/deeperLogo.png')}
            resizeMode='contain'
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <GlobalProvider>
    <Stack
           screenOptions={{
           contentStyle: { backgroundColor: '#09090b' },
           animation: 'none',
           animationDuration: 0,
           animationEnabled: false,
           }}>

      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='(onboarding)' options={{ headerShown: false }} />
      {/* <Stack.Screen name='(log)' options={{headerShown: false}}/> */}
      <Stack.Screen name='log/setTask' options={{ headerShown: false }} />
      <Stack.Screen name='log/SomeComponent' options={{ headerShown: false }} />
      <Stack.Screen name='log/editTask' options={{ headerShown: false }} />
      <Stack.Screen name='log/timer' options={{ headerShown: false }} />
      <Stack.Screen name='log/taskList' options={{ headerShown: false }} />
      <Stack.Screen name='log/SchedulePage' options={{ headerShown: false }} /> 
      <Stack.Screen name='log/addPreset' options={{ headerShown: false }} />
      <Stack.Screen name='log/createPreset' options={{ headerShown: false }} />
    </Stack>
  </GlobalProvider>
  );
};

export default RootLayout;