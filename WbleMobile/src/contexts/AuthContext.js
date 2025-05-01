import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';
import {API_URL} from '@/config/config';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const login = (username, password) => {
    setIsLoading(true);

    axios
      .post(`${API_URL}/auth/login`, {
        username,
        password,
      })
      .then(response => {
        console.log(response.data);

        let userToken = response.data.data.access_token;
        let userInfo = response.data.data.user;

        setUserToken(userToken);
        setUserInfo(userInfo);

        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        AsyncStorage.setItem('userToken', userToken);
        console.log('userInfo', userInfo);
        console.log('userToken', userToken);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const logout = () => {
    setIsLoading(true);

    AsyncStorage.getItem('userToken')
      .then(token => {
        return axios.post(
          `${API_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      })
      .then(() => {
        setUserToken(null);
        setUserInfo(null);
        console.log('Logout successful');
        return AsyncStorage.multiRemove(['userInfo', 'userToken']);
      })
      .catch(error => {
        console.log('Logout error:', error);
        setUserToken(null);
        setUserInfo(null);
        return AsyncStorage.multiRemove(['userInfo', 'userToken']);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getToken = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem('userInfo');
      let userToken = await AsyncStorage.getItem('userToken');
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
        setUserToken(userToken);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{login, logout, isLoading, userToken, userInfo}}>
      {children}
    </AuthContext.Provider>
  );
};
