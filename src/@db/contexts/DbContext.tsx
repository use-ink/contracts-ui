// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React from 'react';

import { DbProps } from '../types';

const DbContext: React.Context<DbProps> = React.createContext({} as unknown as DbProps);
const DbConsumer: React.Consumer<DbProps> = DbContext.Consumer;
const DbProvider: React.Provider<DbProps> = DbContext.Provider;

export { DbContext, DbConsumer, DbProvider };
