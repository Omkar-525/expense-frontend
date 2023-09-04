// api/transactions.js
import axios from 'axios';

const BASE_URL = "http://localhost:8080/user/transaction"; 

export const getTransactions = async (token, month) => {
    try {
      const response = await axios.get(`${BASE_URL}/${month}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      return [];
    }
  };
