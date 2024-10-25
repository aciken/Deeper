import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const AlertPopup = ({ visible, message, type = 'info', onHide }) => {
    const translateY = useRef(new Animated.Value(100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 8,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();

            const timer = setTimeout(() => {
                hidePopup();
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            hidePopup();
        }
    }, [visible]);

    const hidePopup = () => {
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 100,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            if (onHide) onHide();
        });
    };

    if (!visible) return null;

    const getColors = () => {
        switch (type) {
            case 'success':
                return ['#22c55e', '#16a34a'];
            case 'error':
                return ['#ef4444', '#e11d48'];
            case 'warning':
                return ['#f59e0b', '#d97706'];
            default:
                return ['#3b82f6', '#0ea5e9'];
        }
    };

    return (
        <Animated.View 
            style={[
                styles.container, 
                { 
                    transform: [{ translateY }],
                    opacity 
                }
            ]}
        >
            <LinearGradient
                colors={getColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text style={styles.message}>{message}</Text>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        width: width - 40,
        borderRadius: 10,
        overflow: 'hidden',
        zIndex: 9999,
    },
    gradient: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    message: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default AlertPopup;
