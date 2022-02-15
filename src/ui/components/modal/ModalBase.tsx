// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import React, { Fragment } from 'react';

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: (_: boolean) => void;
  title: string;
};

export const ModalBase: React.FC<ModalProps> = ({ isOpen, setIsOpen, title, children }) => {
  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-99 overflow-y-auto " onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
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
              <div className="inline-block w-full max-w-lg  my-8 overflow-hidden text-left align-middle transition-all transform opacity-100 bg-gray-900 shadow-xl rounded-xl">
                <div className="flex justify-between border-b border-gray-800">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 p-6 text-gray-300">
                    {title}
                  </Dialog.Title>
                  <XIcon
                    className="w-4 h-4 m-6 text-gray-500 cursor-pointer"
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
