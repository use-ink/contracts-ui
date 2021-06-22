import React from 'react';

//to do: input validation - check if hash exists
interface Props extends React.HTMLAttributes<HTMLInputElement> {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const CodeHashInput = ({ value, handleChange, placeholder = '' }: Props) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full bg-white border-gray-300"
      />
    </div>
  );
};

export default CodeHashInput;
