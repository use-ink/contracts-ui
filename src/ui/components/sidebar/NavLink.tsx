import React from 'react';
import { NavLink as NavLinkBase, NavLinkProps } from 'react-router-dom';

interface Props extends NavLinkProps {
  icon: (_: React.ComponentProps<'svg'>) => JSX.Element;
}

export function NavLink ({ children, icon: Icon, ...props }: Props): React.ReactElement<Props> {
  return (
    <NavLinkBase
      className={'group dark:text-gray-300 text-gray-600 border border-transparent dark:hover:text-white flex items-center px-2 py-1 text-sm font-medium rounded-md'}
      activeClassName='active dark:bg-elevation-2 dark:border-gray-stroke border-gray-200'
      {...props}
    >
      <Icon className="mr-1.5 h-5 w-5 dark:text-gray-500 dark:group-hover:text-gray-300" />
      {children}
    </NavLinkBase>
  );
}