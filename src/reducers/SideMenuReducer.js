import {
  TOGGLE_SIDE_MENU
} from '../actions/types';

const INITIAL_STATE = {
  isOpen: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_SIDE_MENU:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
