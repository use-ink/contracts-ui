// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SetState } from 'types';
import { classes } from 'ui/util';

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
      <div className="grid grid-cols-12 w-full">
        <ul className="routed-tabs col-span-6 lg:col-span-7 2xl:col-span-8">
          {tabs.map(({ id, label }, tabIndex) => {
            return (
              <li key={id} className="mr-1">
                <button
                  onClick={() => setIndex(tabIndex)}
                  className={classes('tab', index === tabIndex && 'active')}
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
          <div key={`child-${i}`} className={index !== i ? 'hidden' : 'block'}>
            {child}
          </div>
        );
      })}
    </>
  );
}
