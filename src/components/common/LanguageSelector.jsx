import React from 'react';
import { useAppContext } from '../../context/AppContext';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
];

const LanguageSelector = () => {
  const { language, updateLanguage } = useAppContext();

  return (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-text-secondary text-sm" aria-hidden="true">translate</span>
      <select
        value={language}
        onChange={(e) => updateLanguage(e.target.value)}
        className="bg-card border border-border rounded-lg px-2 py-1 text-xs font-bold text-text-primary focus:ring-2 focus:ring-primary outline-none cursor-pointer"
        aria-label="Select Language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
