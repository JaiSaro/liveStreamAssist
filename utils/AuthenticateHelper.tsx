import {PostApiMethod} from './AxiosHelper';

export const authenticateAntMediaAPI = () => {
  return PostApiMethod('users/authenticate', {
    email: process.env.REACT_APP_USER_EMAIL,
    userType: process.env.REACT_APP_USER_TYPE_KEY,
    password: process.env.REACT_APP_HASH_KEY,
  });
};
