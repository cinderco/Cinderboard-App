import {
  NOTE_UPDATE,
  NOTE_CREATE,
  NOTE_SAVE_SUCCESS,
  NOTE_BEING_CREATED,
  CLEAR_NOTE_FORM
} from '../actions/types';

const INITIAL_STATE = {
  note: '',
  newDate: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTE_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case NOTE_BEING_CREATED:
      return { ...state, loading: true };
    case NOTE_CREATE:
      return { ...state, loading: false };
    case NOTE_SAVE_SUCCESS:
      return INITIAL_STATE;
    case CLEAR_NOTE_FORM:
      return INITIAL_STATE;
    default:
    return state;
  }
};
