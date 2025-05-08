import { Platform, Alert, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';

// Request storage permissions
export const requestStoragePermission = async () => {
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

/**
 * Download a file to the device
 * @param {Object} material - The material object to download
 * @param {Function} setDownloadingState - Function to update downloading state
 * @returns {Promise<void>}
 */
export const downloadFile = async (material, setDownloadingState = null) => {
  try {
    // Update downloading state if provided
    if (setDownloadingState) {
      setDownloadingState(prev => ({...prev, [material.id]: true}));
    }
    
    // Create a unique filename to prevent conflicts
    const uniqueFilename = `${material.id}_${material.filename}`;
    
    // Use the public download URL
    const url = `http://10.0.2.2:8000/api/public/materials/download/${material.id}`;
    console.log('Downloading from URL:', url);
    
    // Determine the download path
    let downloadPath;
    if (Platform.OS === 'android' && Platform.Version >= 29) {
      downloadPath = `${RNFS.ExternalDirectoryPath}/${uniqueFilename}`;
    } else {
      const hasPermission = await requestStoragePermission();
      downloadPath = hasPermission 
        ? `${RNFS.DownloadDirectoryPath}/${uniqueFilename}`
        : `${RNFS.DocumentDirectoryPath}/${uniqueFilename}`;
    }
    
    console.log('Downloading to path:', downloadPath);
    
    // Configure download with retry and timeout settings
    const response = await RNFS.downloadFile({
      fromUrl: url,
      toFile: downloadPath,
      background: true,
      discretionary: true,
      progressDivider: 20,
      connectionTimeout: 15000, // 15 seconds connection timeout
      readTimeout: 30000, // 30 seconds read timeout
      cacheable: false, // Don't use cache
      progressInterval: 1000, // Update progress every second
    }).promise;
    
    console.log('Download complete, response:', response);
    
    // Update downloading state if provided
    if (setDownloadingState) {
      setDownloadingState(prev => ({...prev, [material.id]: false}));
    }
    
    if (response.statusCode === 200) {
      Alert.alert('Success', 'File downloaded successfully.');
      return true;
    } else {
      Alert.alert('Download Failed', `Error code: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.error('Download error details:', error);
    
    // Update downloading state if provided
    if (setDownloadingState) {
      setDownloadingState(prev => ({...prev, [material.id]: false}));
    }
    
    Alert.alert('Download Failed', 'Could not download the file. Please try again.');
    return false;
  }
};