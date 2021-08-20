import React from 'react';

//to do: input validation - check if hash exists
interface Props extends React.HTMLAttributes<HTMLInputElement> {
  value: string | number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Input = ({
  value,
  handleChange,
  placeholder = '',
  disabled = false,
  className = 'mb-2',
}: Props) => {
  return (
    <div className={className}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full dark:bg-gray-900 dark:text-gray-300 bg-white dark:border-gray-700 border-gray-200 rounded"
      />
    </div>
  );
};
