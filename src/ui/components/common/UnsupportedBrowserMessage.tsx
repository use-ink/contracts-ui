// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Info } from './Info';

const SuggestedBrowsers = [
  ['Mozilla Firefox', 'https://www.mozilla.org/firefox'],
  ['Brave Browser', 'https://brave.com/'],
  ['Google Chrome', 'https://www.google.com/chrome/'],
];

export function UnsupportedBrowserMessage() {
  return (
    <Info>
      <div>Unsupported Browser</div>

      <div className="text-left">
        <p className="mb-3">
          We currently do not support Apple's Safari browser. We recommend using this DApp with one
          of the following browsers:
        </p>
        <div className="flex flex-col gap-2">
          {SuggestedBrowsers.map(([title, url]) => (
            <a className="hover:underline" href={url} key={title} rel="noreferrer" target="_blank">
              {`> ${title}`}
            </a>
          ))}
        </div>
      </div>
    </Info>
  );
}
