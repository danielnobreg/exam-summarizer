import React from 'react';

export const renderFormattedText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="text-slate-100 font-extrabold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export const extractInitialsFromFileName = (fileName) => {
  if (!fileName) return "PAC";
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
  const cleanedName = nameWithoutExt.replace(/\b(lab|exame|laudo|resultado|imagem|image|pdf|jpg|png|jpeg|snapshot)\b/gi, "").trim();
  
  const parts = cleanedName.split(/[\s_-]+/).filter(Boolean);
  if (parts.length === 0) return "PAC";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
