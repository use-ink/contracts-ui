import React from 'react';
import { Switch } from 'react-router-dom';
import { AwaitApis } from '../AwaitApis';
import { RouteWithSubRoutes } from './RouteWithSubRoutes';
import { RouteInterface } from 'types';
// import { CanvasContext, useCanvas } from 'ui/contexts';

interface Props {
  routes: RouteInterface[];
}

export const Router: React.FC<Props> = ({ routes }) => {
  return (
    <AwaitApis>
      <Switch>
        {routes &&
                routes.map((route: RouteInterface) => (
                  <RouteWithSubRoutes key={route.path} {...route} />
                ))}
      </Switch>
    </AwaitApis>
  );
};
