export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toISOString();
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatJson = (json: any): string => {
  return JSON.stringify(json, null, 2);
};

export const formatXml = (xml: string): string => {
  // Basic XML formatting
  return xml.replace(/>/g, '>\n').replace(/</g, '\n<');
}; 