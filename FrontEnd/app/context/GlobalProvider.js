import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import axios from 'axios';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            console.log('Checking login status...');

            const storedUser = await AsyncStorage.getItem('@user');
            console.log('Stored user:', storedUser);
            if (storedUser) {
                axios.post('https://0f3b-109-245-203-91.ngrok-free.app/getUser', { id: storedUser._id })
                    .then(res => {
                        if(res.data == 'User not found'){
                            AsyncStorage.clear();
                            setIsLogged(false);
                            setUser(null);
                        } else {
                            const parsedUser = JSON.parse(storedUser);
                            setUser(parsedUser);
                            setIsLogged(true);
                            router.push('/Home');
                        }

                    })
                    .catch(e => {
                        console.error('Error fetching user data:', e);
                    })
                // axios.post('https://0f3b-109-245-203-91.ngrok-free.app/getUser', { id: storedUser._id })
                //     .then(res => {
                //         console.log('User found in AsyncStorage', storedUser);
                //         const parsedUser = JSON.parse(storedUser);
                //         console.log('Parsed user:', parsedUser);
                //         setUser(parsedUser);
                //         setIsLogged(true);
                //         router.push('/Home');
                //     })
                //     .catch(e => {
                //         console.error('Error fetching user data:', e);
                //     })
            }
        } catch (error) {
            console.error('Error checking login status:', error);
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
            }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;