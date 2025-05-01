import React, {useContext, useState} from 'react';
import {Text, View, TouchableNativeFeedback} from 'react-native';
import {AuthContext} from '@/contexts/AuthContext';
import {FlatList} from 'react-native-gesture-handler';

const HomeScreen = ({navigation}) => {
  const {authAxios} = useContext(AuthContext);

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

  // TODO load subject for this student
  const _loadSubject = async () => {};

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 50}}>Home</Text>
      <FlatList
        data={subjectList}
        keyExtractor={item => item.subjectId}
        renderItem={({item}) => (
          <TouchableNativeFeedback
            onPress={() => {
              navigation.navigate('Subject', {
                subjectId: item.subjectId,
                subjectName: item.subjectName,
              });
            }}>
            <View
              style={{
                padding: 20,
                margin: 10,
                backgroundColor: '#f9c2ff',
                borderRadius: 10,
              }}>
              <Text style={{fontSize: 20}}>{item.subjectName}</Text>
            </View>
          </TouchableNativeFeedback>
        )}
      />
    </View>
  );
};

export default HomeScreen;
