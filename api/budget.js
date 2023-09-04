// api/budget.js
import axios from 'axios';

const BASE_URL = "http://localhost:8080/user/budget"; // replace with your Spring Boot server URL

export const getBudget = async (token) => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching budget data:", error);
    return null;
  }
};

export const createBudget = async (token, month, budgetAmount) => {
  try {
    const response = await axios.post(BASE_URL, 
      {
        month: month,
        budget: budgetAmount
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating budget:", error);
    return null;
  }
};
