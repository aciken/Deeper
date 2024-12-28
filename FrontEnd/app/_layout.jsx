import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import { Slot, SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import GlobalProvider from './context/GlobalProvider';

const RootLayout = () => {
  const [showApp, setShowApp] = useState(false);
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
      setTimeout(() => {
        setShowApp(true);
      }, 3000);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !showApp) {
    return (
      <View className="h-full w-full bg-zinc-950 flex-row justify-center items-center">
        <Image
          source={require('../assets/images/DeeperLoading.png')}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
          loading="eager"
          priority
        />
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
        <Stack.Screen name='(tabs)' options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name='(onboarding)' options={{ headerShown: false }} />
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