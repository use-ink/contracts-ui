import React, { useCallback } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { useLocalStorage } from 'ui/hooks/useLocalStorage';

export function HelpBox (): React.ReactElement | null {
  const [closedHelpBox, setClosedHelpBox] = useLocalStorage('closedHelpBox', false);
  
  const onClose = useCallback(
    () => {
      setClosedHelpBox(true);
    },
    []
  )

  if (closedHelpBox) {
    return null;
  }

  return (
    <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
      <div className="relative border p-4 dark:bg-elevation-1 dark:border-gray-800 border-gray-200 rounded w-auto">
        <XIcon
          className="w-5 h-5 absolute right-0 top-0 m-1 text-gray-500 justify-self-end cursor-pointer"
          aria-hidden="true"
          onClick={onClose}
        />
        <div className="text-sm font-semibold text-blue-500 pb-1">
        Get started writing smart contracts
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 pb-2">
        The Canvas Playground lets you explore and prototype smart contracts written in ink! - a smart contract language based on Rust!
          {' '}
          <Link to='/'>
          Learn more
          </Link>
        </div>
        <div>
          <Link to="/">
            <button className="text-xs border-2 py-1.5 px-3 rounded dark:bg-elevation-2 border-gray-200 dark:border-gray-700">
            Explore Examples
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}