import httpClient from '../../../shared/services/httpClient';

interface ImageToPdfRequest {
  images: File[];
  outputFileName?: string;
  pageSize?: string;
}

interface ImageToPdfResponse {
  pdfContent: string;
  fileName: string;
  fileSize: number;
  totalPages: number;
  imagesProcessed: number;
  pageSize: string;
  success: boolean;
  message: string;
}

export const imagetopdfService = {
  convert: async (request: ImageToPdfRequest): Promise<ImageToPdfResponse> => {
    const formData = new FormData();
    
    request.images.forEach((image, index) => {
      formData.append('images', image);
    });
    
    if (request.outputFileName) {
      formData.append('outputFileName', request.outputFileName);
    }
    
    if (request.pageSize) {
      formData.append('pageSize', request.pageSize);
    }

    const response = await httpClient.post<ImageToPdfResponse>('/imagetopdf/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
}; 