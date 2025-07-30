import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '../../env';

// Backend response format - handle both documented and actual formats
interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR';
  result?: T;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  errors?: any;
}

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        if (import.meta.env.DEV) {
          console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
        }
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (import.meta.env.DEV) {
          console.log('API Response:', response.status, response.data);
        }
        return response;
      },
      (error) => {
        console.error('Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  private handleApiResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    const { status, result, data, error, errors } = response.data;
    
    if (status === 'ERROR') {
      const errorMessage = error?.message || errors?.message || 'An error occurred';
      throw new Error(errorMessage);
    }
    
    if (status === 'SUCCESS') {
      // Handle both documented format (result) and actual format (data)
      const responseData = result || data;
      if (responseData !== undefined) {
        return responseData;
      }
    }
    
    throw new Error('Unexpected response format');
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return this.handleApiResponse(response);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return this.handleApiResponse(response);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return this.handleApiResponse(response);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return this.handleApiResponse(response);
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return this.handleApiResponse(response);
  }
}

export const httpClient = new HttpClient();
export default httpClient; 