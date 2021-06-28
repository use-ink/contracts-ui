import { ComponentType, ReactNode } from 'react';

export interface Route {
  path: string;
  exact: boolean;
  fallback: NonNullable<ReactNode> | null;
  component?: ComponentType<any>;
  routes?: Route[];
  redirect?: string;
}
