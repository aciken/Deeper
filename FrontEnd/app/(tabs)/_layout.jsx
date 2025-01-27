import React from 'react';
import { View, Text, Image, StyleSheet,Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import {useEffect} from 'react';
import Purchases from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useGlobalContext();

  useEffect(() => {
    const setupPurchases = async () => {
      try {
        if(Platform.OS === 'ios') {
          await Purchases.configure({ apiKey: 'appl_TjfDUbftKJDEbZZrxvTNHKhUQzc'});
        } else {
          await Purchases.configure({ apiKey: 'appl_TjfDUbftKJDEbZZrxvTNHKhUQzc' });
        }

        // Log in the user to RevenueCat
        if (user?._id) {
          await Purchases.logIn(user._id);
          console.log('Logged in to RevenueCat with ID:', user._id);
        }

        const offerings = await Purchases.getOfferings();
        
        // Check if user is premium
        const customerInfo = await Purchases.getCustomerInfo();
        const currentRevenueCatId = await Purchases.getAppUserID();
        const isPro = customerInfo.entitlements.all.Pro?.isActive;
        
        console.log('User is premium:', isPro);
        console.log('Current RevenueCat ID:', currentRevenueCatId);
        console.log('User ID:', user?._id);

        // Only consider the user as premium if both conditions are met:
        // 1. They have an active Pro entitlement
        // 2. Their RevenueCat ID matches their user ID
        if(!isPro || currentRevenueCatId !== user?._id) {
          // Force logout from RevenueCat before showing paywall
          await Purchases.logOut();
          // Log back in with correct ID
          if (user?._id) {
            await Purchases.logIn(user._id);
          }
          router.push('utils/Paywall');
        } 

        if (offerings.current) {
          console.log('Current Offering:', {
            identifier: offerings.current.identifier,
            packages: offerings.current.availablePackages.map(pkg => ({
              identifier: pkg.identifier,
              product: {
                title: pkg.product.title,
                price: pkg.product.price,
                priceString: pkg.product.priceString,
                description: pkg.product.description
              }
            }))
          });
        } else {
          console.log('No current offering available');
        }
      } catch (error) {
        console.error('RevenueCat Error:', error);
      }
    };

    setupPurchases();
  }, []);



  const TabIcon = ({ icon, color, name }) => {
    return (
      <View style={styles.tabIconContainer}>
        <Image 
          source={icon}
          resizeMode='contain'
          tintColor={color}
          style={styles.tabIcon}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#09090b' }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#0284c7',
          tabBarInactiveTintColor: '#1f2937',
          tabBarStyle: {
            backgroundColor: '#09090b',
            borderTopWidth: 1,
            borderTopColor: '#18181b',
            height: 50 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 2,
            elevation: 0,
          },
          headerShown: false,
          contentStyle: {
            backgroundColor: '#09090b'
          }
        }}
      >
        <Tabs.Screen name="Home"
          options={{
            headerShown: false,
            tabBarIcon: ({color}) => (
              <TabIcon icon={icons.home} color={color} name='Home'/>
            )
          }}
        />
        <Tabs.Screen name="Tasks"
          options={{
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
