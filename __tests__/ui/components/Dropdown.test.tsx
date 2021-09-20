import React from 'react';
import { jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Dropdown } from 'ui/components';
import { DropdownOption } from 'types';

const options: DropdownOption<string>[] = [
  { name: 'foo', value: 'fooValue' },
  { name: 'bar', value: 'barValue' }
];

describe('Dropdown', () => {
  const onChange = jest.fn();

  test('correctly renders the dropdown', () => {
    const rendered = render(
      <Dropdown
        className='foo'
        options={options}
        onChange={onChange}
        value={options[0].value}
       >
        No options found
      </Dropdown>
    )
    
    const dropdown = rendered.getByText(options[0].name).parentElement as HTMLButtonElement;

    expect(dropdown).toBeInTheDocument();
    expect(dropdown.parentElement).toHaveClass('foo');

    fireEvent.click(dropdown);

    expect(rendered.getByText(options[1].name)).toBeInTheDocument();
  });

  test('correctly renders without options', () => {
    const rendered = render(
      <Dropdown
        className='foo'
        onChange={onChange}
        options={[]}
       >
         No options found
      </Dropdown>
    )
    
    const dropdown = rendered.getByText('No options found');

    expect(dropdown).toBeInTheDocument();
  });


  test('receives onChange event', () => {
    const rendered = render(
      <Dropdown
        className='foo'
        options={options}
        onChange={onChange}
        value={options[0].value}
       >
         No options found
        </Dropdown>
    )

    const dropdown = rendered.getByText(options[0].name);

    fireEvent.click(dropdown);

    fireEvent.click(rendered.getByText(options[1].name));

    expect(onChange).toHaveBeenCalledWith(options[1]);
  });
});
