import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  name,
  className = '',
  disabled = false,
  required = false,
}) => {
  const baseStyles = 'w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm';

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      disabled={disabled}
      required={required}
      className={`${baseStyles} ${className}`}
    />
  );
};
