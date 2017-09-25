import { Permissions, Notifications } from 'expo';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import firebase from 'firebase';

const PUSH_ENDPOINT = 'http://rallycoding.herokuapp.com/api/tokens';
const config = {
  headers: {
    "accept": "application/json",
    "accept-encoding": "gzip, deflate",
    "content-type": "application/json"
  }
};

export default async (props) => {
  let previousToken = await AsyncStorage.getItem('pushToken');

  if (previousToken) {
    await firebase.database().ref(`/users/${props.uid}/token`)
      .set(previousToken);
  } else {
    let { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);

    if (status !== 'granted') {
      return;
    }

    let token = await Notifications.getExponentPushTokenAsync();

    console.log('TOKEN', token);

    AsyncStorage.setItem('pushToken', token);
    firebase.database().ref(`/users/${props.uid}/token`)
      .set(token);
  }
};
