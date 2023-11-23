import React from 'react';
import {SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './app/screens/LoginScreen';
import HomeScreen from './app/screens/HomeScreen';
import SplashScreen from './app/screens/SplashScreen';
import Logout from './app/components/Logout';
import StoreDetailsScreen from './app/screens/StoreDetailsScreen';
import {COMMON_STYLES} from './app/styles/common.styles';

const Stack = createNativeStackNavigator();

export const ROUTES = {
  HOME: 'Home',
  LOGIN: 'Login',
  SPLASH: 'Splash',
  STORE_DETAILS: 'StoreDetails',
};

const App = () => {
  return (
    <SafeAreaView style={COMMON_STYLES.flex1}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name={ROUTES.SPLASH}
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={ROUTES.HOME}
            component={HomeScreen}
            options={{title: 'Stores', headerRight: () => <Logout />}}
          />
          <Stack.Screen
            name={ROUTES.LOGIN}
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={ROUTES.STORE_DETAILS}
            component={StoreDetailsScreen}
            options={{title: 'Store Details', headerRight: () => <Logout />}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
