import React from 'react';
import { jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Dropdown } from 'ui/components/Dropdown';
import { DropdownOption } from 'types';

const options: DropdownOption<string>[] = [
  { name: 'foo', value: 'fooValue' },
  { name: <span>bar</span>, value: 'barValue' }
];

describe('Dropdown', () => {
  const onChange = jest.fn();

  test.skip('correctly renders the dropdown', () => {
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
    
    const dropdown = rendered.getByTestId('dropdown-btn') as HTMLButtonElement;

    expect(dropdown).toBeInTheDocument();
    expect(dropdown.parentElement).toHaveClass('foo');
  });

  test.skip('correctly renders without options', () => {
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


  test.skip('receives onChange event', () => {
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

    const dropdown = rendered.getByTestId('dropdown-btn');

    fireEvent.click(dropdown);

    fireEvent.click(rendered.getByTestId('dropdown-option-1'));

    expect(onChange).toHaveBeenCalledWith(options[1].value);
  });
});
