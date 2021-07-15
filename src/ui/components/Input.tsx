import React from 'react';

//to do: input validation - check if hash exists
interface Props extends React.HTMLAttributes<HTMLInputElement> {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const Input = ({ value, handleChange, placeholder = '' }: Props) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full dark:bg-gray-900 dark:text-gray-300 bg-white dark:border-gray-700 rounded"
      />
    </div>
  );
};
