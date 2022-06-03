// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Button, Buttons } from '../common';
import { TypeDef, ArgComponentProps } from 'types';

interface Props extends ArgComponentProps<unknown[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<ArgComponentProps<unknown>>;
};

type TitleProps = {
  count: number;
  nestingNumber: number;
  type: string;
};

const Title = ({ nestingNumber, count, type }: TitleProps) => {
  if (count == 0) return <>{type}</>;
  return (
    <div className={'flex justify-start'}>
      <div className={count == 1 ? 'dark:text-white text-gray-600' : ''}>{'Vec<'}</div>
      <Title nestingNumber={nestingNumber} count={count - 1} type={type} />
      <div className={count == 1 ? 'dark:text-white text-gray-600' : ''}>{'>'}</div>
    </div>
  );
};

export function Vector({ component: Component, value, onChange, nestingNumber, registry, typeDef, ...props }: Props) {
  const _rowAdd = () => onChange([...value, '']);
  const _rowRemove = () => onChange(value.slice(0, -1));
  const _onChange = (row: number) => (newEntry: unknown) => {
    const newValue = value.map((entry, index) => (index == row ? newEntry : entry));
    onChange(newValue);
  };

  return (
    <>
      <div className="flex justify-between align-middle">
        <div className="table mt-2 mb-4">
          <div className="table-cell align-middle font-mono font-bold dark:text-gray-300 text-gray-400">
            <Title
              nestingNumber={nestingNumber}
              type={(typeDef?.sub as TypeDef)?.type || ''}
              count={nestingNumber}
            />
          </div>
        </div>
        <Buttons className={'flex mt-2 mr-1 mb-4 justify-end'}>
          <Button className="w-4" onClick={_rowAdd}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 0.5C5.23869 0.5 5.46761 0.594821 5.6364 0.763604C5.80518 0.932387 5.9 1.16131 5.9 1.4V4.1H8.6C8.83869 4.1 9.06761 4.19482 9.2364 4.3636C9.40518 4.53239 9.5 4.76131 9.5 5C9.5 5.23869 9.40518 5.46761 9.2364 5.6364C9.06761 5.80518 8.83869 5.9 8.6 5.9H5.9V8.6C5.9 8.83869 5.80518 9.06761 5.6364 9.2364C5.46761 9.40518 5.23869 9.5 5 9.5C4.76131 9.5 4.53239 9.40518 4.3636 9.2364C4.19482 9.06761 4.1 8.83869 4.1 8.6V5.9H1.4C1.16131 5.9 0.932387 5.80518 0.763604 5.6364C0.594821 5.46761 0.5 5.23869 0.5 5C0.5 4.76131 0.594821 4.53239 0.763604 4.3636C0.932387 4.19482 1.16131 4.1 1.4 4.1H4.1V1.4C4.1 1.16131 4.19482 0.932387 4.3636 0.763604C4.53239 0.594821 4.76131 0.5 5 0.5Z"
                fill="#9597A6"
              />
            </svg>
          </Button>
          <Button className="w-4" onClick={_rowRemove}>
            <svg
              width="10"
              height="3"
              viewBox="0 0 10 3"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.5 1.20005C0.5 0.961354 0.594821 0.732436 0.763604 0.563653C0.932387 0.39487 1.16131 0.300049 1.4 0.300049H8.6C8.83869 0.300049 9.06761 0.39487 9.2364 0.563653C9.40518 0.732436 9.5 0.961354 9.5 1.20005C9.5 1.43874 9.40518 1.66766 9.2364 1.83644C9.06761 2.00523 8.83869 2.10005 8.6 2.10005H1.4C1.16131 2.10005 0.932387 2.00523 0.763604 1.83644C0.594821 1.66766 0.5 1.43874 0.5 1.20005Z"
                fill="#9597A6"
              />
            </svg>
          </Button>
        </Buttons>
      </div>
      {value &&
        value.map((entry, row) => (
          <div key={`div-${row}`} className={'mb-4 mr-1'}>
            <Component
              key={`component-${row}`}
              {...props}
              nestingNumber={nestingNumber}
              registry={registry}
              typeDef={typeDef}
              value={entry}
              onChange={_onChange(row)}
            />
          </div>
        ))}
    </>
  );
}
