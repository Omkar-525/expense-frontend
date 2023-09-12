import axios from 'axios';  

const BASE_URL = 'http://localhost:8080/user/split';  

export const fetchSplits = () => {
    const token = localStorage.getItem('jwt');
    
    return axios.get(`${BASE_URL}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 200 && response.data && Array.isArray(response.data.data)) {
                return response.data.data;
            }
            throw new Error('Invalid response format from server.');
        })
        .catch(handleError);
};

export const fetchSplitDetails = (splitId) => {
    const token = localStorage.getItem('jwt');
    
    return axios.get(`${BASE_URL}/${splitId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 200 && response.data && typeof response.data.data === 'object') {
                return response.data.data;
            }
            throw new Error('Invalid response format from server.');
        })
        .catch(handleError);
};

export const createSplit = async (splitData) => {
    const token = localStorage.getItem('jwt');
    
    try {
        const response = await axios.post(`${BASE_URL}`, splitData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Refactor error handling to avoid redundancy
const handleError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(`Error: ${error.response.data.message || 'Server Error'}`);
    } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from server.');
    } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Error: ${error.message}`);
    }
};
// ...existing imports...
const getAuthHeaders = () => {
    const token = localStorage.getItem('jwt');
    return {
        'Authorization': `Bearer ${token}`
    };
};

export const addTransaction = async (splitId, transaction) => {
    try {
        const response = await axios.post(`${BASE_URL}/${splitId}/transactions`, transaction, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteTransaction = async (splitId, transactionId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${splitId}/transaction/${transactionId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const addUserToSplit = async (splitId, user) => {
    try {
        const response = await axios.put(`${BASE_URL}/addUsers/${splitId}`, user, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const finalizeSplit = async (splitId) => {
    try {
        const response = await axios.put(`${BASE_URL}/${splitId}/finalize`, null, {  // Assuming no data needs to be sent with finalize
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const fetchTransactionsOfSplit = async (splitId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${splitId}/transactions`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const fetchDebtSummary = async (splitId)=>{
    try{
        const response = await axios.get(`${BASE_URL}/${splitId}/debts`,{
            headers: getAuthHeaders() 
        });
        return response.data;

    }catch (error) {
        handleError(error);
    }
}
