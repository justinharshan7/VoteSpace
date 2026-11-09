import axios from 'axios';

const API_BASE = `http://${window.location.hostname}:5000`;
const API_URL = `${API_BASE}/polls`;

export const createPoll = async (question, options) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    API_URL,
    { question, options },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getPoll = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    timeout: 10000
  });
  return response.data;
};

export const votePoll = async (id, optionIndex) => {
  const response = await axios.post(`${API_URL}/${id}/vote`, { optionIndex });
  return response.data;
};

export const registerUser = async (username, password) => {
  const response = await axios.post(`${API_BASE}/auth/register`, { username, password });
  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_BASE}/auth/login`, { username, password });
  return response.data;
};

export const getMyPolls = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/mine`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};