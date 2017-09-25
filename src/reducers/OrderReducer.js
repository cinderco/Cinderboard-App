import {
  OUTGOING_FETCH_SUCCESS,
  SET_MESSAGES_BADGE,
  USER_FETCH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  loading: true,
  badgeNumber: 0,
  isAdmin: null,
  user: null,
  initialMain: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_FETCH_SUCCESS:
      if(action.payload === null) {
        return state;
      }
      return { ...state, user: action.payload, isAdmin: action.payload.isAdmin, initialMain: true };
    case OUTGOING_FETCH_SUCCESS:
      return { ...state, outgoing_list: action.payload, loading: false };
    case SET_MESSAGES_BADGE:
      return { ...state, badgeNumber: action.payload };
    default:
      return state;
  }
};
