// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React from 'react';
import { Wizard as InstantiateWizard } from './instantiate';

export function Homepage() {
  return (
    <div id="homepage" className="py-10">
      <InstantiateWizard />
    </div>
  );
}
