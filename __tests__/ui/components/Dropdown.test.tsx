// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Dropdown } from 'ui/components/common/Dropdown';
import { DropdownOption, DropdownProps } from 'types';
import { getNodeText } from 'test-utils';

interface ReturnType {
  foo: string;
}

const options: DropdownOption<ReturnType>[] = [
  { name: 'bar', value: { foo: 'bar' } },
  { name: <span>baz</span>, value: { foo: 'baz' } },
];

function mockProps(overrides: Partial<DropdownProps<ReturnType>> = {}): DropdownProps<ReturnType> {
  return {
    options,
    onChange: jest.fn(),
    value: options[0].value,
    ...overrides,
  };
}

describe('Dropdown', () => {
  test('correctly renders the dropdown', () => {
    const { getByTestId } = render(
      <Dropdown {...mockProps({ className: 'foo' })}>No options found</Dropdown>
    );

    const dropdownBtn = getByTestId('dropdown-btn') as HTMLButtonElement;

    expect(dropdownBtn).toBeInTheDocument();
    expect(dropdownBtn.parentElement).toHaveClass('foo');

    fireEvent.click(dropdownBtn);

    options.forEach(({ name }, index) => {
      const li = getByTestId(`dropdown-option-${index}`);

      expect(li).toBeInTheDocument();
      expect(li).toHaveTextContent(getNodeText(name));
    });
  });

  test('correctly renders without options', () => {
    const { getByText } = render(
      <Dropdown onChange={jest.fn() as () => void}>No options found</Dropdown>
    );

    const dropdown = getByText('No options found');

    expect(dropdown).toBeInTheDocument();
  });

  test('correctly renders as disabled', () => {
    const { getByTestId } = render(
      <Dropdown {...mockProps({ isDisabled: true })}>No options found</Dropdown>
    );

    const dropdownBtn = getByTestId('dropdown-btn') as HTMLButtonElement;

    expect(dropdownBtn).toHaveAttribute('disabled');
  });

  test('receives onChange event', () => {
    const onChange = jest.fn();

    const { getByTestId } = render(
      <Dropdown {...mockProps({ onChange })}>No options found</Dropdown>
    );

    const dropdownBtn = getByTestId('dropdown-btn') as HTMLButtonElement;

    fireEvent.click(dropdownBtn);

    fireEvent.click(getByTestId('dropdown-option-1'));

    expect(onChange).toHaveBeenCalledWith(options[1].value);
  });
});
