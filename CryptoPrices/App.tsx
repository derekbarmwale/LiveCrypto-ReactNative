// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, DetailScreen } from './screens';
import io from 'socket.io-client';

const Stack = createNativeStackNavigator();

export const socket = io('http://192.168.8.100:8000');

socket.on('connect', () => {
  console.log('socket is connected');
});

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;