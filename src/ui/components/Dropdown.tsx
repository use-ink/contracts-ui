import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';
import type { DropdownOption, OptionProps } from 'types';

interface Props {
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
  onChange: (o: DropdownOption) => void;
  options?: DropdownOption[];
  optionView?: (_: OptionProps) => React.ReactElement<OptionProps>;
  placeholder?: React.ReactNode;
  value?: DropdownOption;
}

function OptionView ({ value }: OptionProps): React.ReactElement<OptionProps> {
  return (
    <>
      {value.name}
    </>
  )
}

export const Dropdown = ({
  optionView: Option = OptionView,
  options,
  placeholder,
  className,
  onChange,
  value,
}: Props) => {
  console.log(value);
  return options ? (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative mt-1 ${className || ''}`}>
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left dark:text-gray-300 text-gray-500 rounded border dark:border-gray-700 border-gray-200 cursor-default focus:outline-none">
          <span className="block truncate">
            {options.length > 0
              ? value && <Option value={value} />
              : placeholder
            }
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 w-full py-1 mt-1 dark:bg-gray-900 border dark:border-gray-stroke border-gray-200 text-base dark:text-gray-300 text-gray-500 bg-white rounded">
            {options.map(option => (
              <Listbox.Option
                key={option.value.toString()}
                className={({ active }) =>
                  `${active ? 'text-amber-900 bg-amber-100' : 'dark:text-gray-300'}
                          cursor-default select-none relative py-2 pl-4 pr-10 dark:hover:bg-elevation-2`
                }
                value={option}
              >
                {({ selected, active }) => {
                  console.log(selected);
                  return (
                  <>
                    <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                      <Option value={option} />
                    </span>
                    {selected ? (
                      <span
                        className={`${active ? 'text-amber-600' : 'text-amber-600'}
                                absolute inset-y-0 right-0 flex items-center pr-3`}
                      >
                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )
                }}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  ) : null;
};
