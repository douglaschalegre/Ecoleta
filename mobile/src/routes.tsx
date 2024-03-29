import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import CollectionPoints from './pages/CollectionPoints';
import Detail from './pages/Detail';

const Stack = createStackNavigator();

const Routes = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator 
      headerMode="none" 
      screenOptions={{
        cardStyle:{
          backgroundColor:'#f0f0f5'
        }
        }}>
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
        <Stack.Screen name="CollectionPoints" component={CollectionPoints}></Stack.Screen>
        <Stack.Screen name="Detail" component={Detail}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

}

export default Routes;