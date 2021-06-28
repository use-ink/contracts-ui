import React from 'react';
import { Switch } from 'react-router-dom';
import RouteWithSubRoutes from './RouteWithSubRoutes';
import { Route } from './Route';

interface Props {
  routes: Route[];
}

const Router: React.FC<Props> = ({ routes }) => {
  return (
    <Switch>
      {routes && routes.map((route: Route) => <RouteWithSubRoutes key={route.path} {...route} />)}
    </Switch>
  );
};

export default Router;
