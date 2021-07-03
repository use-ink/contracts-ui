import React, { Suspense } from 'react';
import { Redirect, Route } from 'react-router-dom';
import RouteInterface from './RouteInterface';

const RouteWithSubRoutes = (route: RouteInterface) => {
  return (
    <Suspense fallback={route.fallback}>
      <Route
        path={route.path}
        render={props =>
          route.redirect ? (
            <Redirect to={route.redirect} />
          ) : (
            route.component && <route.component {...props} routes={route.routes} />
          )
        }
      />
    </Suspense>
  );
};

export default RouteWithSubRoutes;
