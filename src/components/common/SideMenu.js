import React from 'react';
import { View, Text, TouchableHighlight, Image, Alert, AsyncStorage } from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import firebase from 'firebase';

const SideMenuListItem = (props) => {
  return (
    <TouchableHighlight
      onPress={() => {
        props.navigate(props.destination);
      }}
      underlayColor={'gray'}
    >
      <View style={{ height: 50, borderBottomWidth: 1, alignItems: 'center', flexDirection: 'row', paddingLeft: 15 }}>
        <Icon
          name={props.icon}
          type='font-awesome'
          color='#db2728'
        />
        <Text style={{ paddingLeft: 10, fontSize: 18 }}>{props.title}</Text>
      </View>
    </TouchableHighlight>
  )
}

const SideMenu = (props) => {
  const { navigate } = props.navigation;

  const { currentUser } = firebase.auth();
  const displayName = currentUser.displayName;

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          alignSelf: 'center',
          fontSize: 20,
          color: '#db2728',
          fontWeight: '600',
          paddingTop: 20
        }}
      >
        {displayName}
      </Text>

        <View style={{ flex: 1, position: 'relative',  borderTopWidth: 1, marginTop: 40 }}>
          <SideMenuListItem
            navigate={props.navigation.navigate}
            destination={'main'}
            icon={'home'}
            title={'Home'}
          />

          <SideMenuListItem
            navigate={props.navigation.navigate}
            destination={'signup'}
            icon={'users'}
            title={'Manage Users'}
          />

          <TouchableHighlight
            onPress={() => {
              Alert.alert(
                'Log Out',
                'Are you sure you want log out?',
                [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  { text: 'Ok', onPress: () => {
                      AsyncStorage.removeItem('pushToken', () => {
                        console.log('removed push token and signing out');
                        firebase.database().ref(`/users/${currentUser.uid}/token`)
                          .remove()
                          .then(() => {
                            firebase.auth().signOut();
                          })
                      })
                    }
                  }
                ],
                  { cancelable: true }
                )
            }}
            style={{ position: 'absolute', bottom: 20, left: 0, right: 0 }}
            underlayColor={'gray'}
          >
            <View style={{ height: 50, borderBottomWidth: 1, borderTopWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: '#db2728' }}>Logout</Text>
            </View>
          </TouchableHighlight>
        </View>
    </View>
  );
}

export { SideMenu };
