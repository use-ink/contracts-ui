// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from '../components/sidebar';

export const Layout = () => (
  <div className="relative md:fixed flex min-h-screen inset-0 overflow-hidden dark:bg-gray-900 dark:text-white text-black">
    <Sidebar />
    <Outlet />
  </div>
);
