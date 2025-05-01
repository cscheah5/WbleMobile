import React, {useContext, useEffect, useState} from 'react';
import {Text, View, TouchableNativeFeedback} from 'react-native';
import {AuthContext} from '@/contexts/AuthContext';
import {FlatList} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({navigation}) => {
  const {authAxios, userInfo} = useContext(AuthContext);

  const [subjectList, setSubjectList] = useState([
    {
      subjectId: 'UECS2433',
      subjectName: 'Wireless Application Development',
    },
    {
      subjectId: 'UECS2434',
      subjectName: 'Mobile Application Development',
    },
    {
      subjectId: 'UECS2435',
      subjectName: 'Web Application Development',
    },
    {
      subjectId: 'UECS2436',
      subjectName: 'Cloud Computing',
    },
    {
      subjectId: 'UECS2437',
      subjectName: 'Artificial Intelligence',
    },
    {
      subjectId: 'UECS2438',
      subjectName: 'Machine Learning',
    },
  ]);

  const _loadSubjectById = async () => {
    const response = await authAxios.get(`/subjects/${userInfo.id}`);
    setSubjectList(response.data);
    console.log('subjectList', response.data);
  };

  useEffect(() => {
    // Load subject list from API
    _loadSubjectById();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 50}}>Home</Text>
      <FlatList
        data={subjectList}
        renderItem={({item}) => (
          <TouchableNativeFeedback
            onPress={() => {
              navigation.navigate('Subject', {
                subjectId: item.id,
                subjectName: item.name,
                subjectCode: item.code,
              });
            }}>
            <View
              style={{
                padding: 20,
                margin: 10,
                backgroundColor: '#f9c2ff',
                borderRadius: 10,
              }}>
              <Text style={{fontSize: 20}}>{item.code}</Text>
              <Text style={{fontSize: 20}}>{item.name}</Text>
            </View>
          </TouchableNativeFeedback>
        )}
      />
    </View>
  );
};

export default HomeScreen;
