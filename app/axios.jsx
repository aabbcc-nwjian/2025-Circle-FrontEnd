import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('token');
    return value;
  } catch (error) {
    console.log('Error retrieving token:', error);
    throw error;
  }
};

const createApi = async () => {
  const token = await getToken();
  return axios.create({
    baseURL: 'http://112.126.68.22:8080',
    timeout: 10000,
    headers: {
      "Authorization": `${token}`
    }
  });
};

export const Get = async (path, params = {}) => {
  try {
    const api = await createApi();
    const response = await api.get(path, { params });
    return response.data;
  } catch (error) {
    console.error('Error in GET request:', error);
    throw error;
  }
};

export const Post = async (path, data = {}) => {
  try {
    const api = await createApi();
    const response = await api.post(path, data);
    return response.data;
  } catch (error) {
    console.error('Error in POST request:', error);
    throw error;
  }
};

export const Put = async (path, data = {}) => {
  try {
    const api = await createApi();
    const response = await api.put(path, data);
    return response.data;
  } catch (error) {
    console.error('Error in PUT request:', error);
    throw error;
  }
};

export const Del = async (path, params = {}) => {
  try {
    const api = await createApi();
    const response = await api.delete(path, { params });
    return response.data;
  } catch (error) {
    console.error('Error in DELETE request:', error);
    throw error;
  }
};
