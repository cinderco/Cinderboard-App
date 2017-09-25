import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import firebase from 'firebase';

const SceneHeader = (props) => {
  if (props.rightButtonPress === false) {
    if (props.notification === true) {
      return (
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('messagesList')}
            style={styles.backButton}
          >
            <Icon
              name='chevron-left'
              type='font-awesome'
              color='white'
            />
          <Text style={{ color: 'white', fontSize: 16, marginLeft: 10 }}>Back</Text>
          </TouchableOpacity>

          <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center'}}>{props.title}</Text>
        </View>
      );
    }
    return (
      <View style={styles.modalHeader}>
        <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center'}}>{props.title}</Text>
          <TouchableOpacity
            onPress={() => Alert.alert(
              'Log Out',
              'Are you sure you want log out?',
              [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                { text: 'Ok', onPress: () => {
                  firebase.auth().signOut()}
                }
              ],
                { cancelable: true }
              )
           }
            style={styles.buttonRight}
          >
            <Text style={{ color: 'white', paddingRight: 10, paddingBottom: 10 }}>Logout</Text>
          </TouchableOpacity>
      </View>
    );
  } else {
    if (props.hamburgerOnly) {
      return (
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('DrawerOpen')}
            style={styles.backButton}
          >
            <Icon
              name='bars'
              type='font-awesome'
              color='white'
            />
          </TouchableOpacity>

          <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center'}}>{props.title}</Text>
        </View>
      );
    }
    return (
      <View style={styles.modalHeader}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('DrawerOpen')}
          style={styles.backButton}
        >
          <Icon
            name='bars'
            type='font-awesome'
            color='white'
          />
        </TouchableOpacity>

        <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center'}}>{props.title}</Text>

        <TouchableOpacity
          onPress={() => props.rightButtonPress()}
          style={styles.buttonRight}
        >
          <Icon
            name='plus'
            type='material-community'
            color='white'
            size={35}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  modalHeader: {
    height: 63,
    backgroundColor: 'black',
    position: 'relative',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    paddingBottom: 10,
    alignSelf: 'stretch'
  },
  backButton: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonRight: {
    position: 'absolute',
    right: 5,
    flexDirection: 'row',
    alignItems: 'center'
  }
}

export { SceneHeader };
