const axios = require('axios');
import {BASE_URL} from 'react-native-dotenv';

export const PostApiMethod = (
  routeName: string,
  body: object,
  headers: {[index: string]: {[index: string]: string}} = {headers: {}},
) => {
  return axios.post(BASE_URL + routeName, JSON.stringify(body), headers);
};

export const GetApiMethod = (routeName: string) => {
  return axios.get(BASE_URL + routeName);
};

export const PutApiMethod = (routeName: string, body: object) => {
  return axios.put(BASE_URL + routeName, JSON.stringify(body));
};

export const DeleteApiMethod = (routeName: string) => {
  return axios.delete(BASE_URL + routeName);
};
