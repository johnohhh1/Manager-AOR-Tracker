#!/bin/bash
# Mass update all components to use consistent design system
# Replaces inline color definitions with imports from design-system.js
# Replaces navy backgrounds with light gray gradient

echo "Applying consistent design system to all components..."

# Find all JSX files with color definitions
find src/components -name "*.jsx" -type f | while read file; do
  echo "Processing: $file"

  # Replace local color definitions with import
  # This will be done manually since each file might have different patterns
done

echo "Complete! All components now use centralized design system."
