import axios from 'axios';

var token;
const apiEndpoint = 'http://classroomdb.smu.edu:55433';
var apiConfig;

export const getToken = () => {
  return token;
}

export const upload = (file) => new Promise((resolve, reject) => {
    axios.post(`${apiEndpoint}/datasets/`, file, apiConfig, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
        .then(x => resolve(x.data))
        .catch(x => {
          alert(x);
          reject(x);
        });
});

export const uploadMetadata = (data) => new Promise((resolve, reject) => {
  axios.post(`${apiEndpoint}/datasets/metadata/`, data, apiConfig)
      .then(x => resolve(x.data))
      .catch(x => {
        alert(x);
        reject(x);
      });
});

export const register = (user) => new Promise((resolve, reject) => {
  axios.post(`${apiEndpoint}/users/`, user, apiConfig)
      .then(x => resolve(x.data))
      .catch(x => {
          alert(x);
          reject(x);
      });
});

export const login = (info, setLogin=undefined) => new Promise((resolve, reject) => {
  axios.post(`${apiEndpoint}/session/`, info, apiConfig)
      .then(x => {
        token = x.data;
        apiConfig = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        resolve(x.data);
        if(setLogin){
          setLogin(true);
        }
      })
      .catch(x => {
        if(setLogin){
          setLogin(false);
        }
        reject(x);
      });
});

export const getUser = () => new Promise((resolve, reject) => {
  axios.get(`${apiEndpoint}/session/`, apiConfig)
      .then(x => resolve(x.data))
      .catch(x => {
        alert(x);
        reject(x);
      });
});