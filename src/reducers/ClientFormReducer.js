import {
  CLEAR_CLIENT_FORM,
  CLIENT_UPDATE,
  CLIENT_CREATE,
  CLIENT_SAVE_SUCCESS,
  VENDOR_CREATE,
  INITIATE_CLIENT_SAVE,
  INITIATE_VENDOR_SAVE,
  INITIATE_CLIENT_DELETE,
  SET_EDIT_VISIBLE,
  SET_MODAL_VISIBLE,
  CLIENT_DELETE_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  companyName: '',
  contact: '',
  jobTitle: '',
  phone: '',
  email: '',
  address: '',
  loading: false,
  loadingDelete: false,
  modalVisible: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INITIATE_CLIENT_DELETE:
      return { ...state, loadingDelete: true }
    case CLIENT_DELETE_SUCCESS:
      return { ...state, loadingDelete: false }
    case INITIATE_VENDOR_SAVE:
      return { ...state, loading: true };
    case INITIATE_CLIENT_SAVE:
      return { ...state, loading: true };
    case CLIENT_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case SET_EDIT_VISIBLE:
      return { ...state, editVisible: action.payload, modalVisibleTwo: true };
    case SET_MODAL_VISIBLE:
      return { ...state, modalVisible: action.payload };
    case CLIENT_CREATE:
      return { ...state, loading: false };
    case VENDOR_CREATE:
      return { ...state, loading: false };
    case CLIENT_SAVE_SUCCESS:
      return INITIAL_STATE;
    case CLEAR_CLIENT_FORM:
      return INITIAL_STATE;
    default:
    return state;
  }
};
