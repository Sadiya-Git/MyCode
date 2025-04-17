// reducers/userReducer.js

import { SET_DOMAIN_CERTIFICATES } from './actions'; // Update the path accordingly

const initialState = {
  domainCertificates: {
    certificates:[]
  },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DOMAIN_CERTIFICATES:
      return {
        ...state,
        certificates: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
