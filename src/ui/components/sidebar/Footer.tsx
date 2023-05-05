// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChatAltIcon, CogIcon } from '@heroicons/react/outline';
import { useCallback, useState } from 'react';
import { HelpModal } from 'ui/components/modal';
import { SettingsModal } from 'ui/components/modal/SettingsModal';

type ModalName = 'help' | 'settings';

export function Footer() {
  const [visibleModal, setVisibleModal] = useState<ModalName | undefined>(undefined);

  const createSetVisibleModal = useCallback(
    (modal: ModalName) => (isOpen: boolean) => {
      if (isOpen) {
        setVisibleModal(modal);
      } else {
        setVisibleModal(undefined);
      }
    },
    [setVisibleModal]
  );

  return (
    <footer className="footer">
      <div>
        <a
          className="text-md flex cursor-pointer content-center items-center py-2 font-medium text-gray-600 hover:text-gray-400 dark:text-gray-300 dark:hover:text-gray-300 md:py-0 md:text-xs md:dark:text-gray-400"
          onClick={() => setVisibleModal('help')}
        >
          <ChatAltIcon className="mr-2 h-4 w-4 dark:text-gray-500" aria-hidden="true" />
          Help &amp; Feedback
        </a>
        <a
          className="text-md flex cursor-pointer content-center items-center py-2 font-medium text-gray-600 hover:text-gray-400 dark:text-gray-300 dark:hover:text-gray-300 md:py-0 md:text-xs md:dark:text-gray-400"
          onClick={() => setVisibleModal('settings')}
        >
          <CogIcon
            className="mr-2 h-4 w-4 text-gray-600 hover:text-gray-400 dark:text-gray-500 dark:hover:text-gray-300"
            aria-hidden="true"
          />
          <div className="text-md dark:text-gray-300 md:hidden">Settings</div>
        </a>
      </div>
      <HelpModal setIsOpen={createSetVisibleModal('help')} isOpen={visibleModal === 'help'} />
      <SettingsModal
        setIsOpen={createSetVisibleModal('settings')}
        isOpen={visibleModal === 'settings'}
      />
    </footer>
  );
}
