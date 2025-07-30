import apiClient from './api';
import { UuidRequest, UuidResponse } from '../types';

export const uuidService = {
  generate: async (request: UuidRequest): Promise<UuidResponse> => {
    const response = await apiClient.post('/uuidgenerator/generate', { payload: request });
    // Handle the specific UUID response structure with 'data' field
    return response.data.data || response.data.result;
  },

  generateMultiple: async (request: UuidRequest): Promise<UuidResponse> => {
    try {
      // Try the generate-multiple endpoint first
      const response = await apiClient.post('/uuidgenerator/generate-multiple', { payload: request });
      return response.data.data || response.data.result;
    } catch (error: any) {
      // If the endpoint doesn't exist (404), fallback to generating multiple single UUIDs
      if (error.status === 404 || error.response?.status === 404) {
        console.warn('generate-multiple endpoint not available, falling back to multiple single requests');
        
        const { type, count = 1 } = request;
        const uuids: string[] = [];
        
        // Generate multiple UUIDs by calling the single endpoint multiple times
        for (let i = 0; i < count; i++) {
          try {
            const singleResponse = await apiClient.post('/uuidgenerator/generate', { 
              payload: { type } 
            });
            const singleResult = singleResponse.data.data || singleResponse.data.result;
            if (singleResult?.uuid) {
              uuids.push(singleResult.uuid);
            }
          } catch (singleError) {
            console.error(`Failed to generate UUID ${i + 1}:`, singleError);
            // Continue with other UUIDs even if one fails
          }
        }
        
        if (uuids.length === 0) {
          throw new Error('Failed to generate any UUIDs');
        }
        
        return {
          type,
          uuid: null,
          uuids,
          count: uuids.length,
          success: true,
          message: `Generated ${uuids.length} UUIDs using fallback method`
        };
      }
      
      // Re-throw other errors
      throw error;
    }
  },
}; 