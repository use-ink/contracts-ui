// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SetState } from '~/types';
import { classes } from '~/lib/util';

interface Tab {
  id: string;
  isDisabled?: boolean;
  label: React.ReactNode;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[];
  index: number;
  setIndex: SetState<number>;
  tabs: Tab[];
}

export function Tabs({ children, index, setIndex, tabs }: Props) {
  return (
    <>
      <div className="grid w-full grid-cols-12">
        <ul
          className="routed-tabs col-span-6 lg:col-span-7 2xl:col-span-8"
          data-cy="contract-page-tabs"
        >
          {tabs.map(({ id, label }, tabIndex) => {
            return (
              <li className="mr-1" key={id}>
                <button
                  className={classes('tab', index === tabIndex && 'active')}
                  onClick={() => setIndex(tabIndex)}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {children.map((child, i) => {
        return (
          <div className={index !== i ? 'hidden' : 'block'} key={`child-${i}`}>
            {child}
          </div>
        );
      })}
    </>
  );
}
