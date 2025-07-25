import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
  Paper,
  Chip,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { diffService } from '../../services/diffService';
import { useApi } from '../../hooks/useApi';
import { ResultCard } from '../../shared/components/ResultCard';
import { LoadingButton } from '../../shared/components/LoadingButton';
import { validation } from '../../utils/validation';
import { DiffRequest } from '../../types';

const DiffTool: React.FC = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffOptions, setDiffOptions] = useState<{
    ignoreCase: boolean;
    ignoreWhitespace: boolean;
    ignoreLineEndings: boolean;
  }>({
    ignoreCase: false,
    ignoreWhitespace: false,
    ignoreLineEndings: false,
  });

  const diffApi = useApi(diffService.enhancedCompare);

  const handleCompare = () => {
    if (!validation.isNotEmpty(text1) && !validation.isNotEmpty(text2)) {
      return;
    }
    
    const request: DiffRequest = {
      text1,
      text2,
      diffType: detectContentType(text1, text2) as 'TEXT' | 'JSON' | 'XML' | 'CODE',
      ignoreCase: diffOptions.ignoreCase,
      ignoreWhitespace: diffOptions.ignoreWhitespace,
      ignoreLineEndings: diffOptions.ignoreLineEndings,
      contextLines: 3, // Fixed value since we don't need the slider
    };
    
    diffApi.execute(request);
  };

  const handleClear = () => {
    setText1('');
    setText2('');
    diffApi.reset();
  };

  const handleSwap = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  const handleSample = () => {
    setText1(`Hello World
This is the first text
It has some content
That we want to compare`);

    setText2(`Hello World
This is the second text
It has different content
That we want to compare`);
  };

  const handleJsonSample = () => {
    setText1(`{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "swimming"]
}`);

    setText2(`{
  "name": "Jane Doe",
  "age": 25,
  "city": "Los Angeles",
  "hobbies": ["reading", "painting"],
  "email": "jane@example.com"
}`);
  };

  const handleCodeSample = () => {
    setText1(`function calculateSum(a, b) {
    // Add two numbers
    return a + b;
}

function multiply(x, y) {
    return x * y;
}`);

    setText2(`function calculateSum(a, b) {
    // Add two numbers together
    const result = a + b;
    return result;
}

function divide(x, y) {
    if (y === 0) {
        throw new Error("Division by zero");
    }
    return x / y;
}`);
  };

  const formatDiffResult = (result: any) => {
    if (!result) return '';
    
    let output = '';
    if (result.identical !== undefined) {
      output += `Identical: ${result.identical ? 'Yes' : 'No'}\n`;
    }
    if (result.length1 !== undefined) {
      output += `Text 1 length: ${result.length1}\n`;
    }
    if (result.length2 !== undefined) {
      output += `Text 2 length: ${result.length2}\n`;
    }
    if (result.differences) {
      output += `\nDifferences:\n${result.differences}`;
    }
    
    return output;
  };

  const renderStatistics = (stats: any) => {
    if (!stats) return null;
    
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>Statistics</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip label={`Lines: ${stats.totalLines1} → ${stats.totalLines2}`} color="primary" />
          <Chip label={`Changed: ${stats.changedLines}`} color="warning" />
          <Chip label={`Unchanged: ${stats.unchangedLines}`} color="success" />
          <Chip label={`Added chars: ${stats.addedCharacters}`} color="info" />
          <Chip label={`Deleted chars: ${stats.deletedCharacters}`} color="error" />
          <Chip label={`Change: ${stats.changePercentage?.toFixed(1)}%`} color="secondary" />
          {stats.similarityPercentage && (
            <Chip 
              label={`Similarity: ${stats.similarityPercentage.toFixed(1)}%`} 
              color={stats.similarityPercentage > 80 ? "success" : stats.similarityPercentage > 50 ? "warning" : "error"}
            />
          )}
        </Box>
      </Box>
    );
  };

  const renderUnifiedDiff = (unifiedDiff: string) => {
    if (!unifiedDiff) return null;
    
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>Unified Diff</Typography>
        <Paper sx={{ p: 2, bgcolor: 'grey.50', fontFamily: 'monospace', fontSize: '0.875rem' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {unifiedDiff}
          </pre>
        </Paper>
      </Box>
    );
  };

  const renderSideBySide = (sideBySide: any) => {
    // Use enhanced structural comparison for all types
    return renderEnhancedSideBySide();
  };

  const renderEnhancedSideBySide = () => {
    // Parse and format both texts into lines based on type
    const leftLines = formatTextToLines(text1);
    const rightLines = formatTextToLines(text2);
    
    // Create a smarter diff that maintains structure
    const alignedDiff = createStructuralDiff(leftLines, rightLines);

    // Get format-specific display info
    const formatInfo = getFormatDisplayInfo();

    return (
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 3, 
          borderRadius: 3,
          overflow: 'hidden',
          border: '2px solid #667eea',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
        }}
      >
        {/* Enhanced Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          py: 2
        }}>
          <Typography variant="h5" fontWeight="bold">
            {formatInfo.icon} {formatInfo.title}
          </Typography>
        </Box>

        {/* Column Headers */}
        <Box sx={{ 
          display: 'flex',
          bgcolor: '#f8f9fa',
          borderBottom: '2px solid #dee2e6'
        }}>
          <Box sx={{ 
            flex: 1, 
            p: 2, 
            borderRight: '1px solid #dee2e6',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <Box sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%', 
              bgcolor: '#dc3545',
              boxShadow: '0 0 10px rgba(220, 53, 69, 0.5)'
            }} />
            <Typography variant="subtitle1" fontWeight={700} color="#495057">
              📄 Original {formatInfo.fileType}
            </Typography>
          </Box>
          <Box sx={{ 
            flex: 1, 
            p: 2,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <Box sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%', 
              bgcolor: '#28a745',
              boxShadow: '0 0 10px rgba(40, 167, 69, 0.5)'
            }} />
            <Typography variant="subtitle1" fontWeight={700} color="#495057">
              📄 Modified {formatInfo.fileType}
            </Typography>
          </Box>
        </Box>

        {/* Structurally Aligned Comparison */}
        <Box sx={{ maxHeight: '600px', overflow: 'auto' }}>
          {alignedDiff.map((diffLine, index) => (
            <Box key={index} sx={{ 
              display: 'flex',
              minHeight: '24px',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.05)'
              },
              borderBottom: '1px solid #f1f3f4'
            }}>
              {/* Left side (Original) */}
              <Box sx={{ 
                flex: 1, 
                display: 'flex',
                borderRight: '1px solid #dee2e6',
                bgcolor: diffLine.leftType === 'removed' ? '#fff5f5' : 
                        diffLine.leftType === 'modified' ? '#fff9f9' : 'transparent'
              }}>
                {/* Line number */}
                <Box sx={{ 
                  minWidth: '50px',
                  px: 1,
                  py: 0.5,
                  bgcolor: '#f8f9fa',
                  borderRight: '1px solid #e9ecef',
                  color: '#6c757d',
                  fontSize: '12px',
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {diffLine.leftLineNum || ''}
                </Box>
                
                {/* Content */}
                <Box sx={{ 
                  flex: 1,
                  px: 2,
                  py: 0.5,
                  fontFamily: formatInfo.fontFamily,
                  fontSize: '13px',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  overflow: 'hidden',
                  maxWidth: 'calc(100% - 4px)',
                  color: diffLine.leftType === 'removed' ? '#c62828' : 
                         diffLine.leftType === 'modified' ? '#d84315' : '#495057'
                }}>
                  {diffLine.leftContent || ''}
                </Box>
              </Box>

              {/* Right side (Modified) */}
              <Box sx={{ 
                flex: 1,
                display: 'flex',
                bgcolor: diffLine.rightType === 'added' ? '#f0f8f0' : 
                        diffLine.rightType === 'modified' ? '#f9fff9' : 'transparent'
              }}>
                {/* Line number */}
                <Box sx={{ 
                  minWidth: '50px',
                  px: 1,
                  py: 0.5,
                  bgcolor: '#f8f9fa',
                  borderRight: '1px solid #e9ecef',
                  color: '#6c757d',
                  fontSize: '12px',
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {diffLine.rightLineNum || ''}
                </Box>
                
                {/* Content */}
                <Box sx={{ 
                  flex: 1,
                  px: 2,
                  py: 0.5,
                  fontFamily: formatInfo.fontFamily,
                  fontSize: '13px',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  overflow: 'hidden',
                  maxWidth: 'calc(100% - 4px)',
                  color: diffLine.rightType === 'added' ? '#2e7d32' : 
                         diffLine.rightType === 'modified' ? '#388e3c' : '#495057'
                }}>
                  {diffLine.rightContent || ''}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Footer with legend */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 3,
          p: 2,
          bgcolor: '#f8f9fa',
          borderTop: '1px solid #dee2e6'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              bgcolor: '#fff5f5', 
              border: '1px solid #f44336',
              borderRadius: 1 
            }} />
            <Typography variant="caption">Removed</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              bgcolor: '#f0f8f0', 
              border: '1px solid #4caf50',
              borderRadius: 1 
            }} />
            <Typography variant="caption">Added</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              bgcolor: '#fff9f9', 
              border: '1px solid #ff9800',
              borderRadius: 1 
            }} />
            <Typography variant="caption">Modified</Typography>
          </Box>
        </Box>
      </Paper>
    );
  };

  const detectContentType = (text1: string, text2: string): string => {
    // Auto-detect content type based on content
    const combinedText = (text1 + text2).trim();
    
    if (isJsonContent(combinedText)) {
      return 'JSON';
    }
    if (isXmlContent(combinedText)) {
      return 'XML';
    }
    if (isCodeContent(combinedText)) {
      return 'CODE';
    }
    return 'TEXT';
  };

  const isJsonContent = (text: string): boolean => {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return text.trim().startsWith('{') || text.trim().startsWith('[');
    }
  };

  const isXmlContent = (text: string): boolean => {
    return text.trim().startsWith('<') && text.includes('>');
  };

  const isCodeContent = (text: string): boolean => {
    const codeKeywords = ['function', 'class', 'import', 'export', 'const', 'let', 'var', 'if', 'for', 'while'];
    return codeKeywords.some(keyword => text.includes(keyword));
  };

  const getFormatDisplayInfo = () => {
    const detectedType = detectContentType(text1, text2);
    
    switch (detectedType) {
      case 'JSON':
        return {
          icon: '🗂️',
          title: 'JSON Structural Analysis',
          fileType: 'JSON',
          fontFamily: 'Fira Code, Monaco, Consolas, monospace'
        };
      case 'XML':
        return {
          icon: '📄',
          title: 'XML Document Analysis',
          fileType: 'XML',
          fontFamily: 'Fira Code, Monaco, Consolas, monospace'
        };
      case 'CODE':
        return {
          icon: '💻',
          title: 'Source Code Analysis',
          fileType: 'Code',
          fontFamily: 'Fira Code, Monaco, Consolas, monospace'
        };
      case 'TEXT':
      default:
        return {
          icon: '📝',
          title: 'Text Document Analysis',
          fileType: 'Text',
          fontFamily: 'ui-monospace, SFMono-Regular, Monaco, Consolas, monospace'
        };
    }
  };

  const formatTextToLines = (text: string): string[] => {
    const detectedType = detectContentType(text1, text2);
    if (detectedType === 'JSON') {
      return formatJsonToLines(text);
    }
    return text.split('\n');
  };

  const renderJsonSideBySide = () => {
    if (!diffApi.data?.structuralChanges) return null;

    // Parse and format both JSON strings into lines
    const leftLines = formatJsonToLines(text1);
    const rightLines = formatJsonToLines(text2);
    
    // Create a smarter diff that maintains structure
    const alignedDiff = createStructuralDiff(leftLines, rightLines);

    return (
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 3, 
          borderRadius: 3,
          overflow: 'hidden',
          border: '2px solid #667eea',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
        }}
      >
        {/* Enhanced Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          py: 2
        }}>
          <Typography variant="h5" fontWeight="bold">
            🗂️ JSON Structural Analysis
          </Typography>
        </Box>

        {/* Column Headers */}
        <Box sx={{ 
          display: 'flex',
          bgcolor: '#f8f9fa',
          borderBottom: '2px solid #dee2e6'
        }}>
          <Box sx={{ 
            flex: 1, 
            p: 2, 
            borderRight: '1px solid #dee2e6',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <Box sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%', 
              bgcolor: '#dc3545',
              boxShadow: '0 0 10px rgba(220, 53, 69, 0.5)'
            }} />
            <Typography variant="subtitle1" fontWeight={700} color="#495057">
              📄 Original JSON
            </Typography>
          </Box>
          <Box sx={{ 
            flex: 1, 
            p: 2,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <Box sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%', 
              bgcolor: '#28a745',
              boxShadow: '0 0 10px rgba(40, 167, 69, 0.5)'
            }} />
            <Typography variant="subtitle1" fontWeight={700} color="#495057">
              📄 Modified JSON
            </Typography>
          </Box>
        </Box>

        {/* Structurally Aligned Comparison */}
        <Box sx={{ maxHeight: '600px', overflow: 'auto' }}>
          {alignedDiff.map((diffLine, index) => (
            <Box key={index} sx={{ 
              display: 'flex',
              minHeight: '24px',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.05)'
              },
              borderBottom: '1px solid #f1f3f4'
            }}>
              {/* Left side (Original) */}
              <Box sx={{ 
                flex: 1, 
                display: 'flex',
                borderRight: '1px solid #dee2e6',
                bgcolor: diffLine.leftType === 'removed' ? '#fff5f5' : 
                        diffLine.leftType === 'modified' ? '#fff9f9' : 'transparent'
              }}>
                {/* Line number */}
                <Box sx={{ 
                  minWidth: '50px',
                  px: 1,
                  py: 0.5,
                  bgcolor: '#f8f9fa',
                  borderRight: '1px solid #e9ecef',
                  color: '#6c757d',
                  fontSize: '12px',
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {diffLine.leftLineNum || ''}
                </Box>
                
                {/* Content */}
                <Box sx={{ 
                  flex: 1,
                  px: 2,
                  py: 0.5,
                  fontFamily: 'Fira Code, Monaco, Consolas, monospace',
                  fontSize: '13px',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  overflow: 'hidden',
                  maxWidth: 'calc(100% - 4px)',
                  color: diffLine.leftType === 'removed' ? '#c62828' : 
                         diffLine.leftType === 'modified' ? '#d84315' : '#495057'
                }}>
                  {diffLine.leftContent || ''}
                </Box>
              </Box>

              {/* Right side (Modified) */}
              <Box sx={{ 
                flex: 1,
                display: 'flex',
                bgcolor: diffLine.rightType === 'added' ? '#f0f8f0' : 
                        diffLine.rightType === 'modified' ? '#f9fff9' : 'transparent'
              }}>
                {/* Line number */}
                <Box sx={{ 
                  minWidth: '50px',
                  px: 1,
                  py: 0.5,
                  bgcolor: '#f8f9fa',
                  borderRight: '1px solid #e9ecef',
                  color: '#6c757d',
                  fontSize: '12px',
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {diffLine.rightLineNum || ''}
                </Box>
                
                {/* Content */}
                <Box sx={{ 
                  flex: 1,
                  px: 2,
                  py: 0.5,
                  fontFamily: 'Fira Code, Monaco, Consolas, monospace',
                  fontSize: '13px',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  overflow: 'hidden',
                  maxWidth: 'calc(100% - 4px)',
                  color: diffLine.rightType === 'added' ? '#2e7d32' : 
                         diffLine.rightType === 'modified' ? '#388e3c' : '#495057'
                }}>
                  {diffLine.rightContent || ''}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Footer with legend */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 3,
          p: 2,
          bgcolor: '#f8f9fa',
          borderTop: '1px solid #dee2e6'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              bgcolor: '#fff5f5', 
              border: '1px solid #f44336',
              borderRadius: 1 
            }} />
            <Typography variant="caption">Removed</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              bgcolor: '#f0f8f0', 
              border: '1px solid #4caf50',
              borderRadius: 1 
            }} />
            <Typography variant="caption">Added</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              bgcolor: '#fff9f9', 
              border: '1px solid #ff9800',
              borderRadius: 1 
            }} />
            <Typography variant="caption">Modified</Typography>
          </Box>
        </Box>
      </Paper>
    );
  };

  const createStructuralDiff = (leftLines: string[], rightLines: string[]): Array<{
    leftContent: string;
    rightContent: string;
    leftLineNum: number | null;
    rightLineNum: number | null;
    leftType: string;
    rightType: string;
  }> => {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    let leftLineCounter = 1;
    let rightLineCounter = 1;

    // Simple LCS-like algorithm to maintain structure
    while (leftIndex < leftLines.length || rightIndex < rightLines.length) {
      const leftLine = leftLines[leftIndex];
      const rightLine = rightLines[rightIndex];

      if (leftIndex >= leftLines.length) {
        // Only right side has content (additions)
        result.push({
          leftContent: '',
          rightContent: rightLine,
          leftLineNum: null,
          rightLineNum: rightLineCounter++,
          leftType: 'empty',
          rightType: 'added'
        });
        rightIndex++;
      } else if (rightIndex >= rightLines.length) {
        // Only left side has content (deletions)
        result.push({
          leftContent: leftLine,
          rightContent: '',
          leftLineNum: leftLineCounter++,
          rightLineNum: null,
          leftType: 'removed',
          rightType: 'empty'
        });
        leftIndex++;
      } else if (leftLine === rightLine) {
        // Lines are identical
        result.push({
          leftContent: leftLine,
          rightContent: rightLine,
          leftLineNum: leftLineCounter++,
          rightLineNum: rightLineCounter++,
          leftType: 'unchanged',
          rightType: 'unchanged'
        });
        leftIndex++;
        rightIndex++;
      } else {
        // Lines are different - try to find better alignment
        const leftTrimmed = leftLine.trim();
        const rightTrimmed = rightLine.trim();
        
        // Check if this is a structural match (same indentation level/braces)
        if (isStructuralMatch(leftLine, rightLine)) {
          result.push({
            leftContent: leftLine,
            rightContent: rightLine,
            leftLineNum: leftLineCounter++,
            rightLineNum: rightLineCounter++,
            leftType: 'modified',
            rightType: 'modified'
          });
          leftIndex++;
          rightIndex++;
        } else {
          // Look ahead to see if we can find a better match
          const leftMatch = findNextMatch(leftLine, rightLines, rightIndex + 1);
          const rightMatch = findNextMatch(rightLine, leftLines, leftIndex + 1);
          
          if (leftMatch.found && (!rightMatch.found || leftMatch.distance <= rightMatch.distance)) {
            // Found left line later in right side - treat as addition on right
            result.push({
              leftContent: '',
              rightContent: rightLine,
              leftLineNum: null,
              rightLineNum: rightLineCounter++,
              leftType: 'empty',
              rightType: 'added'
            });
            rightIndex++;
          } else if (rightMatch.found) {
            // Found right line later in left side - treat as deletion on left
            result.push({
              leftContent: leftLine,
              rightContent: '',
              leftLineNum: leftLineCounter++,
              rightLineNum: null,
              leftType: 'removed',
              rightType: 'empty'
            });
            leftIndex++;
          } else {
            // No good match found - show as modification
            result.push({
              leftContent: leftLine,
              rightContent: rightLine,
              leftLineNum: leftLineCounter++,
              rightLineNum: rightLineCounter++,
              leftType: 'modified',
              rightType: 'modified'
            });
            leftIndex++;
            rightIndex++;
          }
        }
      }
    }

    return result;
  };

  const isStructuralMatch = (leftLine: string, rightLine: string): boolean => {
    const leftTrimmed = leftLine.trim();
    const rightTrimmed = rightLine.trim();
    
    // Check if both lines have similar structural elements
    const structuralChars = ['{', '}', '[', ']', ':', ','];
    const leftStructure = leftTrimmed.split('').filter(char => structuralChars.includes(char)).join('');
    const rightStructure = rightTrimmed.split('').filter(char => structuralChars.includes(char)).join('');
    
    // If structure is similar, consider it a modification rather than add/remove
    return leftStructure === rightStructure || 
           (leftTrimmed.endsWith(',') && rightTrimmed.endsWith(',')) ||
           (leftTrimmed.endsWith('{') && rightTrimmed.endsWith('{')) ||
           (leftTrimmed.endsWith('}') && rightTrimmed.endsWith('}'));
  };

  const findNextMatch = (line: string, lines: string[], startIndex: number): { found: boolean; distance: number } => {
    for (let i = startIndex; i < Math.min(startIndex + 5, lines.length); i++) {
      if (lines[i] === line) {
        return { found: true, distance: i - startIndex };
      }
    }
    return { found: false, distance: Infinity };
  };

  const renderUnifiedAsSideBySide = () => {
    if (!diffApi.data?.unifiedDiff) return null;

         const lines = diffApi.data.unifiedDiff.split('\n');
     const leftLines: Array<{content: string, type: string}> = [];
     const rightLines: Array<{content: string, type: string}> = [];

    for (const line of lines) {
      if (line.startsWith('- ')) {
        leftLines.push({ content: line.substring(2), type: 'deleted' });
        rightLines.push({ content: '', type: 'empty' });
      } else if (line.startsWith('+ ')) {
        leftLines.push({ content: '', type: 'empty' });
        rightLines.push({ content: line.substring(2), type: 'added' });
      } else if (line.startsWith('  ') || (!line.startsWith('@') && !line.startsWith('Index:'))) {
        const content = line.startsWith('  ') ? line.substring(2) : line;
        leftLines.push({ content, type: 'unchanged' });
        rightLines.push({ content, type: 'unchanged' });
      }
    }

    return (
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 3, 
          borderRadius: 3,
          overflow: 'hidden',
          border: '2px solid #667eea',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
        }}
      >
        {/* Enhanced Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          py: 2
        }}>
          <Typography variant="h5" fontWeight="bold">
            📝 Advanced Side-by-Side Comparison
          </Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
            Line-by-Line Diff Analysis
          </Typography>
        </Box>

        {/* Column Headers */}
        <Box sx={{ 
          display: 'flex',
          bgcolor: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%)',
          borderBottom: '2px solid #dee2e6'
        }}>
          <Box sx={{ 
            flex: 1, 
            p: 2, 
            borderRight: '1px solid #dee2e6',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <Box sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%', 
              bgcolor: '#dc3545',
              boxShadow: '0 0 10px rgba(220, 53, 69, 0.5)'
            }} />
            <Typography variant="subtitle1" fontWeight={700} color="#495057">
              📄 Original
            </Typography>
          </Box>
          <Box sx={{ 
            flex: 1, 
            p: 2,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <Box sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%', 
              bgcolor: '#28a745',
              boxShadow: '0 0 10px rgba(40, 167, 69, 0.5)'
            }} />
            <Typography variant="subtitle1" fontWeight={700} color="#495057">
              📄 Modified
            </Typography>
          </Box>
        </Box>

        {/* Content with Enhanced Styling */}
        <Box sx={{ maxHeight: '600px', overflow: 'auto' }}>
          {leftLines.map((leftLine: any, index: number) => {
            const rightLine = rightLines[index];
            return (
              <Box key={index} sx={{ 
                display: 'flex',
                minHeight: '26px',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.05)',
                  boxShadow: 'inset 0 0 0 1px rgba(102, 126, 234, 0.1)'
                },
                borderBottom: '1px solid #f1f3f4',
                transition: 'all 0.2s ease'
              }}>
                <Box sx={{ 
                  flex: 1, 
                  p: 1.5, 
                  borderRight: '1px solid #dee2e6',
                  fontFamily: 'Fira Code, Monaco, Consolas, monospace',
                  fontSize: '13px',
                  bgcolor: leftLine.type === 'deleted' ? 
                    'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)' : 
                    'linear-gradient(135deg, #fafbfc 0%, #f8f9fa 100%)',
                  color: leftLine.type === 'deleted' ? '#c62828' : '#495057',
                  textDecoration: leftLine.type === 'deleted' ? 'line-through' : 'none',
                  lineHeight: 1.4,
                  wordBreak: 'break-all'
                }}>
                  {leftLine.content || '\u00A0'}
                </Box>
                <Box sx={{ 
                  flex: 1, 
                  p: 1.5,
                  fontFamily: 'Fira Code, Monaco, Consolas, monospace',
                  fontSize: '13px',
                  bgcolor: rightLine?.type === 'added' ? 
                    'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' : 
                    'linear-gradient(135deg, #fafbfc 0%, #f8f9fa 100%)',
                  color: rightLine?.type === 'added' ? '#2e7d32' : '#495057',
                  lineHeight: 1.4,
                  wordBreak: 'break-all'
                }}>
                  {rightLine?.content || '\u00A0'}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>
    );
  };

  const formatJsonWithHighlights = (jsonText: string, side: 'left' | 'right') => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      
      if (!diffApi.data?.structuralChanges) return formatted;

      let highlighted = formatted;
      
      diffApi.data.structuralChanges.forEach((change: any) => {
        const path = change.path;
        const oldValue = change.oldValue;
        const newValue = change.newValue;
        
        if (change.type === 'VALUE_CHANGED') {
          // For value changes, show old value on left side, new value on right side
          if (side === 'left' && oldValue) {
            highlighted = highlightJsonValue(highlighted, path, oldValue, '#ffcdd2', '#f44336');
          } else if (side === 'right' && newValue) {
            highlighted = highlightJsonValue(highlighted, path, newValue, '#c8e6c9', '#4caf50');
          }
        } else if (change.type === 'FIELD_REMOVED') {
          // For field removals, only highlight the field name on LEFT side
          if (side === 'left') {
            highlighted = highlightJsonFieldName(highlighted, path, '#ffcdd2', '#f44336');
          }
        } else if (change.type === 'FIELD_ADDED') {
          // For field additions, only highlight the field name on RIGHT side
          if (side === 'right') {
            highlighted = highlightJsonFieldName(highlighted, path, '#c8e6c9', '#4caf50');
          }
        }
      });

      return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
    } catch (e) {
      return jsonText;
    }
  };

  const highlightJsonValue = (text: string, path: string, value: string, bgColor: string, borderColor: string) => {
    // Handle array paths like "hobbies[1]"
    if (path.includes('[') && path.includes(']')) {
      const arrayMatch = path.match(/^(.+)\[(\d+)\]$/);
      if (arrayMatch) {
        const arrayName = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        
        // For arrays, let's highlight the changed element more simply
        const cleanValue = value.replace(/^"|"$/g, '');
        const valueRegex = new RegExp(escapeRegex(cleanValue), 'g');
        return text.replace(valueRegex, (match) => {
          return `<span style="background-color: ${bgColor}; padding: 2px 4px; border-radius: 3px; border: 1px solid ${borderColor};">${match}</span>`;
        });
      }
    }
    
    // Handle regular object properties - match both quoted strings and unquoted numbers
    const cleanValue = value.replace(/^"|"$/g, ''); // Remove quotes from the value
    
    // Try to match the pattern: "key": value
    const patterns = [
      // For quoted string values: "name": "Jane Doe"
      new RegExp(`("${escapeRegex(path)}"\\s*:\\s*)("${escapeRegex(cleanValue)}")`, 'g'),
      // For unquoted values: "age": 25
      new RegExp(`("${escapeRegex(path)}"\\s*:\\s*)(${escapeRegex(cleanValue)})(?=[,\\s}])`, 'g')
    ];
    
    let result = text;
    for (const pattern of patterns) {
      result = result.replace(pattern, (match, keyPart, valuePart) => {
        return `${keyPart}<span style="background-color: ${bgColor}; padding: 2px 4px; border-radius: 3px; border: 1px solid ${borderColor};">${valuePart}</span>`;
      });
    }
    
    return result;
  };

  const highlightJsonFieldName = (text: string, path: string, bgColor: string, borderColor: string) => {
    // Instead of highlighting entire objects, just highlight the field name
    const fieldNameRegex = new RegExp(`("${escapeRegex(path)}")`, 'g');
    return text.replace(fieldNameRegex, (match) => {
      const isRemoved = bgColor.includes('ff'); // Red background indicates removal
      const icon = isRemoved ? '❌' : '✅';
      return `<span style="background-color: ${bgColor}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${borderColor}; font-weight: bold; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">${icon} ${match}</span>`;
    });
  };

  const highlightJsonField = (text: string, path: string, value: string, bgColor: string, borderColor: string) => {
    // For field additions/removals, highlight the entire key-value pair
    const cleanValue = value.replace(/^"|"$/g, '');
    
    // Handle nested objects (like address)
    if (value.startsWith('{') && value.endsWith('}')) {
      // For nested objects, try to match the entire block including multiline content
      const objectRegex = new RegExp(`("${escapeRegex(path)}"\\s*:\\s*\\{[\\s\\S]*?\\})`, 'g');
      let result = text.replace(objectRegex, (match) => {
        return `<span style="background-color: ${bgColor}; padding: 2px 4px; border-radius: 3px; border: 1px solid ${borderColor};">${match}</span>`;
      });
      
      return result;
    }
    
    // Handle regular fields (strings, numbers, booleans, arrays)
    const patterns = [
      // For quoted values
      new RegExp(`("${escapeRegex(path)}"\\s*:\\s*"${escapeRegex(cleanValue)}")`, 'g'),
      // For unquoted values (numbers, booleans)
      new RegExp(`("${escapeRegex(path)}"\\s*:\\s*${escapeRegex(cleanValue)})(?=[,\\s}])`, 'g'),
      // For arrays and other complex values
      new RegExp(`("${escapeRegex(path)}"\\s*:\\s*\\[[^\\]]*\\])`, 'g')
    ];
    
    let result = text;
    for (const pattern of patterns) {
      const newResult = result.replace(pattern, (match) => {
        return `<span style="background-color: ${bgColor}; padding: 2px 4px; border-radius: 3px; border: 1px solid ${borderColor};">${match}</span>`;
      });
      if (newResult !== result) {
        result = newResult;
        break; // Stop after first successful match
      }
    }
    
    return result;
  };

  // Helper function to escape special regex characters
  const escapeRegex = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const formatJsonToLines = (jsonText: string): string[] => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      return formatted.split('\n');
    } catch (e) {
      return jsonText.split('\n');
    }
  };

  const renderAdvancedHighlightedText = (text: string, highlights: any[], side: 'left' | 'right') => {
    if (!highlights || highlights.length === 0) {
      return <span style={{ color: '#333' }}>{text || '\u00A0'}</span>;
    }

    const parts = [];
    let lastIndex = 0;

    // Sort highlights by start position to ensure proper ordering
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    sortedHighlights.forEach((highlight, index) => {
      // Add unhighlighted text before this highlight
      if (highlight.start > lastIndex) {
        parts.push(
          <span key={`text-${index}`} style={{ color: '#333' }}>
            {text.substring(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add highlighted text with enhanced styling
      const highlightStyle = getAdvancedHighlightStyle(highlight, side);
      parts.push(
        <span 
          key={`highlight-${index}`}
          style={highlightStyle}
          title={`${highlight.type}: "${text.substring(highlight.start, highlight.end)}"`}
        >
          {text.substring(highlight.start, highlight.end)}
        </span>
      );

      lastIndex = highlight.end;
    });

    // Add remaining unhighlighted text
    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end" style={{ color: '#333' }}>
          {text.substring(lastIndex)}
        </span>
      );
    }

    return <span>{parts}</span>;
  };

  const getAdvancedHighlightStyle = (highlight: any, side: 'left' | 'right') => {
    const baseStyle = {
      borderRadius: '3px',
      padding: '1px 2px',
      margin: '0 1px',
      fontWeight: 500,
      border: '1px solid transparent',
      position: 'relative' as const,
      transition: 'all 0.2s ease'
    };

    // Determine colors based on highlight type and side
    if (highlight.type === 'unchanged' || highlight.cssClass === 'diff-unchanged') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: '#333'
      };
    }
    
    if (highlight.type === 'deleted' || highlight.cssClass === 'diff-deleted') {
      return {
        ...baseStyle,
        backgroundColor: side === 'left' ? '#ffcdd2' : '#ffebee',
        color: '#c62828',
        textDecoration: side === 'left' ? 'line-through' : 'none',
        border: '1px solid #f44336'
      };
    }
    
    if (highlight.type === 'added' || highlight.cssClass === 'diff-added') {
      return {
        ...baseStyle,
        backgroundColor: side === 'right' ? '#c8e6c9' : '#e8f5e8',
        color: '#2e7d32',
        border: '1px solid #4caf50'
      };
    }
    
    if (highlight.type === 'changed' || highlight.cssClass === 'diff-changed') {
      return {
        ...baseStyle,
        backgroundColor: '#fff3cd',
        color: '#f57f17',
        border: '1px solid #ffc107'
      };
    }

    // Default style
    return {
      ...baseStyle,
      backgroundColor: '#f5f5f5',
      color: '#666'
    };
  };

  const renderStructuralChanges = (structuralChanges: any[]) => {
    if (!structuralChanges || structuralChanges.length === 0) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>Structural Changes</Typography>
        <Paper sx={{ p: 2 }}>
          {structuralChanges.map((change, index) => (
            <Box key={index} sx={{ mb: 1, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="primary">
                {change.path}
              </Typography>
              <Chip 
                label={change.type} 
                size="small" 
                color={change.type.includes('ADDED') ? 'success' : 
                       change.type.includes('REMOVED') ? 'error' : 'warning'}
                sx={{ mr: 1 }}
              />
              {change.oldValue && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Old: {change.oldValue}
                </Typography>
              )}
              {change.newValue && (
                <Typography variant="body2" color="success" sx={{ mt: 1 }}>
                  New: {change.newValue}
                </Typography>
              )}
            </Box>
          ))}
        </Paper>
      </Box>
    );
  };

  const renderCodeStatistics = (codeStats: any) => {
    if (!codeStats) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>Code Statistics</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip label={`LOC: ${codeStats.linesOfCode1} → ${codeStats.linesOfCode2}`} color="primary" />
          <Chip label={`Comments: ${codeStats.commentLines1} → ${codeStats.commentLines2}`} color="info" />
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: '100%' }}>
      {/* Enhanced Analysis Configuration Panel */}
      <Paper 
        elevation={4} 
        sx={{ 
          mb: 3, 
          p: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: '50%', 
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              ⚙️
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                Analysis Configuration
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Customize comparison settings and options
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4, 
            alignItems: { xs: 'stretch', md: 'center' } 
          }}>
            {/* Comparison Options */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, opacity: 0.95 }}>
                🎛️ Comparison Options
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={diffOptions.ignoreCase}
                      onChange={(e) => setDiffOptions(prev => ({ ...prev, ignoreCase: e.target.checked }))}
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        '&.Mui-checked': {
                          color: '#ffd700'
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: 24,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" fontWeight={500}>
                        Case Insensitive
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        opacity: 0.8, 
                        fontSize: '0.75rem',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1
                      }}>
                        Aa = aa
                      </Typography>
                    </Box>
                  }
                  sx={{ 
                    margin: 0,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.95rem'
                    }
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={diffOptions.ignoreWhitespace}
                      onChange={(e) => setDiffOptions(prev => ({ ...prev, ignoreWhitespace: e.target.checked }))}
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        '&.Mui-checked': {
                          color: '#ffd700'
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: 24,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" fontWeight={500}>
                        Ignore Spaces
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        opacity: 0.8, 
                        fontSize: '0.75rem',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1
                      }}>
                        " " = ""
                      </Typography>
                    </Box>
                  }
                  sx={{ 
                    margin: 0,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.95rem'
                    }
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={diffOptions.ignoreLineEndings}
                      onChange={(e) => setDiffOptions(prev => ({ ...prev, ignoreLineEndings: e.target.checked }))}
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        '&.Mui-checked': {
                          color: '#ffd700'
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: 24,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" fontWeight={500}>
                        Ignore Line Endings
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        opacity: 0.8, 
                        fontSize: '0.75rem',
                        bgcolor: 'rgba(255,255,255,0.2)',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1
                      }}>
                        \\n = \\r\\n
                      </Typography>
                    </Box>
                  }
                  sx={{ 
                    margin: 0,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.95rem'
                    }
                  }}
                />
              </Box>
            </Box>
            
            {/* Sample Data */}
            <Box sx={{ 
              borderLeft: { xs: 'none', md: '1px solid rgba(255,255,255,0.3)' },
              borderTop: { xs: '1px solid rgba(255,255,255,0.3)', md: 'none' },
              pl: { xs: 0, md: 4 },
              pt: { xs: 3, md: 0 },
              minWidth: { md: '280px' }
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, opacity: 0.95 }}>
                🎯 Quick Start Samples
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  label="📝 Sample Text"
                  onClick={handleSample}
                  variant="outlined"
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    px: 2,
                    py: 0.5,
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.15)',
                      borderColor: 'rgba(255,255,255,0.8)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
                <Chip
                  label="🗂️ JSON Demo"
                  onClick={handleJsonSample}
                  variant="outlined"
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    px: 2,
                    py: 0.5,
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.15)',
                      borderColor: 'rgba(255,255,255,0.8)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
                <Chip
                  label="💻 Code Sample"
                  onClick={handleCodeSample}
                  variant="outlined"
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    px: 2,
                    py: 0.5,
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.15)',
                      borderColor: 'rgba(255,255,255,0.8)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Unique Input Layout */}
      <Paper 
        elevation={2} 
        sx={{ 
          mb: 3, 
          borderRadius: 3,
          overflow: 'hidden',
          border: '2px solid #e9ecef'
        }}
      >
        {/* Input Headers with Icon Indicators */}
        <Box sx={{ 
          display: 'flex', 
          bgcolor: 'linear-gradient(90deg, #f1f3f4 0%, #f8f9fa 50%, #f1f3f4 100%)',
          borderBottom: '2px solid #dee2e6'
        }}>
          <Box sx={{ 
            flex: 1, 
            p: 2, 
            borderRight: '1px solid #dee2e6',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: '#dc3545',
              boxShadow: '0 0 8px rgba(220, 53, 69, 0.4)'
            }} />
            <Typography variant="subtitle1" fontWeight={600} color="#495057">
              📄 Source Document
            </Typography>
          </Box>
          <Box sx={{ 
            flex: 1, 
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: '#28a745',
              boxShadow: '0 0 8px rgba(40, 167, 69, 0.4)'
            }} />
            <Typography variant="subtitle1" fontWeight={600} color="#495057">
              📄 Target Document
            </Typography>
          </Box>
        </Box>

        {/* Text Input Areas with Swap Button */}
        <Box sx={{ display: 'flex', minHeight: '400px', position: 'relative' }}>
          <Box sx={{ flex: 1, borderRight: '1px solid #dee2e6' }}>
            <TextField
              multiline
              rows={18}
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Paste your original text, JSON, XML, or code here..."
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  border: 'none',
                  fontFamily: 'Fira Code, Monaco, Consolas, monospace',
                  fontSize: '14px',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' },
                  bgcolor: '#fafbfc'
                },
                '& .MuiInputBase-input': {
                  padding: '16px !important'
                }
              }}
            />
          </Box>

          {/* Swap Button */}
          <Box sx={{ 
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}>
            <LoadingButton
              onClick={handleSwap}
              loading={false}
              variant="contained"
              size="small"
              disabled={!text1.trim() && !text2.trim()}
              sx={{
                minWidth: '48px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#667eea !important',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  backgroundColor: '#5a67d8 !important',
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                  transform: 'scale(1.05)'
                },
                '&:disabled': {
                  backgroundColor: '#e2e8f0 !important',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                },
                transition: 'all 0.2s ease'
              }}
              title="Swap left and right content"
            >
              ⇄
            </LoadingButton>
          </Box>

          <Box sx={{ flex: 1 }}>
            <TextField
              multiline
              rows={18}
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Paste your modified text, JSON, XML, or code here..."
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  border: 'none',
                  fontFamily: 'Fira Code, Monaco, Consolas, monospace',
                  fontSize: '14px',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' },
                  bgcolor: '#f8f9fa'
                },
                '& .MuiInputBase-input': {
                  padding: '16px !important'
                }
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Action Buttons with Unique Styling */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 3,
          background: 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)',
          border: '1px solid #e9ecef'
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <LoadingButton
            onClick={handleCompare}
            loading={diffApi.loading}
            disabled={!text1.trim() && !text2.trim()}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              borderColor: '#6c757d !important',
              borderWidth: '1px !important',
              color: '#6c757d !important',
              backgroundColor: 'transparent !important',
              '&:hover': {
                borderColor: '#5a6268 !important',
                borderWidth: '1px !important',
                color: '#5a6268 !important',
                bgcolor: 'rgba(108, 117, 125, 0.04) !important'
              },
              '&:disabled': {
                borderColor: '#6c757d !important',
                borderWidth: '1px !important',
                color: '#6c757d !important',
                backgroundColor: 'transparent !important',
                opacity: 0.6
              },
              '&.Mui-disabled': {
                borderColor: '#6c757d !important',
                color: '#6c757d !important'
              }
            }}
          >
            🔍 Analyze Differences
          </LoadingButton>
          
          <LoadingButton
            onClick={handleClear}
            loading={false}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              borderColor: '#6c757d !important',
              borderWidth: '1px !important',
              color: '#6c757d !important',
              backgroundColor: 'transparent !important',
              '&:hover': {
                borderColor: '#5a6268 !important',
                borderWidth: '1px !important',
                color: '#5a6268 !important',
                bgcolor: 'rgba(108, 117, 125, 0.04) !important'
              }
            }}
          >
            🗑️ Clear All
          </LoadingButton>
        </Box>
      </Paper>

      {/* Error Display */}
      {diffApi.error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 3,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          ❌ {diffApi.error}
        </Alert>
      )}

      {diffApi.data && (
        <>
          {diffApi.data.identical ? (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }}
            >
              ✅ The texts are identical! No differences found.
            </Alert>
          ) : (
            <>
              {/* Enhanced Side-by-Side Comparison for All Formats */}
              {renderEnhancedSideBySide()}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default DiffTool; 