// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { EmojiSadIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router';
import { Button } from 'ui/components';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="w-full overflow-y-auto overflow-x-hidden px-5 py-3 m-2 flex justify-center items-center">
      <div className=" w-7/12 h-60 border dark:border-gray-700 grid place-content-center">
        <EmojiSadIcon className="w-10 h-10 text-green-400 mb-1 justify-self-center" />
        <p className="text-sm text-gray-300 mb-6">This page does not exist.</p>
        <Button onClick={() => navigate('/')} variant="primary" className="justify-self-center">
          Go Home
        </Button>
      </div>
    </div>
  );
}
