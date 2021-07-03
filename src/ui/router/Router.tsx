import React from 'react';
import { Switch } from 'react-router-dom';
import RouteWithSubRoutes from './RouteWithSubRoutes';
import RouteInterface from './RouteInterface';
import { CanvasContext } from '@ui/contexts';

interface Props {
  routes: RouteInterface[];
}

const Router: React.FC<Props> = ({ routes }) => {
  return (
    <CanvasContext.Consumer>
      {({ status, keyringStatus, error }) => (
        <>
          {status === 'READY' && keyringStatus === 'READY' ? (
            <Switch>
              {routes &&
                routes.map((route: RouteInterface) => (
                  <RouteWithSubRoutes key={route.path} {...route} />
                ))}
            </Switch>
          ) : status === 'ERROR' ? (
            `Connection error ${error}`
          ) : keyringStatus !== 'READY' ? (
            "Loading accounts (please review any extension's authorization)"
          ) : (
            'Connecting to substrate node'
          )}
        </>
      )}
    </CanvasContext.Consumer>
  );
};

export default Router;
