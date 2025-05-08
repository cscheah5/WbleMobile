import React, {useContext, useEffect, useState} from 'react';
import {Text, View, TouchableNativeFeedback, Button} from 'react-native';
import {AuthContext} from '@/contexts/AuthContext';
import {FlatList} from 'react-native-gesture-handler';
import notifee from '@notifee/react-native';

const HomeScreen = ({navigation}) => {
  const {authAxios, userInfo} = useContext(AuthContext);

  const [subjectList, setSubjectList] = useState([]);

  //TODO: try catch block for error handling
  const _loadSubjectById = async () => {
    const response = await authAxios.get(`/subjects/${userInfo.id}`);
    setSubjectList(response.data);
    // console.log('subjectList', response.data);
  };

  useEffect(() => {
    // Load subject list from API
    _loadSubjectById();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 50}}>Home</Text>
      {/* <View
        style={{
          borderColor: 'black',
          borderWidth: 1,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('Friend')}>
        <Text>Friends</Text>
        <Ionicons name="people-outline" size={25} color="black" />
      </View> */}
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
                backgroundColor: 'lightblue',
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
