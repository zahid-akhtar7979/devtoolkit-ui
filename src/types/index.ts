// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Base64 types
export interface Base64Request {
  text: string;
}

export interface Base64Response {
  encoded?: string;
  decoded?: string;
}

// Hash types
export interface HashRequest {
  text: string;
  algorithm?: string;
}

export interface HashResponse {
  hash?: string;
  algorithm?: string;
  hashes?: Record<string, string>;
}

// JWT types
export interface JwtRequest {
  token: string;
  secret?: string;
}

export interface JwtResponse {
  decoded?: {
    header: any;
    payload: any;
    signature: string;
  };
  valid?: boolean;
}

// Jasypt types
export interface JasyptRequest {
  text: string;
  password: string;
  algorithm?: string;
}

export interface JasyptResponse {
  encrypted?: string;
  decrypted?: string;
}

// Cron types
export interface CronRequest {
  cronExpression: string;
}

export interface CronResponse {
  nextExecutions: string[];
  description: string;
}

// Utility types
export interface UtilityRequest {
  text?: string;
  type?: string;
  format?: string;
  sourceFormat?: string;
  targetFormat?: string;
  url?: string;
  method?: string;
  headers?: string;
  body?: string;
  text1?: string;
  text2?: string;
  sql?: string;
  dialect?: string;
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
  encoded?: string;
  decoded?: string;
  uuid?: string;
  converted?: string;
  identical?: boolean;
  length1?: number;
  length2?: number;
  differences?: string;
  curl?: string;
  formatted?: string;
  result?: string;
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