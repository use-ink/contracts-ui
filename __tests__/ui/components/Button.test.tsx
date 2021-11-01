import React from 'react';
import { jest } from '@jest/globals';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Button } from 'ui/components/Button';

describe('Button', () => {
  let rendered: RenderResult;
  const onClick = jest.fn();

  beforeEach(() => {
    rendered = render(
      <Button
        className='foo'
        onClick={onClick}
        variant='primary'
      >
        Button Contents
      </Button>
    );
  });

  test.skip('correctly renders a button', () => {
    const button = rendered.getByText('Button Contents');

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'primary', 'foo');
  });

  test.skip('receives onClick event', () => {
    const button = rendered.getByText('Button Contents');

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });
});
