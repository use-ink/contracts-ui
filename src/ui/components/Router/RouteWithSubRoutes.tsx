// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { RouteInterface } from 'types';

export const RouteWithSubRoutes = (route: RouteInterface) => {
  return (
    <Suspense fallback={route.fallback}>
      <Route
        path={route.path}
        render={props => route.component && <route.component {...props} routes={route.routes} />}
      />
    </Suspense>
  );
};
