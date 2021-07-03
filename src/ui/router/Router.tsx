import React from 'react';
import { Switch } from 'react-router-dom';
import RouteWithSubRoutes from './RouteWithSubRoutes';
import RouteInterface from './RouteInterface';

interface Props {
  routes: RouteInterface[];
}

const Router: React.FC<Props> = ({ routes }) => {
  return (
    <Switch>
      {routes &&
        routes.map((route: RouteInterface) => <RouteWithSubRoutes key={route.path} {...route} />)}
    </Switch>
  );
};

export default Router;
