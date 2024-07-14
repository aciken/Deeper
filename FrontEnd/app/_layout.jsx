import { StyleSheet, Text, View } from 'react-native';
import { Slot, SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import React, { useEffect } from 'react';

import GlobalProvider from './context/GlobalProvider';

const RootLayout = () => {
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
    if (error) {
      console.error('Error loading fonts', error);
      return;
    }

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        {/* <Stack.Screen name='(log)' options={{headerShown: false}}/> */}
        <Stack.Screen name='log/setTask' options={{ headerShown: false }} />
        <Stack.Screen name='log/SomeComponent' options={{ headerShown: false }} />
        <Stack.Screen name='log/editTask' options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootLayout;