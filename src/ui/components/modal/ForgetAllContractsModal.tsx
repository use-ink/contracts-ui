// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TrashIcon } from '@heroicons/react/outline';
import { useCallback, useState } from 'react';
import type { ModalProps } from './ModalBase';
import { ModalBase as Modal } from './ModalBase';

interface Props extends ModalProps {
  confirm: () => Promise<void>;
}

export const ForgetAllContractsModal = ({ isOpen, setIsOpen, confirm }: Omit<Props, 'title'>) => {
  const [isBusy, setIsBusy] = useState(false);
  const onConfirm = useCallback(() => {
    setIsBusy(true);
    confirm()
      .then(() => setIsOpen(false))
      .catch(console.error)
      .finally(() => setIsBusy(false));
  }, [confirm, setIsOpen]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Forget All Contracts">
      <div className="py-8 dark:text-gray-500 text-gray-400 text-sm">
        <p className="mb-2">
          You will remove the metadata for all contract instances from browser storage.
        </p>
        <p className="mb-8">
          This operation has no on-chain consequences. The forget operation only removes references
          to these contracts from your browser.
        </p>
        <button
          className="flex font-semibold items-center dark:text-gray-300 justify-self-end dark:bg-elevation-1 dark:hover:bg-elevation-2 dark:border-gray-700 text-gray-600 hover:text-gray-400 border h-full p-3 rounded"
          disabled={isBusy}
          onClick={onConfirm}
          title="Forget contract"
        >
          <p className="mr-2 text-xs">Forget All Contracts</p>
          <TrashIcon className="w-4 dark:text-gray-500 mr-1 justify-self-end" />
        </button>
      </div>
    </Modal>
  );
};
