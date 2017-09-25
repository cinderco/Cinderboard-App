import firebase from 'firebase';
import axios from 'axios';
import {
  OUTGOING_CREATE,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  CONFIRM_PASSWORD_CHANGED,
  NAME_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  SIGNUP_USER_SUCCESS,
  LOGIN_USER
} from './types';

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const confirmPasswordChanged = (text) => {
  return {
    type: CONFIRM_PASSWORD_CHANGED,
    payload: text
  };
};

export const nameChanged = (text) => {
  return {
    type: NAME_CHANGED,
    payload: text
  };
};

export const loginUser = ({ email, password, setError, setLoading }) => {
  return (dispatch) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        setLoading(true);
        setError('');
      })
      .catch((error) => {
          setLoading(false);
          loginUserFail(dispatch);
          setError('Incorrect email or password!');
      });
  };
};

export const addUser = ({ email, password, name, admin, setModalVisible, setError }) => {
  const config = {
    headers: {'Content-Type': 'application/json'}
  }
  return (dispatch) => {
    axios({
      method: 'post',
      url: 'https://cinderboard.com/newUser',
      data: {
        email: `${email}`,
        password: `${password}`,
        name: `${name}`
      }
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        firebase.database().ref(`/users/${response.data.uid}`)
          .set({ email, name, isAdmin: admin })
            .then(() => setModalVisible(false));
      }
    });
  };
};

export const signupUser = ({ email, password }) => {
  return (dispatch) => {
    firebase.auth().createUserWithEmailAndPassword(email, password);
  }
};

export const updateUser = ({ email, password, name, admin, uid, setModalVisible, setError }) => {
  console.log('user uid:', uid);
  return (dispatch) => {
    axios({
      method: 'post',
      url: 'https://cinderboard.com/updateUser',
      data: {
        uid: `${uid}`,
        email: `${email}`,
        password: `${password}`,
        name: `${name}`
      }
    }).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
      } else {
        firebase.database().ref(`/users/${response.data.uid}`)
          .update({ email, name, isAdmin: admin })
            .then(() => setModalVisible(false));
      }
    });
  };
};

const loginUserFail = (dispatch) => {
  dispatch({ type: LOGIN_USER_FAIL });
};

export const loginUserSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  });
};

const signupUserSuccess = (dispatch, user) => {
  dispatch({
    type: SIGNUP_USER_SUCCESS,
    payload: user
  });
};

export const signOutUser = () => {
  return () => {
    firebase.auth().signOut()
      .then(() => {

      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const userDelete = ({ uid }) => {
  return (dispatch) => {
    axios({
      method: 'post',
      url: 'https://cinderboard.com/deleteUser',
      data: {
        uid: `${uid}`
      }
    }).then((response) => {
      console.log('attempting to delete user');
        firebase.database().ref(`/users/${uid}`)
          .remove();
      });
  };
}
