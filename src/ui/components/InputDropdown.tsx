import React from 'react';

interface Props extends React.HTMLAttributes<HTMLElement> {
  inputValue?: string | number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  selectOptions?: { name: string; value: string }[];
}

export const InputDropdown = ({
  inputValue,
  handleInputChange,
  handleSelectChange,
  placeholder = '1,000',
  selectOptions = [],
}: Props) => {
  return (
    <>
      <div className="relative rounded-md shadow-sm">
        <input
          type="text"
          name="endowment"
          value={inputValue}
          onChange={handleInputChange}
          className="focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-gray-300 bg-white block w-full pr-12 sm:text-sm dark:border-gray-700 border-gray-200 rounded-md"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <label htmlFor="unit" className="sr-only">
            Unit
          </label>
          <select
            id="unit"
            name="unit"
            onChange={handleSelectChange}
            className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
          >
            {selectOptions.map((option, key) => (
              <option key={key} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};
