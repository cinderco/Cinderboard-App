import firebase from 'firebase';
import { NavigationActions } from 'react-navigation';
import {
  CLIENT_CREATE,
  CLIENT_UPDATE,
  CLIENTS_FETCH_SUCCESS,
  CLIENT_SAVE_SUCCESS,
  CLEAR_CLIENT_FORM,
  VENDOR_CREATE,
  VENDOR_UPDATE,
  VENDORS_FETCH_SUCCESS,
  VENDOR_SAVE_SUCCESS,
  INITIATE_CLIENT_SAVE,
  INITIATE_VENDOR_SAVE,
  INITIATE_CLIENT_DELETE,
  CLIENT_DELETE_SUCCESS,
  FETCH_CLIENT_SUCCESS,
  FETCH_VENDOR_SUCCESS,
  SET_EDIT_VISIBLE,
  SET_MODAL_VISIBLE,
  CLEAR_VENDOR_FORM
} from './types';


export const clearClientForm = () => {
  return { type: CLEAR_CLIENT_FORM };
};

export const clientUpdate = ({ prop, value }) => {
  return {
    type: CLIENT_UPDATE,
    payload: { prop, value }
  };
};

export const clientCreate = ({
  companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, lat, long, navigation
}) => {
  const date = new Date();
  const createDate = date.toString();

  return (dispatch) => {
    firebase.database().ref('/data/clients')
      .push({ companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, createDate, lat, long })
      .then(() => {
        dispatch({ type: CLIENT_CREATE });
      });
  };
};

export const clientsFetch = () => {
  return (dispatch) => {
    firebase.database().ref('/data/clients')
      .on('value', snapshot => {
        dispatch({ type: CLIENTS_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const clientSave = ({
  companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, lat, long, createDate, uid
}) => {
  return (dispatch) => {
    dispatch({ type: INITIATE_CLIENT_SAVE });

    firebase.database().ref(`/data/clients/${uid}`)
      .update({ companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, createDate, lat, long })
      .then(() => {
        dispatch({ type: CLIENT_CREATE });
      });
  };
};


export const clientDelete = ({ uid, navigation, setModalVisible }) => {
  return (dispatch) => {
    dispatch({ type: CLIENT_CREATE });
    firebase.database().ref(`/data/clients/${uid}`)
      .remove()
      .then(() => {
        setModalVisible(false);
      });
  };
};

export const vendorCreate = ({
  companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, lat, long, navigation
}) => {
  const date = new Date();
  const createDate = date.toString();

  return (dispatch) => {
    firebase.database().ref('/data/vendors')
      .push({ companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, createDate, lat, long })
      .then(() => {
        dispatch({ type: VENDOR_CREATE });
      });
  };
};

export const vendorsFetch = () => {
  return (dispatch) => {
    firebase.database().ref('/data/vendors')
      .on('value', snapshot => {
        dispatch({ type: VENDORS_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const fetchClient = ({ uid }) => {
  return (dispatch) => {
    firebase.database().ref(`/data/clients/${uid}`)
      .on('value', snapshot => {
        dispatch({ type: FETCH_CLIENT_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const fetchVendor = ({ uid }) => {
  return (dispatch) => {
    firebase.database().ref(`/data/vendors/${uid}`)
      .on('value', snapshot => {
        dispatch({ type: FETCH_VENDOR_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const vendorSave = ({
  companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, lat, long, createDate, uid, navigation
}) => {
  return (dispatch) => {
    dispatch({ type: INITIATE_CLIENT_SAVE });

    firebase.database().ref(`/data/vendors/${uid}`)
      .update({ companyName, contact, jobTitle, phone, email, street, streetTwo, city, zip, state, createDate, lat, long })
      .then(() => {
        dispatch({ type: CLIENT_CREATE });
      });
  };
};

export const vendorDelete = ({ uid, navigation, setModalVisible }) => {
  return (dispatch) => {
    firebase.database().ref(`/data/vendors/${uid}`)
      .remove()
      .then(() => {
        setModalVisible(false);
        dispatch({ type: CLIENT_DELETE_SUCCESS });
      });
  };
};

export const setEditVisible = (editVisible) => {
  return {
    type: SET_EDIT_VISIBLE,
    payload: editVisible
  };
}

export const setModalVisible = (visible) => {
  return {
    type: SET_MODAL_VISIBLE,
    payload: visible
  };
};
