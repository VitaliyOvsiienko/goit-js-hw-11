import axios from "axios";



axios.defaults.baseURL = 'https://pixabay.com/api/'

export async function getData(params) {
    try {
        const response = await axios.get(`?${params}`)
        return response.data;
    } catch (error) {
        throw error
    }
 }