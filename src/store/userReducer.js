// reducers/userReducer.js

import { SET_USER_PROFILE } from './actions'; // Update the path accordingly

const initialState = {
  userProfile: {
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    country: '',
    postal_code: '',
    about_me: '',
  },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
