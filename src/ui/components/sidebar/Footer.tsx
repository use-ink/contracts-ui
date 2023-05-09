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
          className="flex content-center items-center py-2 md:py-0 text-md md:text-xs font-medium dark:text-gray-300 md:dark:text-gray-400 text-gray-600 dark:hover:text-gray-300 hover:text-gray-400 cursor-pointer"
          onClick={() => setVisibleModal('help')}
        >
          <ChatAltIcon aria-hidden="true" className="h-4 w-4 mr-2 dark:text-gray-500" />
          Help &amp; Feedback
        </a>
        <a
          className="flex content-center items-center py-2 md:py-0 text-md md:text-xs font-medium dark:text-gray-300 md:dark:text-gray-400 text-gray-600 dark:hover:text-gray-300 hover:text-gray-400 cursor-pointer"
          onClick={() => setVisibleModal('settings')}
        >
          <CogIcon
            aria-hidden="true"
            className="h-4 w-4 mr-2 dark:text-gray-500 dark:hover:text-gray-300 text-gray-600 hover:text-gray-400"
          />
          <div className="text-md md:hidden dark:text-gray-300">Settings</div>
        </a>
      </div>
      <HelpModal isOpen={visibleModal === 'help'} setIsOpen={createSetVisibleModal('help')} />
      <SettingsModal
        isOpen={visibleModal === 'settings'}
        setIsOpen={createSetVisibleModal('settings')}
      />
    </footer>
  );
}
