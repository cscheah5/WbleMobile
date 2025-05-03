import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function ItemCard({children, onPress, title}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          padding: 10,
          margin: 10,
          backgroundColor: 'gray',
          borderRadius: 10,
          flexDirection: 'row',
          fontSize: 20,
        }}>
        <Text style={{fontSize: 20}}>{title}</Text>
        {children}
      </View>
    </TouchableOpacity>
  );
}
