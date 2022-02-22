// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { NavLink as NavLinkBase, NavLinkProps } from 'react-router-dom';

interface Props extends NavLinkProps {
  icon: (_: React.ComponentProps<'svg'>) => JSX.Element;
}

export function NavLink({ children, icon: Icon, ...props }: Props): React.ReactElement<Props> {
  return (
    <NavLinkBase className="nav-link group" {...props}>
      <Icon className="dark:group-hover:text-gray-300 group-hover:text-gray-400" />
      {children}
    </NavLinkBase>
  );
}
