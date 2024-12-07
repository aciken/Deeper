import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const OnboardingSettingup = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboardingResults');  // Replace with your next screen route
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-zinc-950 justify-center items-center px-4">
      <MaskedView
        maskElement={
          <Text className="text-4xl font-bold text-center mb-16">
            We are setting{'\n'}everything up for you
          </Text>
        }
      >
        <LinearGradient
          colors={['#38bdf8', '#93c5fd']} // sky-400 to blue-300
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
        >
          <Text className="text-4xl font-bold text-center mb-16 opacity-0">
            We are setting{'\n'}everything up for you
          </Text>
        </LinearGradient>
      </MaskedView>
      
      <Image 
        source={require('../../assets/gifs/onboardingLoading.gif')}
        className="w-12 h-12" 
        resizeMode="contain"
        animationDuration={2000} // Slowing down animation duration
      />
    </View>
  );
};

export default OnboardingSettingup;
