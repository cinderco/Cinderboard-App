import firebase from 'firebase';
import { TabNavigator, DrawerNavigator, StackNavigator, DrawerView } from 'react-navigation';
import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import LoginForm from './components/Login/LoginForm';
import OrderList from './components/Orders/Outgoing/OrderList';
import OutgoingSeparate from './components/Orders/Outgoing/OutgoingSeparate';
import IncomingSeparate from './components/Orders/Incoming/IncomingSeparate';
import OrderDetails from './components/Orders/Outgoing/OrderDetails';
import Welcome from './components/Welcome';
import { SideMenu } from './components/common';

const RoutesNonAdmin = StackNavigator({
  orders: { screen: OrderList }
}, {
  headerMode: 'none'
});

export default RoutesNonAdmin;
