// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import { Fragment, ReactNode } from 'react';

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: (_: boolean) => void;
  title: string;
  children?: ReactNode | undefined;
};

export const ModalBase = ({ isOpen, setIsOpen, title, children }: ModalProps) => {
  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-99 overflow-y-auto " onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black dark:opacity-70 opacity-10" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-lg  my-8 overflow-hidden text-left align-middle transition-all transform opacity-100 dark:bg-gray-900 bg-white shadow-xl rounded-xl">
                <div className="flex justify-between border-b dark:border-gray-800 border-gray-200">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 p-6 dark:text-gray-300 text-gray-600"
                  >
                    {title}
                  </Dialog.Title>
                  <XIcon
                    className="w-4 h-4 mx-6 mt-7 text-gray-500 cursor-pointer"
                    aria-hidden="true"
                    onClick={closeModal}
                  />
                </div>
                <div className="px-6">{children}</div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
