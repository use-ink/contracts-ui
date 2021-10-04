import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AwaitApis } from '../AwaitApis';
import { Homepage } from '../pages';
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
          routes.map((route: RouteInterface) => <RouteWithSubRoutes key={route.path} {...route} />)}
        <Route path="*" component={Homepage} />
      </Switch>
    </AwaitApis>
  );
};
