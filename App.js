import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

 


// import screens
import Welcome from './src/screens/Welcome';
import Search from './src/screens/Search';
import Home from './src/screens/Home';
import Details from './src/screens/Details';
import Checkout from './src/screens/Checkout';
import Account from './src/screens/Account';
import Info from './src/screens/Info';
import Cart from './src/screens/Cart';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Thanks from './src/screens/Thanks';
import Order from './src/screens/Order';
import Orderview from './src/screens/Orderview';
import Redirect from './src/screens/Redirect';
import Reredirect from './src/screens/Reredirect';
import Settings from './src/screens/Settings';
import Header from './src/screens/section/Header';

const Stack = createStackNavigator();
const DrewerStack = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();


const HomeTabScreen = () => (
  <Tab.Navigator initialRouteName="Welcome" barStyle={{ backgroundColor: '#fff' }} activeColor="#333"
  inactiveColor="#333">
    <Tab.Screen name="Home" component={Home} options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}/>
    <Tab.Screen name="Search" component={Search} options={{
      tabBarLabel: 'Search',
      tabBarIcon: ({ color }) => (
        <AntDesign name="search1" size={24} color={color} />
      ),
    }}/>
    <Tab.Screen name="Cart" component={Cart} options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => (
            <AntDesign name="shoppingcart" size={24} color={color} />
          ),
        }}/>
    <Tab.Screen name="Account" component={Account} options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
        }}/>
    <Tab.Screen  name="Settings" component={Settings} options={{
      tabBarLabel: 'Settings',
      tabBarIcon: ({ color }) => (
        <AntDesign name="setting" size={24} color={color} />
      ),
    }} />
  </Tab.Navigator>
)

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Header" component={Header} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Home" component={HomeTabScreen}/>
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Info" component={Info} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Thanks" component={Thanks} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="Orderview" component={Orderview} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Redirect" component={Redirect} />
        <Stack.Screen name="Reredirect" component={Reredirect} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }

})
