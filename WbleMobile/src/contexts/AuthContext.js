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
  const [loginError, setLoginError] = useState(false);

  const authAxios = axios.create({
    baseURL: API_URL,
  });

  // Request interceptor
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

  // Response interceptor
  authAxios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/login') &&
        !originalRequest.url.includes('/auth/refresh')
      ) {
        originalRequest._retry = true;

        try {
          console.log('Refreshing token...');
          const newTokens = await refreshAuthToken();
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return authAxios(originalRequest);
        } catch (refreshError) {
          console.log('Refresh failed, logging out...');
          await clearAuthData();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );

  const clearAuthData = async () => {
    await AsyncStorage.multiRemove(['userToken', 'refreshToken', 'userInfo']);
    setUserToken(null);
    setRefreshToken(null);
    setUserInfo(null);
  };

  const refreshAuthToken = async () => {
    try {
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      if (!storedRefreshToken) throw new Error('No refresh token available');

      const response = await authAxios.post('/auth/refresh', {
        refresh_token: storedRefreshToken,
      });

      const {access_token, refresh_token} = response.data.data;

      await AsyncStorage.multiSet([
        ['userToken', access_token],
        ['refreshToken', refresh_token],
      ]);

      setUserToken(access_token);
      setRefreshToken(refresh_token);

      return {
        accessToken: access_token,
        refreshToken: refresh_token,
      };
    } catch (error) {
      console.log('Token refresh failed:', error);
      await clearAuthData();
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

      await AsyncStorage.multiSet([
        ['userToken', access_token],
        ['refreshToken', refresh_token],
        ['userInfo', JSON.stringify(user)],
      ]);

      setUserToken(access_token);
      setRefreshToken(refresh_token);
      setUserInfo(user);

      console.log('Login successful:', response.data);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.log('Login error:', error);
      setLoginError(true);
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid credentials',
      };
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
          `${API_URL}/auth/logout`,
          {},
          {headers: {Authorization: `Bearer ${token}`}},
        );
      }
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      await clearAuthData();
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
    } finally {
      setIsLoading(false);
    }
  };

  const initialize = async () => {
    if (refreshToken) {
      try {
        console.log('Proactively refreshing token on app start...');
        await refreshAuthToken();
        console.log('Token refreshed successfully on app start');
      } catch (error) {
        console.log('Failed to refresh token on app start:', error);
        // If refresh fails with a real auth error (not network), clear auth data
        if (error.response && error.response.status) {
          console.log('Clearing auth data due to refresh failure');
          await clearAuthData();
        }
      }
    }
  }

  useEffect(() => {
    const bootstrap = async () => {
      await loadAuthData();
      await initialize();
    }

    bootstrap();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoading,
        userToken,
        userInfo,
        authAxios,
        loginError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
