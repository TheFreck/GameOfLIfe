import axios from 'axios';

export const useAxios = (url) => {
    const get = async (path,yeah, nah) => {
        try {
            const response = await axios.get(`${url}${path}`);
            if (yeah) yeah(response.data);
            return response.data;
        } catch (nope) {
            if (nah) nah(nope);
            else throw nope;
        }
    };

    const getWithUrl = async (path, yeah, nah) => {
        try {
            const response = await axios.get(`${url}${path}`);
            if (yeah) yeah(response.data);
            return response.data;
        } catch (nope) {
            if (nah) nah(nope);
            else throw nope;
        }
    };

    const post = async (path, data, yeah, nah) => {
        try {
            const response = await axios.post(`${url}${path}`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (yeah) yeah(response.data);
            } catch (nope) {
            if (nah) nah(nope);
            else throw nope;
        }
    };

    return {
        get,
        getWithUrl,
        post,
    };
};

export default useAxios;