import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { icons } from '../../constants';

const OnboardingPotential = () => {
  const router = useRouter();

  const StatCard = ({ title, value, icon, isMain }) => (
    <View className={`rounded-xl overflow-hidden ${isMain ? 'bg-sky-500' : 'bg-zinc-900'} mb-4`}>
      <View className="p-4">
        <View className="flex-row items-center mb-2">
          <Image source={icon} className="w-5 h-5 mr-2 tint-white" />
          <Text className={`text-lg font-medium ${isMain ? 'text-zinc-900' : 'text-white'}`}>
            {title}
          </Text>
        </View>
        <Text className={`text-5xl font-bold ${isMain ? 'text-zinc-900' : 'text-white'}`}>
          {value}
        </Text>
        <View className="w-full h-1.5 bg-white/20 rounded-full mt-2">
          <View 
            className={`h-full rounded-full ${isMain ? 'bg-zinc-900' : 'bg-sky-500'}`} 
            style={{ width: `${value}%` }}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 px-4">
        {/* Title Section */}
        <MaskedView
          maskElement={
            <Text className="text-4xl font-bold mt-8 mb-2">
              Your Deep Work Potential
            </Text>
          }
        >
          <LinearGradient
            colors={['#38bdf8', '#93c5fd']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          >
            <Text className="text-4xl font-bold mt-8 mb-2 opacity-0">
              Your Deep Work Potential
            </Text>
          </LinearGradient>
        </MaskedView>

        <Text className="text-zinc-400 text-xl mb-8">
          With optimal habits and routines, this is the Deep Work rating you could achieve.
        </Text>

        {/* Stats Grid */}
        <View className="flex-1">
          <StatCard
            title="Potential"
            value={85}
            icon={icons.star}
            isMain={true}
          />
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <StatCard
                title="Focus Time"
                value={88}
                icon={icons.clock}
              />
            </View>
            <View className="flex-1">
              <StatCard
                title="Consistency"
                value={82}
                icon={icons.chart}
              />
            </View>
          </View>
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <StatCard
                title="Productivity"
                value={85}
                icon={icons.target}
              />
            </View>
            <View className="flex-1">
              <StatCard
                title="Discipline"
                value={84}
                icon={icons.lock}
              />
            </View>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => router.push('/Home')}
          className="w-full h-14 bg-sky-500 rounded-full items-center justify-center mb-4"
        >
          <Text className="text-lg font-medium text-white">
            Start your journey
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingPotential;
