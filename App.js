import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import CardView from './components/CardView';
// import ListView from './components/ListView';
import MainPage from './screens/MainPage';
import DetailPage from './screens/DetailPage';
// import { TouchableOpacity } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: "slide_from_right", headerShown: false }}>
        <Stack.Screen
          name="Home"
          component={MainPage} />
        <Stack.Screen
          name="Detail"
          component={DetailPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
