import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';
import config from '@/config/config.json';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loginError, setLoginError] = useState(false);

  const authAxios = axios.create({
    baseURL: config.laravelApiUrl,
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

      console.log('Token refreshed successfully:', response.data);

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
        await authAxios.post(
          `${config.laravelApiUrl}/auth/logout`
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

      const result = {
        userToken: userToken[1],
        refreshToken: refreshToken[1],
        userInfo: userInfo[1] ? JSON.parse(userInfo[1]) : null,
      };

      // Update state
      if (result.userToken) setUserToken(result.userToken);
      if (result.refreshToken) setRefreshToken(result.refreshToken);
      if (result.userInfo) setUserInfo(result.userInfo);

      console.log('Auth data loaded:', result);
      return result; // Return the loaded data
    } catch (error) {
      console.log('Failed to load auth data:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const initialize = async authData => {
    console.log('Initializing with:', authData);
    if (authData?.refreshToken) {
      try {
        console.log('Proactively refreshing token...');
        await refreshAuthToken();
      } catch (error) {
        console.log('Refresh failed:', error);
        if (error.response?.status) await clearAuthData();
      }
    } else {
      console.log('No refresh token available');
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      const authData = await loadAuthData();
      if (authData) await initialize(authData);
    };
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
