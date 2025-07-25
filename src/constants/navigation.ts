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
    label: 'Image',
    path: '/image',
    icon: 'Image',
    description: 'Upload, preview, and convert images'
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
    id: 'pdf-merger',
    label: 'PDF Merger',
    path: '/pdf-merger',
    icon: 'PictureAsPdf',
    description: 'Merge multiple PDFs into a single document'
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
    description: 'Reduce image size without losing much quality'
  },
  {
    id: 'sql',
    label: 'SQL',
    path: '/sql',
    icon: 'Storage',
    description: 'Format and beautify SQL queries'
  }
];

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8080/api'; 