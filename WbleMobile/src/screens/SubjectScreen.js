import React, { useContext, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Alert, SectionList } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { usePermission } from '@/contexts/PermissionContext';
import { FlatList } from 'react-native-gesture-handler';
import WeekSection from '@/components/WeekSection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { downloadFile } from '@/utils/downloadFile';
import { groupMaterialsByType, getFileIcon } from '@/utils/sortMaterials';

export default function SubjectScreen({ route, navigation }) {
  const { subjectId, subjectCode, subjectName } = route.params;
  const { authAxios, userInfo } = useContext(AuthContext);
  const { can } = usePermission();
  const [weekSections, setWeekSections] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // Default to 'all'
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState({}); // Add this state variable
  
  const [isLecturer, setIsLecturer] = useState(false);
  const [userInfoReady, setUserInfoReady] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: subjectName,
      headerRight: undefined
    });

    if (userInfo) {
      setIsLecturer(userInfo.role === 'lecturer');
      setUserInfoReady(true);
    }
    
    if (!isLecturer && can('view:current_week')) {
      setViewMode('current');
    } else {
      setViewMode('all');
    }
  }, [isLecturer, can, subjectName]);

  const loadCurrentWeek = async () => {
    setLoading(true);
    try {
      const response = await authAxios.get(`/sections/${subjectId}`);
      // Construct a complete section object
      const currentSection = {
        ...response.data.section,
        materials: response.data.materials || [],
        announcements: response.data.announcements || []
      };
      setWeekSections([currentSection]);
      setLoading(false);
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
    if (!userInfoReady) return;

    if (viewMode === 'current') {
      loadCurrentWeek();
    } else if (viewMode === 'all') {
      loadAllWeeks();
    } else if (viewMode === 'materials') {
      loadAllMaterials();
    }
  }, [viewMode, userInfoReady]);

  const renderViewOptions = () => (
    <View style={styles.viewOptions}>
      {/* Only show Current Week for students */}
      {!isLecturer && (
        <TouchableOpacity 
          style={[styles.viewButton, viewMode === 'current' && styles.activeButton]} 
          onPress={() => setViewMode('current')}>
          <Text style={viewMode === 'current' ? styles.activeText : styles.viewButtonText}>
            Current Week
          </Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={[styles.viewButton, viewMode === 'all' && styles.activeButton]} 
        onPress={() => setViewMode('all')}>
        <Text style={viewMode === 'all' ? styles.activeText : styles.viewButtonText}>
          All Weeks
        </Text>
      </TouchableOpacity>
      
      {/* Only show Materials for students */}
      {!isLecturer && (
        <TouchableOpacity 
          style={[styles.viewButton, viewMode === 'materials' && styles.activeButton]} 
          onPress={() => setViewMode('materials')}>
          <Text style={viewMode === 'materials' ? styles.activeText : styles.viewButtonText}>
            All Materials
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return <Text style={styles.message}>Loading...</Text>;
    }

    if (viewMode === 'materials') {
      return materials.length > 0 ? (
        <SectionList
          sections={groupMaterialsByType(materials)}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.materialItem}>
              <View style={styles.materialContent}>
                <View style={styles.fileIconTitleRow}>
                  <Ionicons 
                    name={getFileIcon(item.filename)} 
                    size={22} 
                    color="#555" 
                    style={styles.fileIcon}
                  />
                  <Text style={styles.materialTitle}>{item.filename}</Text>
                </View>
                <Text style={styles.materialInfo}>
                  Week {item.week_number} 
                  {item.description ? ` • ${item.description}` : ''}
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.downloadButton, downloading[item.id] && styles.downloadingButton]}
                onPress={() => downloadFile(item, setDownloading)}
                disabled={downloading[item.id]}>
                <Ionicons 
                  name={downloading[item.id] ? "cloud-download-outline" : "cloud-download"} 
                  size={22} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
          )}
          renderSectionHeader={({section: {title}}) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          )}
          stickySectionHeadersEnabled={true}
        />
      ) : (
        <Text style={styles.message}>No materials available</Text>
      );
    } else {
      return weekSections.length > 0 ? (
        <FlatList
          data={weekSections}
          renderItem={({item}) => (
            <WeekSection 
              item={item}
              // Announcement management
              onAddAnnouncement={isLecturer ? () => handleAddAnnouncement(item.id) : undefined}
              onEditAnnouncement={isLecturer ? (announcement) => handleEditAnnouncement(announcement) : undefined}
              onDeleteAnnouncement={isLecturer ? (announcementId) => handleDeleteAnnouncement(announcementId) : undefined}
              // Material management
              onAddMaterial={isLecturer ? () => handleAddMaterial(item.id) : undefined}
              onEditMaterial={isLecturer ? (material) => handleEditMaterial(material) : undefined}
              onDeleteMaterial={isLecturer ? (materialId) => handleDeleteMaterial(materialId) : undefined}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.message}>No sections available</Text>
        </View>
      );
    }
  };

  
  const handleAddAnnouncement = (sectionId) => {
    navigation.navigate('AnnouncementForm', {
      sectionId: sectionId,
      onAnnouncementCreated: loadAllWeeks
    });
  };
  
  const handleEditAnnouncement = (announcement) => {
    navigation.navigate('AnnouncementForm', {
      announcement: announcement,
      onAnnouncementUpdated: loadAllWeeks
    });
  };
  
  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      await authAxios.delete(`/announcements/${announcementId}`);
      loadAllWeeks();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      Alert.alert("Error", "Failed to delete announcement");
    }
  };
  
  const handleAddMaterial = (sectionId) => {
    navigation.navigate('MaterialForm', {
      sectionId: sectionId,
      onMaterialCreated: loadAllWeeks
    });
  };
  
  const handleEditMaterial = (material) => {
    navigation.navigate('MaterialForm', {
      material: material,
      onMaterialUpdated: loadAllWeeks
    });
  };
  
  const handleDeleteMaterial = async (materialId) => {
    try {
      await authAxios.delete(`/materials/${materialId}`);
      loadAllWeeks();
      Alert.alert("Success", "Material deleted successfully");
    } catch (error) {
      console.error("Error deleting material:", error);
      Alert.alert("Error", "Failed to delete material");
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
    backgroundColor: 'white',
  },
  materialContent: {
    flex: 1,
  },
  fileIconTitleRow: { 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  fileIcon: { 
    marginRight: 10,
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
  downloadingButton: { 
    backgroundColor: '#ccc',
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  createButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionHeader: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
    marginVertical: 5,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
