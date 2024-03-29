import axios from 'axios';

const apiEndpoint = 'http://localhost:8000';

export const getToken = () => {
  let demoV = JSON.parse(localStorage.getItem('democracy-viewer'));
  if (demoV && demoV.user) {
    return demoV.user.token;
  } else {
    return undefined;
  }
}

export const upload = (file) => new Promise((resolve, reject) => {
    axios.post(`${apiEndpoint}/datasets/`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${ getToken() }`
      }
    })
        .then(x => resolve(x.data))
        .catch(x => {
          alert(x);
          reject(x);
        });
});

export const getGraph = (dataset, groupName, groupList, metric, wordList) => new Promise((resolve, reject) => {
  var endpoint = `${apiEndpoint}/graphs/${dataset}?group_name=${groupName}` // Stores concatenated endpoint

  groupList.forEach((group) => { // Add all groups in groupList to endpoint
    console.log("Get graph test", group.value)
    endpoint += `&group_list=${group.value}`
  })

  // Add metric to endpoint
  endpoint += `&metric=${metric}`

  wordList.forEach((word) => { // Add all words in wordList to endpoint
    endpoint += `&word_list=${word}`
  })
  // Get graph from endpoint
  axios.get(endpoint, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${ getToken() }`
    }
  }).then(x => resolve(x.data)).catch(x => {
    alert(x);
    reject(x);
  });
});

export const getGroupNames = (dataset) => new Promise((resolve, reject) => {
  // Get graph from endpoint
  axios.get(`${apiEndpoint}/datasets/columns/${dataset}`, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${ getToken() }`
    }
  }).then(x => resolve(x.data)).catch(x => {
    alert(x);
    reject(x);
  });
});

//{{base_url}}/datasets/columns/{{hansard_1870}}/values/speaker
export const getColumnValues = (dataset, group) => new Promise((resolve, reject) => {
  // Get graph from endpoint
  axios.get(`${apiEndpoint}/datasets/columns/${dataset}/values/${group}`, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${ getToken() }`
    }
  }).then(x => resolve(x.data)).catch(x => {
    alert(x);
    reject(x);
  });
});

export const getRecordsByIds = (dataset, ids) => new Promise((resolve, reject) => {
  var endpoint = `${apiEndpoint}/datasets/ids/${dataset}?` // Stores concatenated endpoint

  ids.forEach((id) => { // Add all groups in groupList to endpoint
    endpoint += `id=${id}&`
  })
  endpoint = endpoint.slice(0, -1);

  axios.get(endpoint, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${ getToken() }`
    }
  }).then(x => resolve(x.data)).catch(x => {
    alert(x);
    reject(x);
  });
});