import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePermission } from '@/contexts/PermissionContext';
import { downloadFile } from '@/utils/downloadFile';
import { getFileIcon } from '@/utils/sortMaterials';

export default function WeekSection({
  item,
  onAddAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  onAddMaterial,
  onEditMaterial,
  onDeleteMaterial
}) {
  const [downloading, setDownloading] = useState({});
  
  const { can } = usePermission();

  // Format dates for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderAnnouncement = ({item: announcement}) => (
    <View style={styles.announcementItem}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{announcement.title}</Text>
        <Text style={styles.itemDescription}>{announcement.description}</Text>
        <Text style={styles.itemDate}>Posted: {formatDate(announcement.created_at)}</Text>
      </View>
      
      {/* Show edit/delete buttons only if functions are provided */}
      {(onEditAnnouncement || onDeleteAnnouncement) && (
        <View style={styles.actionButtons}>
          {onEditAnnouncement && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEditAnnouncement(announcement)}>
              <Ionicons name="create-outline" size={20} color="white" />
            </TouchableOpacity>
          )}
          
          {onDeleteAnnouncement && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDeleteAnnouncement(announcement.id)}>
              <Ionicons name="trash-outline" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const renderMaterial = ({item: material}) => (
    <View style={styles.materialItem}>
      <View style={styles.materialContent}>
        <Text style={styles.itemTitle}>{material.filename}</Text>
        <Text style={styles.fileInfo}>
          <Ionicons 
            name={getFileIcon(material.filename)} 
            size={16} 
            color="#555" 
          /> {material.filename}
        </Text>
      </View>
      
      <View style={styles.actionButtons}>
        {/* Always show download button */}
        <TouchableOpacity 
          style={[styles.actionButton, styles.downloadButton, downloading[material.id] && styles.downloadingButton]}
          onPress={() => downloadFile(material, setDownloading)}
          disabled={downloading[material.id]}>
          <Ionicons 
            name={downloading[material.id] ? "cloud-download-outline" : "cloud-download"} 
            size={22} 
            color="white" 
          />
        </TouchableOpacity>
        
        {/* Only show edit/delete if handlers provided */}
        {onEditMaterial && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEditMaterial(material)}>
            <Ionicons name="create-outline" size={20} color="white" />
          </TouchableOpacity>
        )}
        
        {onDeleteMaterial && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDeleteMaterial(material.id)}>
            <Ionicons name="trash-outline" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.weekHeader}>
          Week {item.week_number}: {formatDate(item.start_date)} - {formatDate(item.end_date)}
        </Text>
      </View>
      
      {/* Announcements Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        
        {/* Add announcement button */}
        {onAddAnnouncement && (
          <TouchableOpacity 
            style={styles.addItemButton}
            onPress={onAddAnnouncement}>
            <Ionicons name="add-circle-outline" size={24} color="#28a745" />
            <Text style={styles.addItemText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {item.announcements && item.announcements.length > 0 ? (
        <FlatList
          data={item.announcements}
          renderItem={renderAnnouncement}
          keyExtractor={(announcement) => announcement.id.toString()}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.emptyMessage}>No announcements for this week</Text>
      )}
      
      <View style={styles.divider} />
      
      {/* Materials Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Materials</Text>
        
        {/* Add material button */}
        {onAddMaterial && (
          <TouchableOpacity 
            style={styles.addItemButton}
            onPress={onAddMaterial}>
            <Ionicons name="add-circle-outline" size={24} color="#28a745" />
            <Text style={styles.addItemText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {item.materials && item.materials.length > 0 ? (
        <FlatList
          data={item.materials}
          renderItem={renderMaterial}
          keyExtractor={(material) => material.id.toString()}
          scrollEnabled={false}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionActions: {
    flexDirection: 'row',
    width: 70,
    justifyContent: 'space-between',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  downloadButton: {
    backgroundColor: '#4285F4',
  },
  downloadingButton: {
    backgroundColor: '#ccc',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addItemText: {
    color: '#28a745',
    marginLeft: 5,
  },
  itemContent: {
    flex: 1,
  },
});
