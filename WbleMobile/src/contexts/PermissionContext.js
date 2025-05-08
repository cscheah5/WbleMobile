import React, { createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const PermissionContext = createContext({});

export const PermissionProvider = ({ children }) => {
  const { userInfo } = useContext(AuthContext);
  
  const can = (action) => {
    const role = userInfo?.role || 'guest';
    
    const permissions = {
      'lecturer': {
        // Remove section management permissions
        'create:section': false,
        'edit:section': false,
        'delete:section': false,
        // Keep other lecturer permissions
        'create:announcement': true,
        'edit:announcement': true,
        'delete:announcement': true,
        'create:material': true,
        'edit:material': true,
        'delete:material': true,
        'download:material': true,
        'view:weeks': true,
      },
      'student': {
        'download:material': true,
        'view:weeks': true,
        'view:current_week': true,
        'view:materials': true,
      },
      'guest': {}
    };
    
    return permissions[role]?.[action] || false;
  };

  return (
    <PermissionContext.Provider value={{ can }}>
      {children}
    </PermissionContext.Provider>
  );
};

// Custom hook for easy access
export const usePermission = () => useContext(PermissionContext);