import React from 'react';
import { Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import AddContract from './components/AddContract';

interface RouteInterface {
  path: string;
  exact: boolean;
  component: React.ComponentType<any>;
  routes?: RouteInterface[];

  fallback: NonNullable<React.ReactNode> | null;
  redirect?: string;
  private?: boolean;
}

export const routes: RouteInterface[] = [
  {
    path: '/',
    exact: false,
    component: Homepage,
    fallback: <div> Loading... </div>,
  },
  {
    path: '/add-contract',
    exact: false,
    component: AddContract,
    fallback: <div> Loading... </div>,
  },
];

export function RouteWithSubRoutes(route: RouteInterface) {
  return (
    <Route path={route.path} exact={route.exact}>
      <route.component routes={route.routes} />
    </Route>
  );
}
