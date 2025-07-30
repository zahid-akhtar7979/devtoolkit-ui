// API Response types
export interface ApiResponse<T = any> {
  status: 'SUCCESS' | 'ERROR';
  result?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Base64 types
export interface Base64Request {
  text: string;
  operation: 'encode' | 'decode';
}

export interface Base64Response {
  encodedText?: string;
  decodedText?: string;
  originalText?: string;
  operation?: string;
  success?: boolean;
  message?: string;
}

// Hash types
export interface HashRequest {
  text: string;
  algorithm?: string;
}

export interface HashResponse {
  originalText?: string;
  algorithm?: string;
  hash?: string;
  specificHash?: string;
  hashes?: Record<string, string> | null;
  success?: boolean;
  message?: string;
}

// JWT types
export interface JwtRequest {
  token: string;
  secret?: string;
}

export interface JwtResponse {
  header?: any;
  payload?: any;
  signature?: string;
  valid?: boolean;
  claims?: any;
  success?: boolean;
  message?: string;
  // Legacy support for old nested structure
  decoded?: {
    header: any;
    payload: any;
    signature: string;
  };
}

// Jasypt types
export interface JasyptRequest {
  text: string;
  password: string;
  algorithm: string;
}

export interface JasyptResponse {
  originalText?: string;
  encryptedText?: string;
  decryptedText?: string;
  algorithm?: string;
  success?: boolean;
  message?: string;
}

// Cron types
export interface CronRequest {
  expression: string;
  count?: number;
}

export interface CronResponse {
  cronExpression?: string;
  nextExecutions?: string[];
  description?: string;
  valid?: boolean;
  success?: boolean;
  message?: string;
}

// UUID types
export interface UuidRequest {
  type?: string;
  count?: number;
}

export interface UuidResponse {
  type?: string;
  uuid?: string | null;
  uuids?: string[];
  count?: number;
  success?: boolean;
  message?: string;
}

// Utility types
export interface UtilityRequest {
  text?: string;
  operation?: 'encode' | 'decode';
  encoding?: string;
  type?: string;
  count?: number;
  sourceFormat?: string;
  targetFormat?: string;
  timestamp?: string;
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  text1?: string;
  text2?: string;
  sql?: string;
  dialect?: string;
  pattern?: string;
  testText?: string;
  diffType?: string;
  contextLines?: number;
}

// Enhanced Diff types
export interface DiffRequest {
  text1: string;
  text2: string;
  ignoreCase?: boolean;
  ignoreWhitespace?: boolean;
  ignoreLineEndings?: boolean;
  contextLines?: number;
  diffType?: 'TEXT' | 'JSON' | 'XML' | 'CODE';
}

export interface DiffResponse {
  success?: boolean;
  error?: string;
  identical?: boolean;
  length1?: number;
  length2?: number;
  differences?: string;
  // Advanced diff properties
  unifiedDiff?: string;
  sideBySide?: {
    comparison: Array<{
      lineNumber: number;
      left: string;
      right: string;
      status: string;
      cssClass?: string;
      leftHighlights?: Array<{
        start: number;
        end: number;
        type: string;
        cssClass: string;
      }>;
      rightHighlights?: Array<{
        start: number;
        end: number;
        type: string;
        cssClass: string;
      }>;
    }>;
    totalLines: number;
  };
  statistics?: {
    totalLines1: number;
    totalLines2: number;
    unchangedLines: number;
    changedLines: number;
    changePercentage: number;
    addedCharacters: number;
    deletedCharacters: number;
    unchangedCharacters: number;
    totalChanges: number;
    similarity?: number;
    similarityPercentage?: number;
  };
  diffDetails?: Array<{
    operation: string;
    text: string;
    length: number;
    type: string;
    position?: number;
    cssClass?: string;
  }>;
  // Enhanced diff properties
  structuralChanges?: Array<{
    path: string;
    type: string;
    oldValue?: string;
    newValue?: string;
  }>;
  codeStatistics?: {
    linesOfCode1: number;
    linesOfCode2: number;
    commentLines1: number;
    commentLines2: number;
  };
}

export interface UtilityResponse {
  // URL Encoder/Decoder
  originalText?: string;
  encodedText?: string;
  decodedText?: string;
  operation?: string;
  encoding?: string;
  

  
  // Timestamp Converter
  originalTimestamp?: string;
  timestampSourceFormat?: string;
  timestampTargetFormat?: string;
  convertedTimestamp?: string;
  
  // Format Converter
  originalFormatText?: string;
  formatSourceFormat?: string;
  formatTargetFormat?: string;
  convertedText?: string;
  
  // cURL Generator
  curlCommand?: string;
  
  // SQL Formatter
  originalSql?: string;
  formattedSql?: string;
  dialect?: string;
  
  // Regex Tester
  pattern?: string;
  testText?: string;
  matches?: Array<{
    match: string;
    start: number;
    end: number;
  }>;
  matchCount?: number;
  
  // Common
  success?: boolean;
  message?: string;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  description: string;
}

// Theme types
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
} 