import React from "react";

export function capitalizeWords(str) {
  if (!str) return '';
  return str
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function decodeCategoryName(str) {
  if (!str) return '';
  return str.replace(/-/g, ' ');
}