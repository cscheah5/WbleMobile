import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, PermissionsAndroid, Platform} from 'react-native';
import React, {useState} from 'react';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function WeekSection({item}) {
  const [downloading, setDownloading] = useState({});

  // Format dates for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Request storage permissions
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "App needs access to your storage to download files",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error("Permission request error:", err);
      return false;
    }
  };

  const downloadFile = async (material) => {
    try {
      console.log('Starting download process...');
      
      // For Android 10+ (API 29+), use app storage 
      // For older versions, use download directory if permission granted
      const isAndroid10OrHigher = Platform.OS === 'android' && Platform.Version >= 29;
      let downloadPath;
      
      if (isAndroid10OrHigher) {
        try {
          // Use the shared Documents directory which is more accessible
          downloadPath = `${RNFS.ExternalDirectoryPath}/${material.filename}`;
          console.log('Using external app directory:', downloadPath);
        } catch (error) {
          downloadPath = `${RNFS.DocumentDirectoryPath}/${material.filename}`;
          console.log('Fallback to document directory:', downloadPath);
        }
      } else {
        // Older Android versions need permission for external storage
        let hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        
        if (!hasPermission) {
          hasPermission = await requestStoragePermission();
        }
        
        if (!hasPermission) {
          // Fall back to app storage if permission denied
          downloadPath = `${RNFS.DocumentDirectoryPath}/${material.filename}`;
          console.log('Permission denied, using app storage:', downloadPath);
        } else {
          // Use download directory if permission granted
          downloadPath = `${RNFS.DownloadDirectoryPath}/${material.filename}`;
          console.log('Using download directory:', downloadPath);
        }
      }
      
      setDownloading({...downloading, [material.id]: true});
      
      // Start download
      console.log('Downloading from URL:', material.download_url);
      
      const response = await RNFS.downloadFile({
        fromUrl: material.download_url,
        toFile: downloadPath,
        background: true,
        progressDivider: 10,
      }).promise;
      
      console.log('Download complete, response:', response);
      setDownloading({...downloading, [material.id]: false});
      
      if (response.statusCode === 200) {
        let alertMessage = '';
        
        if (isAndroid10OrHigher || !await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        )) {
          alertMessage = `${material.filename} has been downloaded to app storage. You can find it in the "Files" app under "Internal storage > Android > data > your.app.package > files"`;
        } else {
          alertMessage = `${material.filename} has been downloaded to your Downloads folder.`;
        }
        
        Alert.alert('Download Complete', alertMessage);
        
      } else {
        Alert.alert('Download Failed', `Error code: ${response.statusCode}`);
      }
    } catch (error) {
      console.error('Download error details:', error);
      setDownloading({...downloading, [material.id]: false});
      Alert.alert('Download Failed', 'Could not download the file. Please try again.');
    }
  };

  const renderAnnouncement = ({item: announcement}) => (
    <View style={styles.announcementItem}>
      <Text style={styles.itemTitle}>{announcement.title}</Text>
      <Text style={styles.itemDescription}>{announcement.description}</Text>
      <Text style={styles.itemDate}>Posted: {formatDate(announcement.created_at)}</Text>
    </View>
  );

  const renderMaterial = ({item: material}) => (
    <View style={styles.materialItem}>
      <View style={styles.materialContent}>
        
        <Text style={styles.fileInfo}>
          <Ionicons 
            name={getFileIcon(material.filename)} 
            size={16} 
            color="#555" 
          /> {material.filename}
        </Text>
      </View>
      <TouchableOpacity 
        style={[
          styles.downloadButton, 
          downloading[material.id] && styles.downloadingButton
        ]}
        onPress={() => downloadFile(material)}
        disabled={downloading[material.id]}
      >
        <Ionicons 
          name={downloading[material.id] ? "cloud-download-outline" : "cloud-download"} 
          size={22} 
          color="white" 
        />
      </TouchableOpacity>
    </View>
  );

  // Helper to get icon based on file extension
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch(ext) {
      case 'pdf': return 'document-text-outline';
      case 'doc':
      case 'docx': return 'document-outline';
      case 'ppt':
      case 'pptx': return 'easel-outline';
      case 'xls':
      case 'xlsx': return 'grid-outline';
      case 'zip':
      case 'rar': return 'archive-outline';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'image-outline';
      default: return 'document-outline';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.weekHeader}>
        Week {item.week_number}: {formatDate(item.start_date)} - {formatDate(item.end_date)}
      </Text>
      
      {/* Announcements Section */}
      <Text style={styles.sectionHeader}>Announcements</Text>
      {item.announcements && item.announcements.length > 0 ? (
        <FlatList
          data={item.announcements}
          renderItem={renderAnnouncement}
          keyExtractor={(announcement) => announcement.id.toString()}
          scrollEnabled={false} // Prevents nested scrolling issues
        />
      ) : (
        <Text style={styles.emptyMessage}>No announcements for this week</Text>
      )}
      
      <View style={styles.divider} />
      
      {/* Materials Section */}
      <Text style={styles.sectionHeader}>Materials</Text>
      {item.materials && item.materials.length > 0 ? (
        <FlatList
          data={item.materials}
          renderItem={renderMaterial}
          keyExtractor={(material) => material.id.toString()}
          scrollEnabled={false} // Prevents nested scrolling issues
        />
      ) : (
        <Text style={styles.emptyMessage}>No materials for this week</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  weekHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#444',
  },
  divider: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  announcementItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginVertical: 5,
  },
  materialItem: {
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  materialContent: {
    flex: 1,
    paddingRight: 10,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  itemDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  fileInfo: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },
  emptyMessage: {
    fontStyle: 'italic',
    color: '#999',
    padding: 10,
    textAlign: 'center',
  },
  downloadButton: {
    backgroundColor: '#4285F4',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadingButton: {
    backgroundColor: '#ccc',
  },
});
