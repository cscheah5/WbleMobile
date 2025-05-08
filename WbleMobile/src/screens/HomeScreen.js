import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
  Text,
  View,
  TouchableNativeFeedback,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import {AuthContext} from '@/contexts/AuthContext';
import {FlatList} from 'react-native-gesture-handler';
import {AppButton} from '@/components/AppButton';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  const {authAxios, userInfo} = useContext(AuthContext);
  const [subjectList, setSubjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const _loadSubjectById = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAxios.get(`/subjects/${userInfo.id}`);
      setSubjectList(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load subjects');
      console.error('Error loading subjects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    _loadSubjectById();
  }, [])
);

  const renderSubjectItem = ({item}) => (
    <TouchableNativeFeedback
      onPress={() => {
        navigation.navigate('Subject', {
          subjectId: item.id,
          subjectName: item.name,
          subjectCode: item.code,
        });
      }}
      onLongPress={() => {
        Alert.alert(
          'Course Description',
          item.description ?? 'No description available',
        );
      }}>
      <View style={styles.subjectCard}>
        <Text style={styles.subjectCode}>{item.code}</Text>
        <Text style={styles.subjectName}>{item.name}</Text>
      </View>
    </TouchableNativeFeedback>
  );

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading subjects...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <AppButton title="Retry" onPress={_loadSubjectById} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.header}>My Subjects</Text>
      {subjectList.length > 0 ? (
        <FlatList
          data={subjectList}
          renderItem={renderSubjectItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>No subjects found</Text>
          <AppButton title="Refresh" onPress={_loadSubjectById} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  subjectCard: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  subjectCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 5,
  },
  subjectName: {
    fontSize: 16,
    color: '#555',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
