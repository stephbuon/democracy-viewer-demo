import axios from "axios";

import { baseURL } from "./baseURL";
const baseEndpoint = `${ baseURL }/users`;

let apiConfig = {};

export const getUser = (username) => new Promise((resolve, reject) => {
    axios.get(`${ baseEndpoint }/${ username }`, apiConfig)
        .then(x => resolve(x.data))
        .catch(x => {
          alert(x);
          reject(x);
        });
});

export const updateUser = (username, params) => new Promise((resolve, reject) => {
  axios.put(`${ baseEndpoint }/${ username }`, params, apiConfig)
      .then(x => resolve(x.data))
      .catch(x => {
        alert(x);
        reject(x);
      });
});