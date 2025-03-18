import axios from 'axios';

const baseUrl = 'http://localhost:3000/api/hotel';

const getHotels = async () => {
    try {
        const response = await axios.get(baseUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching hotels:', error);
        throw error;
    }
};

const getHotelbyid = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/${id}`);
        return response.data;
    }catch (error) {
        console.error('Error fetching hotels:', error);
        throw error;
    }
};


export default {getHotels,getHotelbyid}