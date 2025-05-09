import { DrawerActions } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = ({navigation}) => {
  // Default settings
  const defaultSettings = {
    friendRequestNotifications: true,
    chatNotifications: true,
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [saveIndicator, setSaveIndicator] = useState(false);

  // Path for settings file
  const settingsPath = `${RNFS.DocumentDirectoryPath}/settings.json`;

  // Load settings from file
  const loadSettings = async () => {
    try {
      setIsLoading(true);
      // Check if file exists
      const fileExists = await RNFS.exists(settingsPath);

      if (fileExists) {
        console.log('Settings file path:', settingsPath);
        const fileContents = await RNFS.readFile(settingsPath);
        const loadedSettings = JSON.parse(fileContents);
        console.log('Loaded settings:', loadedSettings);
        setSettings(loadedSettings);
      } else {
        // Create file with default settings if it doesn't exist
        await RNFS.writeFile(
          settingsPath,
          JSON.stringify(defaultSettings),
          'utf8',
        );
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert(
        'Error Loading Settings',
        'Could not load your settings. Default settings will be used.',
        [{text: 'OK'}],
      );
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings to file
  const saveSettings = async newSettings => {
    try {
      setSaveIndicator(true);
      await RNFS.writeFile(settingsPath, JSON.stringify(newSettings), 'utf8');
      // Show save indicator briefly
      setTimeout(() => setSaveIndicator(false), 800);
      console.log('Settings saved:', newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert(
        'Error Saving Settings',
        'Could not save your settings. Please try again.',
        [{text: 'OK'}],
      );
      setSaveIndicator(false);
    }
  };

  // Handle setting changes
  const handleSettingChange = (key, value) => {
    const newSettings = {...settings, [key]: value};
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Reset to default settings
  const resetToDefaults = async () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default values?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setSettings(defaultSettings);
            await saveSettings(defaultSettings);
          },
        },
      ],
    );
  };

  // Setup navigation header
  useEffect(() => {
    navigation.setOptions({
      title: 'Settings',
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () =>
        saveIndicator ? (
          <View style={styles.saveIndicator}>
            <Icon name="check-circle" size={20} color="#4cd964" />
            <Text style={styles.saveText}>Saved</Text>
          </View>
        ) : null,
    });
  }, [navigation, saveIndicator]);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.settingSection}>
          <Text style={styles.sectionHeader}>Display</Text>

          {/* Dark Mode Setting */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon
                name="brightness-6"
                size={22}
                color="#007bff"
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{false: '#e0e0e0', true: '#80bdff'}}
              thumbColor={settings.darkMode ? '#007bff' : '#f4f3f4'}
              ios_backgroundColor="#e0e0e0"
              value={settings.darkMode}
              onValueChange={value => handleSettingChange('darkMode', value)}
            />
          </View>
        </View>

        <View style={styles.settingSection}>
          <Text style={styles.sectionHeader}>Notifications</Text>

          {/* Friend Request Notifications */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon
                name="person-add"
                size={22}
                color="#007bff"
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Friend Request Notifications</Text>
            </View>
            <Switch
              trackColor={{false: '#e0e0e0', true: '#80bdff'}}
              thumbColor={settings.friendRequestNotifications ? '#007bff' : '#f4f3f4'}
              ios_backgroundColor="#e0e0e0"
              value={settings.friendRequestNotifications}
              onValueChange={value => handleSettingChange('friendRequestNotifications', value)}
            />
          </View>

          {/* Chat Notifications */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon
                name="chat"
                size={22}
                color="#007bff"
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Chat Notifications</Text>
            </View>
            <Switch
              trackColor={{false: '#e0e0e0', true: '#80bdff'}}
              thumbColor={settings.chatNotifications ? '#007bff' : '#f4f3f4'}
              ios_backgroundColor="#e0e0e0"
              value={settings.chatNotifications}
              onValueChange={value => handleSettingChange('chatNotifications', value)}
            />
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {/* Reset Button */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetToDefaults}>
            <Icon
              name="restore"
              size={20}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.resetButtonText}>
              Reset to Default Settings
            </Text>
          </TouchableOpacity>

          {/* Storage info */}
          <TouchableOpacity style={styles.storageButton} onPress={() => {}}>
            <Icon
              name="storage"
              size={20}
              color="#007bff"
              style={styles.buttonIcon}
            />
            <Text style={styles.storageButtonText}>
              Settings stored at: {settingsPath}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  scrollContent: {
    paddingVertical: 15,
  },
  header: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  headerLeft: {
    marginLeft: 10,
    padding: 5,
  },
  saveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 10,
  },
  saveText: {
    color: '#000',
    marginLeft: 5,
    fontSize: 12,
  },
  settingSection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 123, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  actionsContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  resetButton: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  storageButton: {
    marginTop: 5,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 123, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageButtonText: {
    color: '#666',
    fontSize: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default SettingsScreen;