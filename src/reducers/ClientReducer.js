import {
  CLIENTS_FETCH_SUCCESS,
  VENDORS_FETCH_SUCCESS,
  FETCH_CLIENT_SUCCESS,
  FETCH_VENDOR_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  loading: true,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CLIENTS_FETCH_SUCCESS:
      return { ...state, client_list: action.payload, loading: false };
    case FETCH_CLIENT_SUCCESS:
      return { ...state, client: action.payload, loading: false };
    case FETCH_VENDOR_SUCCESS:
      return { ...state, vendor: action.payload, loading: false };
    case VENDORS_FETCH_SUCCESS:
      return { ...state, vendor_list: action.payload, loading: false };
    default:
      return state;
  }
};
