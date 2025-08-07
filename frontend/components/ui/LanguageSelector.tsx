import React from 'react';

const LanguageSelector: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <select className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white">
        <option value="en">English</option>
        <option value="pt">Português</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
};

export { LanguageSelector };
export default LanguageSelector; 