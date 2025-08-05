// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API client with token handling
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint);
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Auth API
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (profileData) => apiClient.put('/auth/profile', profileData),
  logout: () => {
    apiClient.setToken(null);
    return Promise.resolve({ success: true });
  }
};

// Schedules API
export const schedulesAPI = {
  getSchedules: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/schedules${queryString ? `?${queryString}` : ''}`);
  },
  createSchedule: (scheduleData) => apiClient.post('/schedules', scheduleData),
  updateSchedule: (scheduleData) => apiClient.post('/schedules', scheduleData),
  getTeamSchedules: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/schedules/team${queryString ? `?${queryString}` : ''}`);
  },
  submitSchedule: (scheduleId) => apiClient.put(`/schedules/${scheduleId}/submit`),
  approveSchedule: (scheduleId, approvalData) => apiClient.put(`/schedules/${scheduleId}/approve`, approvalData)
};

// Polls API
export const pollsAPI = {
  getPolls: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/polls${queryString ? `?${queryString}` : ''}`);
  },
  createPoll: (pollData) => apiClient.post('/polls', pollData),
  votePoll: (pollId, voteData) => apiClient.post(`/polls/${pollId}/vote`, voteData),
  deletePoll: (pollId) => apiClient.delete(`/polls/${pollId}`)
};

// Weather API
export const weatherAPI = {
  getWeather: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/weather?${queryString}`);
  }
};

// Export the API client for token management
export { apiClient };

// Socket.io client setup
let socket = null;

export const initializeSocket = (token) => {
  if (typeof window !== 'undefined') {
    import('socket.io-client').then(({ io }) => {
      socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: {
          token
        }
      });

      socket.on('connect', () => {
        console.log('Connected to server');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    });
  }
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};