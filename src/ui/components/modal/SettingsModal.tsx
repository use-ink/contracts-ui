// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CustomEndpoint } from '../settings/CustomEndpoint';
import { ThemeMode } from '../settings/ThemeMode';
import type { ModalProps } from './ModalBase';
import { ModalBase as Modal } from './ModalBase';

export const SettingsModal = ({ isOpen, setIsOpen }: Omit<ModalProps, 'title'>) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Settings">
      <div className="grid gap-4 pb-10 border-b border-gray-200 dark:border-gray-800 mt-4 dark:text-white text-gray-600">
        <h2 className="text-lg pb-1 mb-2">Appearance</h2>
        <ThemeMode />
      </div>

      <div className="pb-10 border-b border-gray-200 dark:border-gray-800 mt-4 dark:text-white text-gray-600">
        <h2 className="text-lg pb-1 mb-2">Local Node</h2>
        <CustomEndpoint />
      </div>
    </Modal>
  );
};
