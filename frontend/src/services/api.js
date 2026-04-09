import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  predictCrop: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Prediction Error:", error);
      throw error;
    }
  },

  getHistory: async () => {
    try {
      const response = await apiClient.get('/api/v1/history');
      return response.data;
    } catch (error) {
      console.error("History Fetch Error:", error);
      return []; // Return empty if error or not implemented
    }
  }
};

export default apiService;
