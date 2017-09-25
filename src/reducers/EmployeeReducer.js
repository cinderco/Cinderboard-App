import {
  EMPLOYEES_FETCH_SUCCESS,
  USERS_FETCH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EMPLOYEES_FETCH_SUCCESS:
      return { ...state, admin_list: action.payload, loading: false };
    case USERS_FETCH_SUCCESS:
      console.log('FETCHING USERS', action.payload);
      return { ...state, users: action.payload, loading: false };
    default:
      return state;
  }
};
