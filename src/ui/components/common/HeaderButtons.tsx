// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { ArrowCircleRightIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ContractDocument } from 'types';

interface Props {
  contract: ContractDocument;
}

export function HeaderButtons({ contract }: Props) {
  const { t } = useTranslation();
  return (
    <div className="inline-flex dark:text-gray-300 relative h-8 text-xs right-0">
      <div className="inline-flex h-8">
        <Link to={`/instantiate/${contract.codeHash}`}>
          <button className="flex font-semibold items-center dark:text-gray-300 dark:bg-elevation-1 dark:hover:bg-elevation-2 dark:border-gray-700 text-gray-600 hover:text-gray-400 border h-full px-3 rounded">
            <ArrowCircleRightIcon
              className="w-4 dark:text-gray-500 mr-1 justify-self-end"
              aria-hidden="true"
              fontSize="1.5rem"
            />
            {t('reinstantiate', 'Reinstantiate')}
          </button>
        </Link>
      </div>
    </div>
  );
}
