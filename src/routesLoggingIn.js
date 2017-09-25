import firebase from 'firebase';
import { TabNavigator, DrawerNavigator, StackNavigator, DrawerView } from 'react-navigation';
import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import LoggingIn from './components/Login/LoggingIn';

const RoutesLoggingIn = TabNavigator({
  auth: { screen: LoggingIn }
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

export default RoutesLoggingIn;
