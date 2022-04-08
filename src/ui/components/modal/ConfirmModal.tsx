// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TrashIcon } from '@heroicons/react/outline';
import { ModalBase as Modal } from './ModalBase';
import type { ModalProps } from './ModalBase';

interface Props extends ModalProps {
  confirm: () => void;
}

export const ConfirmModal = ({ isOpen, setIsOpen, confirm }: Omit<Props, 'title'>) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Confirm action">
      <div className="py-8 dark:text-gray-500 text-gray-400 text-sm">
        <p className="mb-8">
          You will remove the metadata for this contract instance from browser storage. This
          operation has no on-chain consequences. <br /> The forget operation only limits your
          access to the contract on this browser.
        </p>
        <button
          title="Forget contract"
          className="flex font-semibold items-center dark:text-gray-300 dark:bg-elevation-1 dark:hover:bg-elevation-2 dark:border-gray-700 text-gray-600 hover:text-gray-400 border h-full p-3 rounded"
          onClick={() => confirm()}
        >
          <p className="mr-2 text-xs">Forget contract</p>
          <TrashIcon className="w-4 dark:text-gray-500 mr-1 justify-self-end" />
        </button>
      </div>
    </Modal>
  );
};
