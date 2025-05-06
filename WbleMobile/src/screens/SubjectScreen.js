import {View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '@/contexts/AuthContext';
import {FlatList} from 'react-native-gesture-handler';
import WeekSection from '@/components/WeekSection';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SubjectScreen({route, navigation}) {
  const {subjectId, subjectCode, subjectName} = route.params;
  const {authAxios} = useContext(AuthContext);
  const [weekSections, setWeekSections] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [viewMode, setViewMode] = useState('current'); // 'current', 'all', 'materials'
  const [loading, setLoading] = useState(false);

  const loadCurrentWeek = async () => {
    setLoading(true);
    try {
      const response = await authAxios.get(`/sections/${subjectId}`);
      // Construct a complete section object with its materials and announcements
      const currentSection = {
        ...response.data.section,
        materials: response.data.materials || [],
        announcements: response.data.announcements || []
      };
      setWeekSections([currentSection]); // Wrap in array for FlatList
      setLoading(false);
      console.log("Current week loaded:", currentSection);
    } catch (error) {
      console.error("Error loading current week:", error);
      setLoading(false);
    }
  };

  const loadAllWeeks = async () => {
    setLoading(true);
    try {
      const response = await authAxios.get(`/sections/${subjectId}/all`);
      setWeekSections(response.data);
      setLoading(false);
      console.log("All weeks loaded:", response.data);
    } catch (error) {
      console.error("Error loading all weeks:", error);
      setLoading(false);
    }
  };

  const loadAllMaterials = async () => {
    setLoading(true);
    try {
      const response = await authAxios.get(`/sections/${subjectId}/materials`);
      setMaterials(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading materials:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: subjectName,
    });
    
    // Load default view (current week)
    loadCurrentWeek();
  }, []);

  useEffect(() => {
    // Change the data based on view mode
    if (viewMode === 'current') {
      loadCurrentWeek();
    } else if (viewMode === 'all') {
      loadAllWeeks();
    } else if (viewMode === 'materials') {
      loadAllMaterials();
    }
  }, [viewMode]);

  const renderViewOptions = () => (
    <View style={styles.viewOptions}>
      <TouchableOpacity 
        style={[styles.viewButton, viewMode === 'current' && styles.activeButton]} 
        onPress={() => setViewMode('current')}>
        <Text style={viewMode === 'current' ? styles.activeText : styles.viewButtonText}>Current Week</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.viewButton, viewMode === 'all' && styles.activeButton]} 
        onPress={() => setViewMode('all')}>
        <Text style={viewMode === 'all' ? styles.activeText : styles.viewButtonText}>All Weeks</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.viewButton, viewMode === 'materials' && styles.activeButton]} 
        onPress={() => setViewMode('materials')}>
        <Text style={viewMode === 'materials' ? styles.activeText : styles.viewButtonText}>All Materials</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return <Text style={styles.message}>Loading...</Text>;
    }

    if (viewMode === 'materials') {
      return materials.length > 0 ? (
        <FlatList
          data={materials}
          renderItem={({item}) => (
            <View style={styles.materialItem}>
              <View style={styles.materialContent}>
                <Text style={styles.materialTitle}>{item.filename}</Text>
                <Text style={styles.materialInfo}>
                  Week {item.week_number} • {item.type}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => downloadFile(item)}
              >
                <Ionicons name="cloud-download" size={22} color="white" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text style={styles.message}>No materials available</Text>
      );
    } else {
      return weekSections.length > 0 ? (
        <FlatList
          data={weekSections}
          renderItem={({item}) => <WeekSection item={item} />}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text style={styles.message}>No sections available</Text>
      );
    }
  };

  const downloadFile = async (material) => {
    try {
      // Same download implementation as in WeekSection
      // ...
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download Failed', 'Could not download the file. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subjectTitle}>
        {subjectCode} - {subjectName}
      </Text>
      {renderViewOptions()}
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  viewOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  viewButtonText: {
    color: '#333',
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  materialItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  materialContent: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  materialDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  materialInfo: {
    fontSize: 12,
    color: '#999',
  },
  downloadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  }
});
