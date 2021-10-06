// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Switch } from 'react-router-dom';
import { AwaitApis } from '../AwaitApis';
import { RouteWithSubRoutes } from './RouteWithSubRoutes';
import { RouteInterface } from 'types';
// import { ApiContext, useApi } from 'ui/contexts';

interface Props {
  routes: RouteInterface[];
}

export const Router: React.FC<Props> = ({ routes }) => {
  return (
    <AwaitApis>
      <Switch>
        {routes &&
          routes.map((route: RouteInterface) => <RouteWithSubRoutes key={route.path} {...route} />)}
      </Switch>
    </AwaitApis>
  );
};
