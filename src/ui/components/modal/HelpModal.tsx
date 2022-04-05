// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChevronRightIcon } from '@heroicons/react/outline';
import { BookOpenIcon } from '@heroicons/react/solid';
import { GithubLogo, StackExchangeLogo } from './Logos';
import { ModalBase as Modal } from './ModalBase';
import type { ModalProps } from './ModalBase';

export const HelpModal = ({ isOpen, setIsOpen }: Omit<ModalProps, 'title'>) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Help">
      <ul className="dark:text-gray-200 text-gray-600 text-sm">
        <li>
          <a
            className="group flex w-full justify-between items-center border-b dark:border-gray-800 border-gray-200 dark:text-white text-gray-600"
            href="https://paritytech.github.io/ink-docs/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex py-4">
              <div className="w-5 mr-2" style={{ position: 'relative', top: 2 }}>
                <BookOpenIcon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <strong>ink! Docs</strong>
                <span className="dark:text-gray-400 text-gray-500">
                  Read more about the ink! smart contract language.
                </span>
              </div>
            </div>
            <ChevronRightIcon className="h-4 w-4 dark:text-gray-400 text-gray-500 group-hover:opacity-50" />
          </a>
        </li>
        <li>
          <a
            className="group flex w-full justify-between items-center border-b dark:border-gray-800 border-gray-200 dark:text-white text-gray-600"
            href="https://substrate.stackexchange.com/questions/tagged/smart-contract?sort=Newest"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex py-4">
              <div className="w-5 mr-2" style={{ position: 'relative', top: 2 }}>
                <StackExchangeLogo />
              </div>
              <div className="flex flex-col">
                <strong>Stack Exchange</strong>
                <span className="dark:text-gray-400 text-gray-500">
                  Browse through common questions.{' '}
                </span>
              </div>
            </div>
            <ChevronRightIcon className="h-4 w-4 dark:text-gray-400 text-gray-500 group-hover:opacity-50" />
          </a>
        </li>
        <li>
          <a
            className="group flex w-full justify-between items-center"
            href="https://github.com/paritytech/contracts-ui"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex py-4">
              <div className="w-5 mr-2 relative" style={{ position: 'relative', top: 1 }}>
                <GithubLogo />
              </div>
              <div className="flex flex-col">
                <strong>Github Repo</strong>
                <span className="dark:text-gray-400 text-gray-500">
                  Let us know if there is an issue.{' '}
                </span>
              </div>
            </div>
            <ChevronRightIcon className="h-4 w-4 dark:text-gray-400 text-gray-500 group-hover:opacity-50" />
          </a>
        </li>
      </ul>
    </Modal>
  );
};
