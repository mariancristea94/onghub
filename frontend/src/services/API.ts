import { Auth } from 'aws-amplify';
import axios from 'axios';

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(async (request) => {
  // add auth header with jwt if account is logged in and request is to the api url
  const user = await Auth.currentAuthenticatedUser();

  if (!request.headers) {
    request.headers = {};
  }

  if (user?.getSignInUserSession()) {
    request.headers.Authorization = `Bearer ${user
      .getSignInUserSession()
      .getAccessToken()
      .getJwtToken()}`;
  }

  return request;
});

export default API;