import axios from 'axios';

const BASE_URL = 'http://localhost:8080/user';

export const searchUsers = async (query) => {
  // Retrieve the JWT token from local storage or other storage methods you're using
  const token = localStorage.getItem('jwt');

  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};
