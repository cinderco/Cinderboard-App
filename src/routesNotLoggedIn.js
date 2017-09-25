import firebase from 'firebase';
import { TabNavigator, DrawerNavigator, StackNavigator, DrawerView } from 'react-navigation';
import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import LoginForm from './components/Login/LoginForm';
import SignupForm from './components/Login/SignupForm';
import WelcomeLogin from './components/WelcomeLogin';

const RoutesNonAdmin = TabNavigator({
  auth: { screen: LoginForm }
}, {
  navigationOptions: {
    tabBarActiveTintColor: '#DB2728',
    tabBarLabelStyle: {
      fontSize: 12,
    },
    tabBarVisible: false,
    header: {
      visible: false
    }
  },
});

export default RoutesNonAdmin;
