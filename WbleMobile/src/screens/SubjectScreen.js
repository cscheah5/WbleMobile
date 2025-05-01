import {View, Text} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '@/contexts/AuthContext';
import {FlatList} from 'react-native-gesture-handler';

export default function SubjectScreen({route, navigation}) {
  const {subjectId, subjectCode, subjectName} = route.params;
  const {authAxios} = useContext(AuthContext);
  const [weekSections, setWeekSections] = useState([]);

  const _loadWeekSectionsBySubjectId = async () => {
    console.log('Fetching sections');
    const response = await authAxios.get(`/sections/${subjectId}`);
    console.log('Finish fetching sections');
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
    <View>
      <Text>
        {subjectCode} - {subjectName}
      </Text>
      <FlatList
        data={weekSections}
        renderItem={({item}) => (
          <View>
            <Text>
              {item.start_date} - {item.end_date} (Week {item.week_number})
            </Text>
          </View>
        )}
      />
    </View>
  );
}
