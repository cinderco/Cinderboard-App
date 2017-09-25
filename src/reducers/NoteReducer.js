import {
  NOTES_FETCH_SUCCESS,
  MESSAGES_FETCH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTES_FETCH_SUCCESS:
      return { ...state, conversations_list: action.payload, loading: false };
    case MESSAGES_FETCH_SUCCESS:
      return { ...state, messages_list: action.payload, loading: false };
    default:
      return state;
  }
};
