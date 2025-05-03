import {View, Text} from 'react-native';
import React from 'react';

export default function WeekSection({item}) {
  return (
    <View style={{flex: 1, borderColor: 'black', borderWidth: 1, padding: 10}}>
      <Text>
        {item.start_date} - {item.end_date} (Week {item.week_number})
      </Text>
      {/* this view is just a line */}
      <View
        style={{
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
          marginVertical: 10,
        }}
      />
      <Text>Text content</Text>
      <View
        style={{
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
          marginVertical: 10,
        }}
      />
      <Text>Materials</Text>
    </View>
  );
}
