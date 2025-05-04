import {View, Text, SafeAreaView} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '@/contexts/AuthContext';
import {FlatList} from 'react-native-gesture-handler';
import WeekSection from '@/components/WeekSection';

export default function SubjectScreen({route, navigation}) {
  const {subjectId, subjectCode, subjectName} = route.params;
  const {authAxios} = useContext(AuthContext);
  const [weekSections, setWeekSections] = useState([]);

  //TODO: try catch block for error handling
  const _loadWeekSectionsBySubjectId = async () => {
    const response = await authAxios.get(`/sections/${subjectId}`);
    setWeekSections(response.data);
    console.log('weekSections', response.data);
  };

  useEffect(() => {
    navigation.setOptions({
      title: subjectName,
    });
    // Load week sections from API
    _loadWeekSectionsBySubjectId();
  }, []);

  return (
    <SafeAreaView style={{paddingBottom: 20}}>
      <Text>
        {subjectCode} - {subjectName}
      </Text>
      <FlatList
        data={weekSections}
        renderItem={({item}) => <WeekSection item={item} />}
      />
    </SafeAreaView>
  );
}
