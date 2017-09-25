import {
  SET_IS_OPEN
} from '../actions/types';

const INITIAL_STATE = {
  isOpen: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_IS_OPEN:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
