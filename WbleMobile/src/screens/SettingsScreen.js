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
    darkMode: false,
    notifications: true,
    fontSize: 'medium',
    language: 'en',
    vibration: true,
    autoSync: true,
    dataUsage: 'medium',
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
        console.log('Settings file exists, loading...');
        console.log('Settings file path:', settingsPath);
        const fileContents = await RNFS.readFile(settingsPath);
        const loadedSettings = JSON.parse(fileContents);
        setSettings(loadedSettings);
      } else {
        console.log('Settings file does not exist, creating default...');
        console.log('Default setting path:', settingsPath);
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
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
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

  const getLanguageName = code => {
    const languages = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
    };
    return languages[code] || code;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6da7" />
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
                color="#4a6da7"
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{false: '#e0e0e0', true: '#a0b6d9'}}
              thumbColor={settings.darkMode ? '#4a6da7' : '#f4f3f4'}
              ios_backgroundColor="#e0e0e0"
              value={settings.darkMode}
              onValueChange={value => handleSettingChange('darkMode', value)}
            />
          </View>

          {/* Font Size Setting */}
          <View style={styles.settingItemColumn}>
            <View style={styles.settingInfo}>
              <Icon
                name="format-size"
                size={22}
                color="#4a6da7"
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Font Size</Text>
            </View>
            <View style={styles.radioGroup}>
              {['small', 'medium', 'large'].map(size => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.radioButton,
                    settings.fontSize === size && styles.radioButtonSelected,
                  ]}
                  onPress={() => handleSettingChange('fontSize', size)}>
                  <Text
                    style={[
                      styles.radioButtonText,
                      settings.fontSize === size &&
                        styles.radioButtonSelectedText,
                    ]}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.settingSection}>
          <Text style={styles.sectionHeader}>Notifications</Text>

          {/* Notifications Setting */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon
                name="notifications"
                size={22}
                color="#4a6da7"
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Enable Notifications</Text>
            </View>
            <Switch
              trackColor={{false: '#e0e0e0', true: '#a0b6d9'}}
              thumbColor={settings.notifications ? '#4a6da7' : '#f4f3f4'}
              ios_backgroundColor="#e0e0e0"
              value={settings.notifications}
              onValueChange={value =>
                handleSettingChange('notifications', value)
              }
            />
          </View>

          {/* Vibration Setting */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon
                name="vibration"
                size={22}
                color="#4a6da7"
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Vibration Feedback</Text>
            </View>
            <Switch
              trackColor={{false: '#e0e0e0', true: '#a0b6d9'}}
              thumbColor={settings.vibration ? '#4a6da7' : '#f4f3f4'}
              ios_backgroundColor="#e0e0e0"
              value={settings.vibration}
              onValueChange={value => handleSettingChange('vibration', value)}
            />
          </View>
        </View>

        <View style={styles.settingSection}>
          <Text style={styles.sectionHeader}>General</Text>

          {/* Auto Sync Setting */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon
                name="sync"
                size={22}
                color="#4a6da7"
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Auto Sync</Text>
            </View>
            <Switch
              trackColor={{false: '#e0e0e0', true: '#a0b6d9'}}
              thumbColor={settings.autoSync ? '#4a6da7' : '#f4f3f4'}
              ios_backgroundColor="#e0e0e0"
              value={settings.autoSync}
              onValueChange={value => handleSettingChange('autoSync', value)}
            />
          </View>

          {/* Language Setting */}
          <View style={styles.settingItemColumn}>
            <View style={styles.settingInfo}>
              <Icon
                name="language"
                size={22}
                color="#4a6da7"
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Language</Text>
            </View>
            <View style={styles.languageGrid}>
              {['en', 'es', 'fr', 'de'].map(lang => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.languageButton,
                    settings.language === lang && styles.languageButtonSelected,
                  ]}
                  onPress={() => handleSettingChange('language', lang)}>
                  <Text
                    style={[
                      styles.languageButtonText,
                      settings.language === lang &&
                        styles.languageButtonSelectedText,
                    ]}>
                    {getLanguageName(lang)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Data Usage Setting */}
          <View style={styles.settingItemColumn}>
            <View style={styles.settingInfo}>
              <Icon
                name="data-usage"
                size={22}
                color="#4a6da7"
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Data Usage</Text>
            </View>
            <View style={styles.radioGroup}>
              {['low', 'medium', 'high'].map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.radioButton,
                    settings.dataUsage === level && styles.radioButtonSelected,
                  ]}
                  onPress={() => handleSettingChange('dataUsage', level)}>
                  <Text
                    style={[
                      styles.radioButtonText,
                      settings.dataUsage === level &&
                        styles.radioButtonSelectedText,
                    ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
              color="#4a6da7"
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
    color: '#4a6da7',
    fontSize: 16,
  },
  scrollContent: {
    paddingVertical: 15,
  },
  header: {
    backgroundColor: '#4a6da7',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitle: {
    color: '#fff',
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
    color: '#fff',
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
    color: '#4a6da7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(74, 109, 167, 0.05)',
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
  settingItemColumn: {
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
  radioGroup: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'flex-start',
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f7',
  },
  radioButtonSelected: {
    backgroundColor: '#4a6da7',
    borderColor: '#4a6da7',
  },
  radioButtonText: {
    color: '#555',
    fontSize: 14,
  },
  radioButtonSelectedText: {
    color: '#fff',
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  languageButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f7',
    minWidth: '45%',
    alignItems: 'center',
  },
  languageButtonSelected: {
    backgroundColor: '#4a6da7',
    borderColor: '#4a6da7',
  },
  languageButtonText: {
    color: '#555',
  },
  languageButtonSelectedText: {
    color: '#fff',
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
    backgroundColor: 'rgba(74, 109, 167, 0.08)',
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
