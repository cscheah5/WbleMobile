/**
 * Groups materials by their type and sorts them in a predefined order
 * @param {Array} materials - The materials to group
 * @returns {Array} Formatted sections for SectionList
 */
export const groupMaterialsByType = (materials) => {
  // Create an object to store material groups
  const groupedByType = {};
  
  // Sort the materials by type
  materials.forEach(material => {
    const type = material.type || 'others';
    if (!groupedByType[type]) {
      groupedByType[type] = [];
    }
    groupedByType[type].push(material);
  });
  
  // Define the order of types
  const typeOrder = ['lecture', 'tutorial', 'practical', 'others'];
  
  // Sort the keys based on the defined order
  const sortedTypes = Object.keys(groupedByType).sort((a, b) => {
    const indexA = typeOrder.indexOf(a.toLowerCase());
    const indexB = typeOrder.indexOf(b.toLowerCase());
    
    // If type not in our predefined order, put it at the end
    const orderA = indexA === -1 ? 999 : indexA;
    const orderB = indexB === -1 ? 999 : indexB;
    
    return orderA - orderB;
  });
  
  // Convert to format required by SectionList, maintaining the sorted order
  return sortedTypes.map(type => ({
    title: formatMaterialType(type),
    data: groupedByType[type]
  }));
};

/**
 * Formats material type for display
 * @param {string} type - The material type
 * @returns {string} Formatted display text
 */
export const formatMaterialType = (type) => {
  // Capitalize first letter and handle specific types
  switch (type.toLowerCase()) {
    case 'lecture':
      return 'Lecture Materials';
    case 'tutorial':
      return 'Tutorial Materials';
    case 'practical':
      return 'Practical Materials';
    case 'others':
      return 'Other Materials';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1) + ' Materials';
  }
};

/**
 * Returns the appropriate icon name for file type
 * @param {string} filename - The filename to check
 * @returns {string} Ionicons icon name
 */
export const getFileIcon = (filename) => {
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