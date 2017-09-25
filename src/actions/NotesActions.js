import _ from 'lodash';
import firebase from 'firebase';
import axios from 'axios';
import {
  NOTE_UPDATE,
  NOTE_CREATE,
  NOTES_FETCH_SUCCESS,
  MESSAGES_FETCH_SUCCESS,
  EMPLOYEES_FETCH_SUCCESS,
  USER_FETCH_SUCCESS,
  USERS_FETCH_SUCCESS,
  NOTE_SAVE_SUCCESS,
  NOTE_BEING_CREATED,
  CLEAR_NOTE_FORM
} from './types';

export const clearNoteForm = () => {
  return { type: CLEAR_NOTE_FORM };
};

export const fetchUsers = (uid) => {
  return (dispatch) => {
    firebase.database().ref(`/users/${uid}`)
      .on('value', snapshot => {
        dispatch({ type: USER_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
}

export const fetchAllUsers = () => {
  return (dispatch) => {
    firebase.database().ref(`/users`)
      .on('value', snapshot => {
        console.log('USERS!!!!!!!', snapshot.val());
        dispatch({ type: USERS_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
}

export const adminEmployeesFetch = () => {
  return (dispatch) => {
    firebase.database().ref('/users')
      .on('value', snapshot => {
        const adminUnfiltered = _.map(snapshot.val(), (obj, uid) => {
          return { ...obj, uid };
        });

        const admin = _.filter(adminUnfiltered, (obj) => {
          return obj.isAdmin;
        });

        dispatch({ type: EMPLOYEES_FETCH_SUCCESS, payload: admin });
      });
  };
};

export const noteUpdate = ({ prop, value }) => {
  return {
    type: NOTE_UPDATE,
    payload: { prop, value }
  };
};

export const noteCreate = ({ note, recipient1, recipient2, newDate, read, ampersand, adminEmployees, setModalVisible }) => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();
    const uid = currentUser.uid;
    const name = currentUser.displayName;
    const date = newDate.toString();

    setModalVisible(false);

    firebase.database().ref('/data/conversations')
      .push({ note, recipient1, recipient2, date, from: name, ampersand })
      .then((message) => {
        const employees = _.map(adminEmployees, (val) => {
          return val.uid;
        });

        for (let i = 0; i < employees.length; i++) {
          if (employees[i] === uid) {
            const nameSplit = employees[i].split(' ');
            const nameToLower = nameSplit[0].toLowerCase();
            const readProp = nameToLower + 'Read';
            firebase.database().ref(`/data/conversations/${message.path.o[2]}`)
              .update({ [readProp]: true });
          } else {
            const nameSplit = employees[i].split(' ');
            const nameToLower = nameSplit[0].toLowerCase();
            const readProp = nameToLower + 'Read';
            firebase.database().ref(`/data/conversations/${message.path.o[2]}`)
              .update({ [readProp]: read });
          }
        }

        firebase.database().ref(`/data/conversations/${message.path.o[2]}/messages`)
          .push({ note, date, from: name })
          .then(() => {
            sendPushNotification(note, name, message.path.o[2], 'pushMessage');
            dispatch({ type: NOTE_CREATE });
          })
      });
  };
};

export const newMessageCreate = ({ messageText, newDate, read, uid }) => {
  const note = messageText;
  const { currentUser } = firebase.auth();
  const userId = currentUser.uid;
  const name = currentUser.displayName;
  const date = newDate.toString();

  return (dispatch) => {
    dispatch({ type: NOTE_BEING_CREATED });
    firebase.database().ref(`/data/conversations/${uid}/messages`)
      .push({ note, date, from: name });
    firebase.database().ref(`/data/conversations/${uid}/note`)
      .set(note);
    firebase.database().ref(`/data/conversations/${uid}/date`)
      .set(date);
    firebase.database().ref('/users')
      .once('value', snapshot => {
        const mapUsers = _.map(snapshot.val(), (val, uid) => {
          return { ...val, uid };
        });

        const employees = _.filter(mapUsers, (val, uid) => {
          return val.isAdmin;
        });

        const tokens = _.map(employees, (val) => {
          return val.token;
        });


        for (let i = 0; i < employees.length; i++) {
          if (employees[i].uid === userId) {
            const nameToLower = employees[i].uid.toLowerCase();
            const userRead = nameToLower + 'Read';
            firebase.database().ref(`/data/conversations/${uid}/${userRead}`)
              .set(true);
          } else {
            const nameToLower = employees[i].uid.toLowerCase();
            const userRead = nameToLower + 'Read';
            firebase.database().ref(`/data/conversations/${uid}/${userRead}`)
              .set(false);
          }
        }

        sendPushNotification(messageText, name, uid, 'pushMessage');
    });
  };
};

export const sendPushNotification = (message, from, uid, route) => {

  const { currentUser } = firebase.auth();
  const userId = currentUser.uid;

  firebase.database().ref('/users')
    .once('value', snapshot => {
      const mapUsers = _.map(snapshot.val(), (val, uid) => {
        return { ...val, uid };
      });

      const employees = _.filter(mapUsers, (val) => {
        return val.isAdmin && val.uid !== userId;
      });

      const tokens = _.map(employees, (val) => {
        return val.token;
      });

      for (let i = 0; i < tokens.length; i++) {
        axios.post('https://cinderboard.com/pushNotification',
          {
            "token": `${tokens[i]}`,
            "message": `${message}`,
            "title": `${from}`,
            "route": 'pushMessage',
            "uid": `${uid}`
          }
        );
      }
    });
}

export const notesFetch = (uid) => {
  if (uid) {
    return (dispatch) => {
      firebase.database().ref(`/data/conversations/${uid}/messages`)
        .on('value', snapshot => {
          dispatch({ type: NOTES_FETCH_SUCCESS, payload: snapshot.val() });
        });
    };
  }
  return (dispatch) => {
    firebase.database().ref('/data/conversations')
      .on('value', snapshot => {
        dispatch({ type: NOTES_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const messagesFetch = (uid) => {
  return (dispatch) => {
    firebase.database().ref(`/data/conversations/${uid}/messages`)
      .on('value', snapshot => {
        dispatch({ type: MESSAGES_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const noteSave = ({ note, newDate, uid }) => {
  const date = newDate.toString();

  return (dispatch) => {
    firebase.database().ref(`/data/messages/${uid}`)
      .set({ note, date })
      .then(() => {
        dispatch({ type: NOTE_SAVE_SUCCESS });
      });
  };
};

export const noteUpdateRead = ({ read, uid, userRead }) => {
  return (dispatch) => {
    firebase.database().ref(`/data/conversations/${uid}/${userRead}`)
      .set(true)
      .then(() => {
        dispatch({ type: NOTE_SAVE_SUCCESS });
      });
  };
};

export const noteDelete = ({ uid }) => {
  return () => {
    firebase.database().ref(`/data/conversations/${uid}`)
      .remove();
  };
};
