import { ComponentType, ReactNode } from 'react';

export default interface RouteInterface {
  path: string;
  exact: boolean;
  fallback: NonNullable<ReactNode> | null;
  component?: ComponentType<any>;
  routes?: RouteInterface[];
  redirect?: string;
}
