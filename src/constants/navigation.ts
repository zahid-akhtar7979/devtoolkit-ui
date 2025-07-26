import { NavigationItem } from '../types';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'base64',
    label: 'Base64',
    path: '/base64',
    icon: 'Code',
    description: 'Encode and decode Base64 strings'
  },
  {
    id: 'hash',
    label: 'Hash Generator',
    path: '/hash',
    icon: 'Fingerprint',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes'
  },
  {
    id: 'jwt',
    label: 'JWT',
    path: '/jwt',
    icon: 'Security',
    description: 'Decode and verify JWT tokens'
  },
  {
    id: 'jasypt',
    label: 'Jasypt',
    path: '/jasypt',
    icon: 'Lock',
    description: 'Encrypt and decrypt text using Jasypt'
  },
  {
    id: 'url',
    label: 'URL',
    path: '/url',
    icon: 'Link',
    description: 'Encode and decode URLs'
  },
  {
    id: 'uuid',
    label: 'UUID',
    path: '/uuid',
    icon: 'Tag',
    description: 'Generate UUIDs (v1, v4, v5)'
  },
  {
    id: 'timestamp',
    label: 'Timestamp',
    path: '/timestamp',
    icon: 'Schedule',
    description: 'Convert Unix timestamps to readable dates'
  },
  {
    id: 'image',
    label: 'Image Converter',
    path: '/image',
    icon: 'Image',
    description: 'Convert images to Base64 and vice versa'
  },
  {
    id: 'regex',
    label: 'Regex',
    path: '/regex',
    icon: 'Search',
    description: 'Test and validate regular expressions'
  },
  {
    id: 'converter',
    label: 'Converter',
    path: '/converter',
    icon: 'Transform',
    description: 'Convert between JSON, YAML, and XML'
  },
  {
    id: 'diff',
    label: 'Advanced Diff',
    path: '/diff',
    icon: 'Compare',
    description: 'Advanced text comparison with multiple algorithms'
  },

  {
    id: 'cron',
    label: 'CRON',
    path: '/cron',
    icon: 'Timer',
    description: 'Evaluate and describe CRON expressions'
  },
  {
    id: 'compressor',
    label: 'Image Compressor',
    path: '/compressor',
    icon: 'Compress',
    description: 'Reduce photo file size without losing quality'
  },
  {
    id: 'sql',
    label: 'SQL',
    path: '/sql',
    icon: 'Storage',
    description: 'Format and beautify SQL queries'
  },
  {
    id: 'image-to-pdf',
    label: 'Photos to PDF',
    path: '/image-to-pdf',
    icon: 'PictureAsPdf',
    description: 'Convert photos to PDF documents with drag & drop reordering'
  },
  {
    id: 'pdf-merger',
    label: 'PDF Combiner',
    path: '/pdf-merger',
    icon: 'Merge',
    description: 'Combine multiple PDF files into one document'
  }
];

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://devtoolkit-backend-production.up.railway.app/api';
// For local development, uncomment the line below and comment the line above
// export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8080/api'; 