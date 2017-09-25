import {
  LOG_FETCH_SUCCESS,
  LOADING_LOG
} from '../actions/types';

const INITIAL_STATE = {
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOADING_LOG:
      return { ...state};
    case LOG_FETCH_SUCCESS:
      return { ...state, log_list: action.payload, loading: false };
    default:
      return state;
  }
};
