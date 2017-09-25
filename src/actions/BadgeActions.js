import _ from 'lodash';
import firebase from 'firebase';
import { NavigationActions } from 'react-navigation';
import {
  SET_MESSAGES_BADGE
} from './types';


export const fetchMessagesUnread = (uid) => {
  const userRead = uid.toLowerCase() + 'Read';

  return (dispatch) => {
    firebase.database().ref(`/data/conversations`)
      .on('value', snapshot => {
        let badgeNumber = 0;

        const messageReadStatuses = _.map(snapshot.val(), (val, uid) => {
          if (!val[userRead]) {
            return badgeNumber += 1;
          }
          return badgeNumber;
        });

        NavigationActions.setParams({ badgeNumber: badgeNumber});
        dispatch({ type: SET_MESSAGES_BADGE, payload: badgeNumber });
      });
  };
};
