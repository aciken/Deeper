import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import axios from 'axios';
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState(0);
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        const setupPurchases = async () => {
            try {
                if(Platform.OS === 'ios') {
                    await Purchases.configure({ apiKey: 'appl_TjfDUbftKJDEbZZrxvTNHKhUQzc'});
                } else {
                    await Purchases.configure({ apiKey: 'appl_TjfDUbftKJDEbZZrxvTNHKhUQzc' });
                }
                const customerInfo = await Purchases.getCustomerInfo();
                setIsPro(customerInfo.entitlements.all.Pro?.isActive ?? false);
            } catch (error) {
                console.error('Error setting up purchases:', error);
            }
        };

        setupPurchases();
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            console.log('Checking login status...');

            const storedUser = await AsyncStorage.getItem('@user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                
                axios.post('https://deeper.onrender.com/getUser', { id: parsedUser._id })
                    .then(res => {
                        console.log('User data:', res.data);
                        if(res.data == 'User not found'){
                            AsyncStorage.clear();
                            setIsLogged(false);
                            setUser(null);
                        } else {
                            if(parsedUser.verify != 1){
                                router.push('/verify')
                            } else {
                                setUser(parsedUser);
                                setIsLogged(true);
                                router.push('/Home');
                            }
                        }
                    })
                    .catch(e => {
                        console.error('Error fetching user data:', e);
                    })
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            AsyncStorage.clear();
            setIsLogged(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                setIsLogged,
                user,
                setUser, 
                isLoading,
                setIsLoading,
                selected,
                setSelected,
                isPro,
                setIsPro,
            }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;