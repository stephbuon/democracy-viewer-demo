import axios from 'axios';

const apiEndpoint = 'http://localhost:8000';

export const samlTest = () => new Promise((resolve, reject) => {
    axios({
        method: "GET",
        url: `${ apiEndpoint }/saml`,
        withCredentials: true
    }).then(x => resolve(x.data))
    .catch(x => reject(x));
});