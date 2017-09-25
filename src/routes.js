import firebase from 'firebase';
import { TabNavigator, DrawerNavigator, StackNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';
import LoginForm from './components/Login/LoginForm';
import SignupForm from './components/Login/SignupForm';
import Users from './components/Login/Users';
import OrderList from './components/Orders/Outgoing/OrderList';
import OutgoingSeparate from './components/Orders/Outgoing/OutgoingSeparate';
import IncomingSeparate from './components/Orders/Incoming/IncomingSeparate';
import OrderCreate from './components/Orders/Outgoing/OrderCreate';
import OrderDetails from './components/Orders/Outgoing/OrderDetails';
import OrderEdit from './components/Orders/Outgoing/OrderEdit';
import OrderForm from './components/Orders/OrderForm';
import OrderFormIncoming from './components/Orders/OrderFormIncoming';
import OrderEditForm from './components/Orders/OrderEditForm';
import OrderType from './components/Orders/OrderType';
import IncomingCreate from './components/Orders/Incoming/IncomingCreate';
import IncomingEdit from './components/Orders/IncomingOrderEditForm';
import NotesList from './components/Messages/NotesList';
import NoteCreate from './components/Messages/NoteCreate';
import NoteEdit from './components/Messages/NoteEdit';
import PushToMessage from './components/Messages/PushToMessage';
import Menu from './components/Menu';
import ArchivedOrders from './components/Orders/Archived/ArchivedOrders';
import ClientList from './components/Clients/ClientList';
import VendorList from './components/Clients/VendorList';
import ClientCreate from './components/Clients/ClientCreate';
import VendorCreate from './components/Clients/VendorCreate';
import VendorInfo from './components/Clients/VendorInfo';
import ClientInfo from './components/Clients/ClientInfo';
import OrderHistory from './components/Clients/OrderHistory';
import ClientForm from './components/Clients/ClientForm';
import Welcome from './components/Welcome';
import { SideMenu } from './components/common';

const Routes = StackNavigator({
  mainDrawer: {
    screen: DrawerNavigator({
      main: {
        screen: TabNavigator({
          allOrders: {
            screen: StackNavigator({
              orders: { screen: OrderList },
              outgoing: { screen: OutgoingSeparate },
              incoming: { screen: IncomingSeparate },
              newOutgoing: { screen: OrderForm },
              newIncoming: { screen: OrderFormIncoming },
              orderDetails: { screen: OrderDetails },
              editOrder: { screen: OrderEditForm },
              incomingEditOrder: { screen: IncomingEdit }
            }, {
              navigationOptions: {
                header: null,
                tabBarVisible: true
              },
              headerMode: 'none'
            })
          },
          archived: {
            screen: StackNavigator({
              archivedOrders: { screen: ArchivedOrders },
              archivedDetails: { screen: OrderDetails }
            }, {
              headerMode: 'none'
            })
          },
          messages: {
            screen: StackNavigator({
              messagesList: { screen: NotesList },
              message: { screen: NoteEdit },
              newMessage: { screen: NoteCreate },
              pushMessage: { screen: PushToMessage }
            }, {
              headerMode: 'none'
            })
          },
          clients: {
            screen: StackNavigator({
              clientList: { screen: ClientList },
              clientInfo: { screen: ClientInfo },
              newClient: { screen: ClientCreate },
              clientForm: { screen: ClientForm },
              orderHistory: { screen: OrderHistory }
            }, {
              headerMode: 'none'
            })
          },
          vendors: {
            screen: StackNavigator({
              vendorList: { screen: VendorList },
              vendorInfo: { screen: VendorInfo },
              newVendor: { screen: VendorCreate },
              vendorForm: { screen: ClientForm }
            }, {
              headerMode: 'none'
            })
          },
        }, {
          navigationOptions: {
            headerVisible: false,
          },
          headerMode: 'none',
          tabBarOptions: {
            activeTintColor: '#DB2728',
            inactiveTintColor: 'black',
            labelStyle: {
              fontSize: 10,
              width: 65,
              alignSelf: 'center'
            },
            showIcon: true,
            style: {
              backgroundColor: 'white'
            },
            iconStyle: {
              width: 65,
              alignSelf: 'center'
            },
            indicatorStyle: {
              backgroundColor: '#DB2728'
            }
          },
          tabBarPosition: 'bottom',
          animationEnabled: false,
          swipeEnabled: false,
          tabBarVisible: false
        })
      },
      signup: { screen: Users },

    }, {
      contentComponent:({navigation})=> <SideMenu navigation={navigation} />,
    })
  },
}, {
  navigationOptions: {
    header: null,
    gesturesEnabled: false
  },
});

export default Routes;
