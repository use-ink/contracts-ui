import React from 'react';
import { Identicon } from '@polkadot/react-identicon';
import { Dropdown } from './Dropdown';
import type { DropdownProps, KeyringPair, OptionProps } from 'types';
import { createAccountOptions } from 'canvas/util';
import { useCanvas } from 'ui/contexts';

// interface AccountProps {
//   value: KeyringPair;
// }

// type Props = SimpleSpread<
//   React.HTMLAttributes<HTMLDivElement>,
//   {
//     onChange: (_: string) => void;
//     value: string | null;
//   }
// >

type Props = Omit<DropdownProps<string>, 'options'>;

function Account ({ option: { name, value } }: OptionProps<string>) {
  return (
    <div className="flex">
      <Identicon size={38} value={value} className="pr-2" />
      <div className="block truncate">
        <span className="flex text-base dark:text-gray-300 text-gray-700">
          {name}
        </span>
        <p className="text-gray-500 text-xs">
          {String(value).slice(0, 4) +
            '...' +
            String(value).slice(-4)}
        </p>
      </div>
    </div>
  )
}

export function AccountSelect ({
  isDisabled,
  isError,
  value,
  onChange,
  children: placeholder = 'No Accounts Found',
  className,
}: Props) {
  const { keyring } = useCanvas();
  const options = createAccountOptions(keyring?.getPairs() as KeyringPair[]);

  return (
    <Dropdown
      button={Account}
      className={className}
      isDisabled={isDisabled}
      isError={isError}
      option={Account}
      onChange={onChange}
      options={options}
      value={value}
    >
      {placeholder}
    </Dropdown>
  )

  // return (
  //   <>
  //     <Listbox value={value} onChange={changeHandler}>
  //       <div className={`relative mt-1 ${className || ''}`}>
  //         <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left dark:text-gray-300 text-gray-500 dark:bg-gray-900 bg-white rounded border dark:border-gray-700 border-gray-200 cursor-default focus:outline-none">
  //           <div className="flex">
  //             <Identicon size={38} value={selectedOption?.value as string} className="pr-2" />
  //             <div className="block truncate">
  //               <span className="flex text-base dark:text-gray-300 text-gray-700">
  //                 {options.length > 0 ? selectedOption && selectedOption.name : placeholder}
  //               </span>
  //               <p className="text-gray-500 text-xs">
  //                 {String(selectedOption?.value).slice(0, 4) +
  //                   '...' +
  //                   String(selectedOption?.value).slice(-4)}
  //               </p>
  //             </div>
  //           </div>
  //           <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
  //             <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
  //           </span>
  //         </Listbox.Button>
  //         <Transition
  //           as={Fragment}
  //           leave="transition ease-in duration-100"
  //           leaveFrom="opacity-100"
  //           leaveTo="opacity-0"
  //         >
  //           <Listbox.Options className="absolute z-50 w-full overflow-y-auto py-1 mt-1 dark:bg-gray-900 border dark:border-gray-stroke border-gray-200 text-base dark:text-gray-300 text-gray-500 bg-white rounded">
  //             {options.map(option => (
  //               <Listbox.Option
  //                 key={option.name}
  //                 className={({ active }) =>
  //                   `${active ? 'text-amber-900 bg-amber-100' : 'dark:text-gray-300'}
  //                         text-base cursor-default select-none relative py-2 pl-4 pr-4 dark:hover:bg-elevation-2`
  //                 }
  //                 value={option}
  //               >
  //                 {({ selected, active }) => (
  //                   <>
  //                     <div className="flex">
  //                       <Identicon size={38} value={option?.value as string} className="pr-2" />

  //                       <div className="block truncate">
  //                         <span className="flex text-base dark:text-gray-300 text-gray-700">
  //                           {option.name}
  //                         </span>
  //                         <p className="text-gray-500 text-xs">
  //                           {String(option?.value).slice(0, 4) +
  //                             '...' +
  //                             String(option?.value).slice(-4)}
  //                         </p>
  //                       </div>
  //                     </div>

  //                     {selected ? (
  //                       <span
  //                         className={`${active ? 'text-amber-600' : 'text-amber-600'}
  //                               absolute inset-y-0 left-0 flex items-center pl-3`}
  //                       >
  //                         <CheckIcon className="w-5 h-5" aria-hidden="true" />
  //                       </span>
  //                     ) : null}
  //                   </>
  //                 )}
  //               </Listbox.Option>
  //             ))}
  //           </Listbox.Options>
  //         </Transition>
  //       </div>
  //     </Listbox>
  //   </>
  // );
};
