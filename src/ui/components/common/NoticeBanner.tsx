// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { EmojiSadIcon } from '@heroicons/react/outline';

export function NoticeBanner({ isVisible, endpoint }: { isVisible: boolean; endpoint: string }) {
  return isVisible ? (
    <div className="bg-gray-200 dark:bg-gray-800 text-gray-400 fixed top-10 left-1/3 right-1/3 p-6 z-50 text-center h-2/5 w-2/5 flex flex-col justify-center items-center">
      <EmojiSadIcon className="w-10 h-10 text-red-400 mb-1 justify-self-center" />

      <h2 className="text-red-400 text-2xl mb-3">Unsuported node version. </h2>
      <p>
        Looks like your node does not support <span>WeigthV2</span>.
      </p>
      <p>
        Upgrade your node or{' '}
        <a
          href={`https://weightv1--contracts-ui.netlify.app/?rpc=${endpoint}`}
          className="text-blue-400 underline"
        >
          click here
        </a>{' '}
        to use an older version of Contracts UI.
      </p>
    </div>
  ) : null;
}
