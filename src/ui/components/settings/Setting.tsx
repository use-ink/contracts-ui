// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ReactNode } from 'react';

interface Props {
  label: string;
  description: string;
  children: ReactNode;
}
export const Setting = ({ label, description, children }: Props) => (
  <div className="grid grid-cols-12 w-full">
    <div className="flex flex-col col-span-6 lg:col-span-7 2xl:col-span-8 text-sm">
      <span className="font-semibold">{label}</span>
      <span className="dark:text-gray-400 text-gray-500">{description}</span>
    </div>
    <div className="col-span-6 lg:col-span-5 2xl:col-span-4">{children}</div>
  </div>
);
