import React from 'react';
import { View, Button, Text } from 'react-native';
import { useGlobalContext } from '../context/GlobalProvider'

const SomeComponent = () => {
    const { user, setUser } = useGlobalContext();

    const handleLogin = () => {
        const newUser = { name: 'John Doe', email: 'john@example.com' };
        setUser(newUser);
    };

    return (
        <View>
            <Button title="Set User" onPress={handleLogin} />
            {user ? <Text>User: {user.name}</Text> : <Text>No User Set</Text>}
        </View>
    );
};

export default SomeComponent;
