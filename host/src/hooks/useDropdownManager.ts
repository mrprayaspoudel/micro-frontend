import { useEffect, useRef, useCallback } from 'react';

// Global registry to track all active dropdowns
const dropdownRegistry = new Map<string, () => void>();

export const useDropdownManager = (dropdownId: string, isOpen: boolean, onClose: () => void) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Register this dropdown
  useEffect(() => {
    if (isOpen) {
      // Close all other dropdowns when this one opens
      dropdownRegistry.forEach((closeCallback, id) => {
        if (id !== dropdownId) {
          closeCallback();
        }
      });
      dropdownRegistry.set(dropdownId, onClose);
    } else {
      dropdownRegistry.delete(dropdownId);
    }

    return () => {
      dropdownRegistry.delete(dropdownId);
    };
  }, [dropdownId, isOpen, onClose]);

  // Handle clicks outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        // Use requestAnimationFrame to ensure this runs after other click handlers
        requestAnimationFrame(() => {
          onClose();
        });
      }
    };

    // Add event listener with a slight delay to avoid conflicts with button clicks
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return dropdownRef;
};
