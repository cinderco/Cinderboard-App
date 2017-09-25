import {
  ORDER_UPDATE,
  OUTGOING_CREATE,
  OUTGOING_SAVE_SUCCESS,
  INCOMING_CREATE,
  INCOMING_SAVE_SUCCESS,
  SHOW_MODAL_CHANGE,
  OUTGOING_ARCHIVE,
  INITIATE_SAVE,
  INITIATE_DELETE,
  DELETE_SUCCESS,
  CLEAR_FORM
} from '../actions/types';

const INITIAL_STATE = {
  companyName: '',
  type: '',
  newDate: '',
  loadingSave: false,
  loadingDelete: false,
  modalVisible: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ORDER_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case OUTGOING_CREATE:
      return INITIAL_STATE;
    case OUTGOING_ARCHIVE:
      return INITIAL_STATE;
    case INITIATE_SAVE:
      return { ...state, loadingSave: true };
    case INITIATE_DELETE:
      return { ...state, loadingDelete: true };
    case DELETE_SUCCESS:
      return { ...state, loadingDelete: false};
    case OUTGOING_SAVE_SUCCESS:
      return { loadingSave: false, modalVisible: false };
    case INCOMING_CREATE:
      return INITIAL_STATE;
    case INCOMING_SAVE_SUCCESS:
      return INITIAL_STATE;
    case CLEAR_FORM:
      return { ...INITIAL_STATE, orderType: action.payload.orderType };
    case SHOW_MODAL_CHANGE:
      return { ...state, modalVisible: true };
    default:
    return state;
  }
};
