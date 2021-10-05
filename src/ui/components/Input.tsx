import React from 'react';

//to do: input validation - check if hash exists
interface Props extends React.HTMLAttributes<HTMLInputElement> {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const Input = ({ value, handleChange, placeholder = '' }: Props) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full text-sm dark:bg-gray-900 dark:text-gray-300 bg-white dark:border-gray-700 border-gray-200 rounded"
      />
    </div>
  );
};
