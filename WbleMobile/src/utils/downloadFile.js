import {Platform, Alert, PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import config from '@/config/config.json';

// Request storage permissions
export const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs access to your storage to download files',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.error('Permission request error:', err);
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
  let downloadPath = '';
  
  try {
    // Update downloading state if provided
    if (setDownloadingState) {
      setDownloadingState(prev => ({...prev, [material.id]: true}));
    }

    // Create a unique filename to prevent conflicts
    const uniqueFilename = `${material.id}_${material.filename}`;

    // Use the public download URL
    const url = `${config.laravelApiUrl}/public/materials/download/${material.id}`;
    console.log('Downloading from URL:', url);

    // Determine the download path
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
      connectionTimeout: 150000, // 150 seconds connection timeout
      readTimeout: 300000, // 300 seconds read timeout
      cacheable: false, // Don't use cache
      progressInterval: 1000, // Update progress every second
    }).promise;

    console.log('Download complete, response:', response);

    // Update downloading state if provided
    if (setDownloadingState) {
      setDownloadingState(prev => ({...prev, [material.id]: false}));
    }

    // Verify file exists before showing success
    const fileExists = await RNFS.exists(downloadPath);
    
    if (response.statusCode === 200 && fileExists) {
      // Check file size to make sure it's not empty
      const fileStats = await RNFS.stat(downloadPath);
      console.log(`Downloaded file size: ${fileStats.size} bytes`);
      
      if (fileStats.size > 0) {
        Alert.alert('Success', 'File downloaded successfully. The file can be found in YourDevice/Android/data/com.wblemobile/files');
        return true;
      } else {
        console.log('File exists but has zero size');
        throw new Error('Downloaded file has zero size');
      }
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

    // Before showing error, check if file exists and has content
    // This handles "end of stream" errors that occur after download completes
    if (downloadPath && error.message && error.message.includes('end of stream')) {
      try {
        const fileExists = await RNFS.exists(downloadPath);
        if (fileExists) {
          const fileStats = await RNFS.stat(downloadPath);
          if (fileStats.size > 0) {
            console.log(`File exists despite error. Size: ${fileStats.size} bytes`);
            Alert.alert('Success', 'File downloaded successfully. The file can be found in YourDevice/Android/data/com.wblemobile');
            return true;
          }
        }
      } catch (checkError) {
        console.log('Error checking file after download:', checkError);
      }
    }

    // Only show error alert if we didn't return success above
    Alert.alert(
      'Download Failed',
      'Could not download the file. Please try again.',
    );
    return false;
  }
};
