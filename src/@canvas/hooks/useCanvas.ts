// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useContext } from 'react';
import { CanvasContext } from '../contexts';

export const useCanvas = () => ({ ...useContext(CanvasContext) });
