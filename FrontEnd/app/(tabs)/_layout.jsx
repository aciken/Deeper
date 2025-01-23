import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import {useEffect} from 'react';
import Purchases from 'react-native-purchases';
import { useRouter } from 'expo-router';

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();


  useEffect(() => {
    const setupPurchases = async () => {
      try {
        if(Platform.OS === 'ios') {
          await Purchases.configure({ apiKey: 'appl_QREOkhpBbXGDRXyYeCqXXvirAAA'});
        } else {
          await Purchases.configure({ apiKey: 'appl_QREOkhpBbXGDRXyYeCqXXvirAAA' });
        }

        const offerings = await Purchases.getOfferings();
        console.log('RevenueCat Offerings:', offerings);
        
        // Check if user is premium
        const customerInfo = await Purchases.getCustomerInfo();
        const isPro = customerInfo.entitlements.active.pro !== undefined;
        console.log('User is premium:', isPro);

        if(!isPro) {
          router.push('utils/two');
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
