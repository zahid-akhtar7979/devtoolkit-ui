import apiClient from './api';

export interface ImageToPdfRequest {
  images: File[];
  outputFileName?: string;
  pageSize?: string;
}

export interface ImageToPdfResponse {
  success: boolean;
  error?: string;
  message?: string;
  // Flat structure properties (if response contains them directly)
  pdfContent?: string;
  fileName?: string;
  fileSize?: number;
  totalPages?: number;
  imagesProcessed?: number;
  // Nested structure (if response contains them in a 'data' property)
  data?: {
    success: boolean;
    message?: string;
    pdfContent?: string;
    fileName?: string;
    fileSize?: number;
    totalPages?: number;
    imagesProcessed?: number;
  };
}

const createFormData = (data: ImageToPdfRequest): FormData => {
  const formData = new FormData();
  
  // Add images
  data.images.forEach((image) => {
    formData.append('images', image);
  });
  
  // Add other parameters
  if (data.outputFileName) {
    formData.append('outputFileName', data.outputFileName);
  }
  if (data.pageSize) {
    formData.append('pageSize', data.pageSize);
  }
  
  return formData;
};

export const imageToPdfService = {
  async convertToPdf(request: ImageToPdfRequest): Promise<{ data: ImageToPdfResponse }> {
    const formData = createFormData(request);
    const response = await apiClient.post('/image-to-pdf/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Helper method to download PDF
  downloadPdf(pdfContent: string, filename: string = 'images-to-pdf.pdf'): void {
    const byteCharacters = atob(pdfContent);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
