import axios from 'axios';

export const PostApiMethod = (
  routeName: string,
  body: object,
  headers: {[index: string]: {[index: string]: string}} = {
    headers: {'Content-Type': 'application/json'},
  },
) => {
  return axios.post(
    process.env.REACT_APP_BASE_URL + routeName,
    JSON.stringify(body),
    headers,
  );
};

export const GetApiMethod = (routeName: string) => {
  return axios.get(process.env.REACT_APP_BASE_URL + routeName);
};

export const PutApiMethod = (routeName: string, body: object) => {
  return axios.put(
    process.env.REACT_APP_BASE_URL + routeName,
    JSON.stringify(body),
  );
};

export const DeleteApiMethod = (routeName: string) => {
  return axios.delete(process.env.REACT_APP_BASE_URL + routeName);
};
