import {
  ARCHIVED_FETCH_SUCCESS,
  ALL_ARCHIVED_FETCH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ALL_ARCHIVED_FETCH_SUCCESS:
      return { ...state, all_archived_list: action.payload, loading: false };
    case ARCHIVED_FETCH_SUCCESS:
      return { ...state, archived_list: action.payload, loading: false };
    default:
      return state;
  }
};
