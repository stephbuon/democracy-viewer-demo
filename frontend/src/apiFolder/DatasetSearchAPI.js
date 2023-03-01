import axios from 'axios';

export const BACKEND_ENDPOINT = "http://localhost:8000";

export const FilterDatasets = async (params) =>  {
    console.log("Filtering Datasets", params);
    // console.log(`GET  -  ${BACKEND_ENDPOINT}/datasets/filter?type=${params.type}${params.searchTerm}`)

    let res;
    if(params.advanced)
    {
        //ADVANCED SEARCH
        res = await axios.get(`${BACKEND_ENDPOINT}/datasets/filter?type=${params.type}${params.title}${params.description}${params.username}${params.tags}`);
    }
    else
    {
        //SIMPLE SEARCH
        res = await axios.get(`${BACKEND_ENDPOINT}/datasets/filter?type=${params.type}${params.searchTerm}`);
    }
    if(res.status !== 200){
        console.log(`Couldn't get datasets information. ${res.status}`, params)
        return null;
    }
    console.log("Returning", res.data);
    return res.data;
};

export const GetAllTags = async () =>  {
    console.log("Getting Tags");
    const res = await axios.get(`${BACKEND_ENDPOINT}/datasets/tags/unique`);
    if(res.status !== 200){
        console.log(`Couldn't get tags. ${res.status}`)
        return null;
    }
    console.log("Returning", res.data);
    return res.data;
};
