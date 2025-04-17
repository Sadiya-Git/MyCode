import { LOGOUT } from "store/actions";
// import axios from 'axios';
// import configData from '../../../config';

const logout = async (token, dispatcher) => {
  try {
    // await axios.post(configData.API_SERVER + 'users/logout', {}, {
    //   headers: { Authorization: 'Bearer ' + token },
    // });
    dispatcher({
      type: LOGOUT,
    });
  } catch (error) {
    // Handle errors here
    dispatcher({
      type: LOGOUT,
    });
    console.error('Logout failed:', error);
  }
};

export default logout;
