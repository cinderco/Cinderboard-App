import {
  ORDER_FETCH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ORDER_FETCH_SUCCESS:
      return { ...state, orderInfo: action.payload, loading: false };
    default:
      return state;
  }
};
