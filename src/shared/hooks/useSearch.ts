import { useState, useMemo } from 'react';
import { TOOLS_METADATA, ToolMetadata } from '../constants/tools';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return TOOLS_METADATA;
    
    const query = searchQuery.toLowerCase().trim();
    const queryWords = query.split(' ').filter(word => word.length > 0);
    
    return TOOLS_METADATA.filter(tool => {
      // Direct matches in name, description
      const nameMatch = tool.label.toLowerCase().includes(query);
      const descMatch = tool.description.toLowerCase().includes(query);
      
      // Keyword matches
      const keywordMatch = tool.keywords.some(keyword => 
        keyword.toLowerCase().includes(query)
      );
      
      // Multi-word fuzzy matching
      const fuzzyMatch = queryWords.every(word => 
        tool.label.toLowerCase().includes(word) ||
        tool.description.toLowerCase().includes(word) ||
        tool.keywords.some(keyword => keyword.toLowerCase().includes(word))
      );
      
      return nameMatch || descMatch || keywordMatch || fuzzyMatch;
    }).sort((a, b) => {
      // Sort by relevance - exact matches first, then by usage frequency
      const aExact = a.label.toLowerCase().includes(query);
      const bExact = b.label.toLowerCase().includes(query);
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Then by usage frequency
      const frequencyOrder = { high: 0, medium: 1, low: 2 };
      return frequencyOrder[a.usageFrequency] - frequencyOrder[b.usageFrequency];
    });
  }, [searchQuery]);

  const clearSearch = () => setSearchQuery('');

  return {
    searchQuery,
    setSearchQuery,
    filteredTools,
    clearSearch,
    hasResults: filteredTools.length > 0,
    hasQuery: searchQuery.trim().length > 0
  };
}; 