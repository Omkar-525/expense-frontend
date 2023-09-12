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

export const getAllTransactionsWithoutMonth = async(token) => {
  try {
    const response = await axios.get(`${BASE_URL}/allTransaction`, {
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

export const getAllTransactions = async (token, month) => {
  try {
    const response = await axios.get(`${BASE_URL}/all/${month}`, {
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

export const createTransaction = async (token, transactionData) => {
    try {
      const response = await axios.post(BASE_URL, transactionData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      return null;
    }
};
export const deleteTransaction = async (token, transactionId) => {
  const response = await axios.delete(`${BASE_URL}/${transactionId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

