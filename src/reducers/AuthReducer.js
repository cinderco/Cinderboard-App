import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  CONFIRM_PASSWORD_CHANGED,
  NAME_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  SIGNUP_USER_SUCCESS,
  LOGIN_USER,
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  error: '',
  loading: false,
  success: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EMAIL_CHANGED:
      return { ...state, email: action.payload };
    case PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case NAME_CHANGED:
      return { ...state, name: action.payload };
    case CONFIRM_PASSWORD_CHANGED:
      return { ...state, confirmPassword: action.payload };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        user: action.payload,
        success: 'Success!',
        error: ''
      };
    case LOGIN_USER_FAIL:
      return { ...state, error: 'Incorrect email or password', password: '' };
    case SIGNUP_USER_SUCCESS:
      return { ...state, success: true };
    case LOGIN_USER:
      return { ...state, loading: true, error: '' };
    default:
      return state;
  }
};
