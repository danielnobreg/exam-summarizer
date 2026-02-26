import React from 'react';

export const renderFormattedText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="text-gray-900 font-extrabold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};
