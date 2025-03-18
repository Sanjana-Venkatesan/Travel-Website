import axios from 'axios';
const baseUrl = 'http://localhost:3000/api/users'

const register = async (newUser) => {
  const response = await axios.post(baseUrl, newUser);
  return response.data;
};

export default register ;