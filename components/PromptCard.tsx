import React from 'react';

interface PromptCardProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder: string;
  name: string;
  isSelect?: boolean;
  options?: string[];
}

export const PromptCard: React.FC<PromptCardProps> = ({ label, value, onChange, placeholder, name, isSelect = false, options = [] }) => {
  const commonClasses = "w-full bg-gray-900 border-2 border-gray-700 rounded-lg p-3 text-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500";
  
  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 transition-all duration-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-900/20">
      <label htmlFor={name} className="block text-sm font-bold mb-2 text-red-400 font-orbitron">
        {label}
      </label>
      <div className="input-decorator input-decorator-red">
        {isSelect ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`${commonClasses} appearance-none`}
          >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            className={`${commonClasses} resize-none`}
          />
        )}
      </div>
    </div>
  );
};