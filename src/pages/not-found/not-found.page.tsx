// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { EmojiSadIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router';
import { Button } from '~/shared/buttons';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center w-full px-5 py-3 m-2 overflow-x-hidden overflow-y-auto">
      <div className="grid w-7/12 border h-60 place-content-center dark:border-gray-700">
        <EmojiSadIcon className="w-10 h-10 mb-1 text-green-400 justify-self-center" />
        <p className="mb-6 text-sm text-gray-300">This page does not exist.</p>
        <Button className="justify-self-center" onClick={() => navigate('/')} variant="primary">
          Go Home
        </Button>
      </div>
    </div>
  );
}
