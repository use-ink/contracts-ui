// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Button } from '../common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = any;

export function Vector({ Component, ...props }: Props) {
  const [count, setCount] = useState(0);
  console.log(props, count);
  const _rowAdd = () => setCount(count => count + 1);
  const _rowRemove = () => setCount(count => count - 1);
  return (
    <>
      <div className="ui--Param-Vector-buttons">
        <Button onClick={_rowAdd} />
        <Button onClick={_rowRemove} />
      </div>
      <Component {...props}></Component>;
    </>
  );
}
