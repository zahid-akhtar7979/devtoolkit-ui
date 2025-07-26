import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOOLS_METADATA } from '../constants/tools';

export const useKeyboardShortcuts = (onSearchFocus?: () => void) => {
  const navigate = useNavigate();

  const handleKeyboardShortcut = useCallback((event: KeyboardEvent) => {
    // Check if user is typing in an input field
    const target = event.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || 
                        target.tagName === 'TEXTAREA' || 
                        target.contentEditable === 'true';

    // Don't trigger shortcuts when typing in input fields (except for specific cases)
    if (isInputField && !(event.ctrlKey || event.metaKey)) {
      return;
    }

    // Handle Ctrl+K or Cmd+K for search focus
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      if (onSearchFocus) {
        onSearchFocus();
      }
      return;
    }

    // Handle Ctrl+number shortcuts for tools
    if ((event.ctrlKey || event.metaKey) && /^[1-9]$/.test(event.key)) {
      event.preventDefault();
      
      const number = parseInt(event.key);
      const toolsWithShortcuts = TOOLS_METADATA.filter(tool => tool.shortcut);
      
      if (number <= toolsWithShortcuts.length) {
        const tool = toolsWithShortcuts[number - 1];
        if (tool) {
          navigate(tool.path);
        }
      }
      return;
    }

    // Handle ESC key to clear search or close modals
    if (event.key === 'Escape') {
      // You can add more ESC key handling here
      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [navigate, onSearchFocus]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcut);
    
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcut);
    };
  }, [handleKeyboardShortcut]);

  // Return shortcut information for UI display
  const getShortcutInfo = () => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? '⌘' : 'Ctrl';
    
    return {
      modifierKey,
      searchShortcut: `${modifierKey}+K`,
      toolShortcuts: TOOLS_METADATA
        .filter(tool => tool.shortcut)
        .map(tool => ({
          ...tool,
          displayShortcut: tool.shortcut?.replace('Ctrl', modifierKey)
        }))
    };
  };

  return {
    getShortcutInfo
  };
}; 