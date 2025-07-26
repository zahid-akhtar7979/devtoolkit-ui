import { useState, useEffect, useCallback } from 'react';
import { ToolMetadata, TOOLS_METADATA } from '../constants/tools';

interface UserPreferences {
  recentlyUsed: string[];
  favorites: string[];
  searchHistory: string[];
}

const STORAGE_KEY = 'devtoolkit-preferences';
const MAX_RECENT = 10;
const MAX_SEARCH_HISTORY = 20;

const getDefaultPreferences = (): UserPreferences => ({
  recentlyUsed: [],
  favorites: [],
  searchHistory: []
});

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(getDefaultPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...getDefaultPreferences(), ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((newPreferences: UserPreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }, []);

  // Add tool to recently used
  const addToRecentlyUsed = useCallback((toolId: string) => {
    setPreferences(prev => {
      const filtered = prev.recentlyUsed.filter(id => id !== toolId);
      const newRecentlyUsed = [toolId, ...filtered].slice(0, MAX_RECENT);
      const newPreferences = { ...prev, recentlyUsed: newRecentlyUsed };
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      } catch (error) {
        console.warn('Failed to save recently used:', error);
      }
      
      return newPreferences;
    });
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((toolId: string) => {
    setPreferences(prev => {
      const isFavorite = prev.favorites.includes(toolId);
      const newFavorites = isFavorite
        ? prev.favorites.filter(id => id !== toolId)
        : [...prev.favorites, toolId];
      
      const newPreferences = { ...prev, favorites: newFavorites };
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      } catch (error) {
        console.warn('Failed to save favorites:', error);
      }
      
      return newPreferences;
    });
  }, []);

  // Add to search history
  const addToSearchHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setPreferences(prev => {
      const filtered = prev.searchHistory.filter(q => q !== query);
      const newSearchHistory = [query, ...filtered].slice(0, MAX_SEARCH_HISTORY);
      const newPreferences = { ...prev, searchHistory: newSearchHistory };
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      } catch (error) {
        console.warn('Failed to save search history:', error);
      }
      
      return newPreferences;
    });
  }, []);

  // Clear search history
  const clearSearchHistory = useCallback(() => {
    savePreferences({ ...preferences, searchHistory: [] });
  }, [preferences, savePreferences]);

  // Clear recently used
  const clearRecentlyUsed = useCallback(() => {
    savePreferences({ ...preferences, recentlyUsed: [] });
  }, [preferences, savePreferences]);

  // Get tools by IDs
  const getToolsByIds = useCallback((toolIds: string[]): ToolMetadata[] => {
    return toolIds
      .map(id => TOOLS_METADATA.find(tool => tool.id === id))
      .filter((tool): tool is ToolMetadata => tool !== undefined);
  }, []);

  // Get recently used tools
  const recentlyUsedTools = getToolsByIds(preferences.recentlyUsed);
  
  // Get favorite tools
  const favoriteTools = getToolsByIds(preferences.favorites);

  // Check if tool is favorite
  const isFavorite = useCallback((toolId: string) => {
    return preferences.favorites.includes(toolId);
  }, [preferences.favorites]);

  return {
    preferences,
    recentlyUsedTools,
    favoriteTools,
    addToRecentlyUsed,
    toggleFavorite,
    isFavorite,
    addToSearchHistory,
    clearSearchHistory,
    clearRecentlyUsed,
    searchHistory: preferences.searchHistory
  };
}; 