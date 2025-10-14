export const getStorageValue = (key, defaultValue) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  }
  return defaultValue;
};

export const setStorageValue = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Sabit değerler için
export const STORAGE_KEYS = {
  PAT: 'azure_pat',
  ORGANIZATION: 'azure_organization'
}; 
