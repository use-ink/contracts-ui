// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useCallback } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import { Button } from '../common/Button';
import { useLocalStorage } from 'ui/hooks';

export function HelpBox(): React.ReactElement | null {
  const { t } = useTranslation();
  const [closedHelpBox, setClosedHelpBox] = useLocalStorage('closedHelpBox', false);

  const onClose = useCallback(() => {
    setClosedHelpBox(true);
  }, [setClosedHelpBox]);

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
          {t('helpBoxHeader', 'Get started writing smart contracts')}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 pb-2">
          {t(
            'helpBoxText',
            'Substrate Contracts UI lets you explore and interact with smart contracts written in ink! - a smart contract language based on Rust!'
          )}{' '}
          <a
            href="https://paritytech.github.io/ink-docs/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500"
          >
            {t('helpBoxPrompt', 'Learn more')}
          </a>
        </div>
        <div>
          <a
            href="https://github.com/paritytech/ink/tree/master/examples"
            target="_blank"
            rel="noreferrer"
          >
            <Button className="border-2 py-1.5 px-3 text-gray-500" variant="default">
              {t('helpBoxButton', 'Explore Examples')}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
