import Expo, { Notifications } from 'expo';
import React from 'react';
import { StatusBar, View, Text, Alert } from 'react-native';
import { StackNavigator, addNavigationHelpers, TabNavigator, NavigationActions } from 'react-navigation';
import { Provider, connect } from 'react-redux';
import firebase from 'firebase';
import Routes from './src/routes';
import RoutesNonAdmin from './src/routesNonAdmin';
import RoutesNotLoggedIn from './src/routesNotLoggedIn';
import RoutesLoggingIn from './src/routesLoggingIn';
import store from "./src/store";
import registerForNotifications from './src/services/push_notifications';

class App extends React.Component {
  state = {
    loggedIn: false,
    loggingIn: true
  }

  componentWillMount() {
    const config = {
      apiKey: "AIzaSyCIlLAH8ggLIQ0_nYgwymbQ8sBWVU3_gW0",
      authDomain: "cinderboard-8b6b6.firebaseapp.com",
      databaseURL: "https://cinderboard-8b6b6.firebaseio.com",
      projectId: "cinderboard-8b6b6",
      storageBucket: "cinderboard-8b6b6.appspot.com",
      messagingSenderId: "807753427618"
    };
    
    firebase.initializeApp(config);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        const userObj = firebase.auth().currentUser;

        firebase.database().ref(`/users/${user.uid}`)
          .on('value', snapshot => {
            if (snapshot.val().isAdmin === true) {

              userObj.updateProfile({ displayName: snapshot.val().name });

              this.setState({ isAdmin: snapshot.val().isAdmin, loggedIn: true, loggingIn: false });
            } else {
              this.setState({ isAdmin: snapshot.val().isAdmin, loggedIn: true, loggingIn: false });
            }
          });
      } else {
        this.setState({ loggedIn: false, loggingIn: false });
      }
    });
  }

  render() {
    if (this.state.loggedIn === true) {
      if(this.state.isAdmin === false) {
        return (
          <View style={{ flex: 1 }}>
            <StatusBar
              barStyle="light-content"
            />

            <Provider store={store}>
              <RoutesNonAdmin />
            </Provider>
          </View>
        )
      } else {
        return (
          <View style={{ flex: 1 }}>
            <StatusBar
              barStyle="light-content"
            />

            <Provider store={store}>
              <Routes />
            </Provider>
          </View>
        );
      }
    } else if (!this.state.loggedIn && this.state.loggingIn) {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="light-content"
          />

          <Provider store={store}>
            <RoutesLoggingIn />
          </Provider>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="light-content"
          />

          <Provider store={store}>
            <RoutesNotLoggedIn />
          </Provider>
        </View>
      );
    }
  }
}

Expo.registerRootComponent(App);
