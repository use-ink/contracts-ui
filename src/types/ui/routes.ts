// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ComponentType, ReactNode } from 'react';

export interface RouteInterface {
  path: string;
  exact: boolean;
  fallback: NonNullable<ReactNode> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: ComponentType<any>;
  routes?: RouteInterface[];
  redirect?: string;
}

export type UrlParams = { address: string; activeTab: string };
