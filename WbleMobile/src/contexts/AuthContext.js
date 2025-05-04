import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';
import {API_URL} from '@/config/config';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Configure axios instance
  const authAxios = axios.create({
    baseURL: API_URL,
  });

  // Add request interceptor
  // Attach token to every request
  authAxios.interceptors.request.use(
    async config => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error),
  );

  // Add response interceptor for token refresh
  // Automatically refresh token on 401 error
  // Retry original request with new token
  authAxios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      // If 401 error and not a login/refresh request
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/login') &&
        !originalRequest.url.includes('/auth/refresh')
      ) {
        originalRequest._retry = true;

        try {
          const newTokens = await refreshAuthToken();

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          await logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );

  const refreshAuthToken = async () => {
    try {
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      if (!storedRefreshToken) throw new Error('No refresh token available');

      const response = await authAxios.post('/auth/refresh', {
        refresh_token: storedRefreshToken,
      });

      const {access_token, refresh_token} = response.data.data;

      // Store new tokens
      await AsyncStorage.multiSet([
        ['userToken', access_token],
        ['refreshToken', refresh_token],
      ]);

      // Update state
      setUserToken(access_token);
      setRefreshToken(refresh_token);

      return {
        accessToken: access_token,
        refreshToken: refresh_token,
      };
    } catch (error) {
      console.log('Token refresh failed:', error);
      throw error;
    }
  };

  const login = async (username, password) => {
    setIsLoading(true);

    try {
      const response = await authAxios.post('/auth/login', {
        username,
        password,
      });

      const {access_token, refresh_token, user} = response.data.data;

      // Store tokens and user info
      await AsyncStorage.multiSet([
        ['userToken', access_token],
        ['refreshToken', refresh_token],
        ['userInfo', JSON.stringify(user)],
      ]);

      // Update state
      setUserToken(access_token);
      setRefreshToken(refresh_token);
      setUserInfo(user);

      console.log('Login successful:', response.data);
    } catch (error) {
      console.log('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('Logging out...');
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        await axios.post(
          '/auth/logout',
          {},
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
      }
      console.log('Logout successful');
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      // Clear all auth data regardless of API success
      await AsyncStorage.multiRemove(['userToken', 'refreshToken', 'userInfo']);
      setUserToken(null);
      setRefreshToken(null);
      setUserInfo(null);
      setIsLoading(false);
    }
  };

  const loadAuthData = async () => {
    try {
      setIsLoading(true);
      const [userToken, refreshToken, userInfo] = await AsyncStorage.multiGet([
        'userToken',
        'refreshToken',
        'userInfo',
      ]);

      if (userToken[1] && userInfo[1]) {
        setUserToken(userToken[1]);
        setRefreshToken(refreshToken[1]);
        setUserInfo(JSON.parse(userInfo[1]));
      }
    } catch (error) {
      console.log('Failed to load auth data:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuthData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoading,
        userToken,
        userInfo,
        authAxios, // Axios instance with auth interceptor
      }}>
      {children}
    </AuthContext.Provider>
  );
};
