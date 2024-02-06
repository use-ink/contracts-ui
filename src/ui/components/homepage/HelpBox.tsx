// Copyright 2022-2024 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export function HelpBox(): React.ReactElement | null {
  return (
    <div className="mb-8 border-b border-gray-200 pb-8  dark:border-gray-800">
      <div className="relative flex w-auto flex-col gap-2 rounded border border-gray-200 p-4 dark:border-gray-800 dark:bg-elevation-1">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            New to ink!? Check out the documentation!
          </div>
          <div className="text-sm font-semibold text-blue-500">
            <a href="https://use.ink/" target="_blank" rel="noreferrer">
              use.ink
            </a>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Need some guidance? Find an example!
          </div>
          <div className="text-sm font-semibold text-blue-500">
            <a href="https://github.com/paritytech/ink-examples" target="_blank" rel="noreferrer">
              github.com/paritytech/ink-examples
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
