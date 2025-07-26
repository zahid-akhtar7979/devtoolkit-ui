import { NavigationItem } from '../types';

export interface ToolMetadata extends NavigationItem {
  category: 'encoding' | 'security' | 'conversion' | 'text' | 'image' | 'development' | 'file';
  usageFrequency: 'high' | 'medium' | 'low';
  keywords: string[];
  shortcut?: string;
}

export const TOOLS_METADATA: ToolMetadata[] = [
  // High frequency tools (top 5-6)
  {
    id: 'base64',
    label: 'Base64',
    path: '/base64',
    icon: 'Code',
    description: 'Encode and decode Base64 strings',
    category: 'encoding',
    usageFrequency: 'high',
    keywords: ['base64', 'encode', 'decode', 'encoding', 'base', '64'],
    shortcut: 'Ctrl+1'
  },
  {
    id: 'url',
    label: 'URL',
    path: '/url',
    icon: 'Link',
    description: 'Encode and decode URLs',
    category: 'encoding',
    usageFrequency: 'high',
    keywords: ['url', 'encode', 'decode', 'link', 'uri', 'percent'],
    shortcut: 'Ctrl+2'
  },
  {
    id: 'jwt',
    label: 'JWT',
    path: '/jwt',
    icon: 'Security',
    description: 'Decode and verify JWT tokens',
    category: 'security',
    usageFrequency: 'high',
    keywords: ['jwt', 'token', 'decode', 'verify', 'json', 'web', 'token', 'auth'],
    shortcut: 'Ctrl+3'
  },
  {
    id: 'uuid',
    label: 'UUID',
    path: '/uuid',
    icon: 'Tag',
    description: 'Generate UUIDs (v1, v4, v5)',
    category: 'development',
    usageFrequency: 'high',
    keywords: ['uuid', 'generate', 'guid', 'unique', 'identifier', 'v1', 'v4', 'v5'],
    shortcut: 'Ctrl+4'
  },
  {
    id: 'timestamp',
    label: 'Timestamp',
    path: '/timestamp',
    icon: 'Schedule',
    description: 'Convert Unix timestamps to readable dates',
    category: 'conversion',
    usageFrequency: 'high',
    keywords: ['timestamp', 'unix', 'time', 'date', 'convert', 'epoch'],
    shortcut: 'Ctrl+5'
  },
  {
    id: 'hash',
    label: 'Hash Generator',
    path: '/hash',
    icon: 'Fingerprint',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes',
    category: 'security',
    usageFrequency: 'high',
    keywords: ['hash', 'md5', 'sha1', 'sha256', 'sha512', 'checksum', 'fingerprint'],
    shortcut: 'Ctrl+6'
  },

  // Medium-high frequency tools
  {
    id: 'converter',
    label: 'JSON/YAML/XML',
    path: '/converter',
    icon: 'Transform',
    description: 'Convert between JSON, YAML, and XML',
    category: 'conversion',
    usageFrequency: 'medium',
    keywords: ['json', 'yaml', 'xml', 'convert', 'transform', 'format'],
    shortcut: 'Ctrl+7'
  },
  {
    id: 'regex',
    label: 'Regex Tester',
    path: '/regex',
    icon: 'Search',
    description: 'Test and validate regular expressions',
    category: 'text',
    usageFrequency: 'medium',
    keywords: ['regex', 'regexp', 'regular', 'expression', 'test', 'validate', 'pattern'],
    shortcut: 'Ctrl+8'
  },
  {
    id: 'diff',
    label: 'Text Diff',
    path: '/diff',
    icon: 'Compare',
    description: 'Advanced text comparison with multiple algorithms',
    category: 'text',
    usageFrequency: 'medium',
    keywords: ['diff', 'compare', 'text', 'difference', 'merge', 'patch']
  },

  // Medium frequency tools
  {
    id: 'compressor',
    label: 'Image Compressor',
    path: '/compressor',
    icon: 'Compress',
    description: 'Reduce image size without losing much quality',
    category: 'image',
    usageFrequency: 'medium',
    keywords: ['image', 'compress', 'optimize', 'reduce', 'size', 'quality']
  },
  {
    id: 'sql',
    label: 'SQL Formatter',
    path: '/sql',
    icon: 'Storage',
    description: 'Format and beautify SQL queries',
    category: 'development',
    usageFrequency: 'medium',
    keywords: ['sql', 'format', 'beautify', 'query', 'database']
  },
  {
    id: 'cron',
    label: 'CRON Expression',
    path: '/cron',
    icon: 'Timer',
    description: 'Evaluate and describe CRON expressions',
    category: 'development',
    usageFrequency: 'medium',
    keywords: ['cron', 'schedule', 'timer', 'job', 'expression', 'crontab']
  },
  {
    id: 'jasypt',
    label: 'Jasypt Encryption',
    path: '/jasypt',
    icon: 'Lock',
    description: 'Encrypt and decrypt text using Jasypt',
    category: 'security',
    usageFrequency: 'medium',
    keywords: ['jasypt', 'encrypt', 'decrypt', 'password', 'encryption']
  },

  // Lower frequency tools
  {
    id: 'image-to-pdf',
    label: 'Image to PDF',
    path: '/image-to-pdf',
    icon: 'PictureAsPdf',
    description: 'Convert multiple images to a single PDF document with drag & drop reordering',
    category: 'file',
    usageFrequency: 'low',
    keywords: ['image', 'pdf', 'convert', 'document', 'drag', 'drop']
  },
  {
    id: 'pdf-merger',
    label: 'PDF Merger',
    path: '/pdf-merger',
    icon: 'Merge',
    description: 'Merge multiple PDF documents into a single file',
    category: 'file',
    usageFrequency: 'low',
    keywords: ['pdf', 'merge', 'combine', 'join', 'document']
  },
  {
    id: 'image',
    label: 'Image Tools',
    path: '/image',
    icon: 'Image',
    description: 'Upload, preview, and convert images',
    category: 'image',
    usageFrequency: 'low',
    keywords: ['image', 'upload', 'preview', 'convert', 'photo']
  }
];

export const TOOL_CATEGORIES = {
  encoding: { label: 'Encoding & Decoding', icon: 'Code' },
  security: { label: 'Security & Hashing', icon: 'Security' },
  conversion: { label: 'Data Conversion', icon: 'Transform' },
  text: { label: 'Text Processing', icon: 'TextFields' },
  image: { label: 'Image Processing', icon: 'Image' },
  development: { label: 'Development Tools', icon: 'Terminal' },
  file: { label: 'File Operations', icon: 'Folder' }
};

// Get tools sorted by usage frequency
export const getToolsByFrequency = () => {
  const frequencyOrder = { high: 0, medium: 1, low: 2 };
  return [...TOOLS_METADATA].sort((a, b) => frequencyOrder[a.usageFrequency] - frequencyOrder[b.usageFrequency]);
};

// Get tools by category
export const getToolsByCategory = () => {
  return TOOLS_METADATA.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, ToolMetadata[]>);
};

// Get top tools for mobile
export const getTopTools = (count: number = 6) => {
  return TOOLS_METADATA
    .filter(tool => tool.usageFrequency === 'high')
    .slice(0, count);
}; 