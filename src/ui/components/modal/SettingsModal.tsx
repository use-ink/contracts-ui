// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CustomEndpoint } from '../settings/CustomEndpoint';
import { ThemeMode } from '../settings/ThemeMode';
import type { ModalProps } from './ModalBase';
import { ModalBase as Modal } from './ModalBase';

export const SettingsModal = ({ isOpen, setIsOpen }: Omit<ModalProps, 'title'>) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Settings">
      <div className="mt-4 grid gap-4 border-b border-gray-200 pb-10 text-gray-600 dark:border-gray-800 dark:text-white">
        <h2 className="mb-2 pb-1 text-lg">Appearance</h2>
        <ThemeMode />
      </div>

      <div className="mt-4 border-b border-gray-200 pb-10 text-gray-600 dark:border-gray-800 dark:text-white">
        <h2 className="mb-2 pb-1 text-lg">Local Node</h2>
        <CustomEndpoint />
      </div>
    </Modal>
  );
};
