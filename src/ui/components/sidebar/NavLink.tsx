import React from 'react';
import { NavLink as NavLinkBase, NavLinkProps } from 'react-router-dom';

interface Props extends NavLinkProps {
  icon: (_: React.ComponentProps<'svg'>) => JSX.Element;
}

export function NavLink ({ children, icon: Icon, ...props }: Props): React.ReactElement<Props> {
  return (
    <NavLinkBase
      className='nav-link group'
      {...props}
    >
      <Icon className="dark:group-hover:text-gray-300" />
      {children}
    </NavLinkBase>
  );
}