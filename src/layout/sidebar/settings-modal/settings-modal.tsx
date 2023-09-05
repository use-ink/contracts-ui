// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CustomEndpoint } from './custom-endpoint';
import { ThemeMode } from './theme-mode';
import type { ModalProps } from '~/shared/modal';
import { ModalBase as Modal } from '~/shared/modal';

export const SettingsModal = ({ isOpen, setIsOpen }: Omit<ModalProps, 'title'>) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Settings">
      <div className="grid gap-4 pb-10 mt-4 text-gray-600 border-b border-gray-200 dark:border-gray-800 dark:text-white">
        <h2 className="pb-1 mb-2 text-lg">Appearance</h2>
        <ThemeMode />
      </div>

      <div className="pb-10 mt-4 text-gray-600 border-b border-gray-200 dark:border-gray-800 dark:text-white">
        <h2 className="pb-1 mb-2 text-lg">Local Node</h2>
        <CustomEndpoint />
      </div>
    </Modal>
  );
};
