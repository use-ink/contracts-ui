import React from 'react';
import { jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InstantiateStep2 from '../../src/components/instantiate/InstantiateStep2';
import { flipperMock } from '../../test-utils/mockData';

const { constructors } = flipperMock;

it('renders correctly with initial values', () => {
  const { getByText, getByPlaceholderText } = render(
    <InstantiateStep2 constructors={constructors} dispatch={jest.fn()} currentStep={2} />
  );
  expect(getByText('new')).toBeInTheDocument();
  expect(getByPlaceholderText('initValue: <bool>')).toBeInTheDocument();
});
it('does not render when no constructors given', () => {
  const { container } = render(<InstantiateStep2 dispatch={jest.fn()} currentStep={2} />);
  expect(container).toBeEmptyDOMElement();
});
it('does not render when current step is not 2', () => {
  const { container } = render(
    <InstantiateStep2 constructors={constructors} dispatch={jest.fn()} currentStep={1} />
  );
  expect(container).toBeEmptyDOMElement();
});
it('accepts user input', () => {
  const { getByPlaceholderText } = render(
    <InstantiateStep2 constructors={constructors} dispatch={jest.fn()} currentStep={2} />
  );
  const input = getByPlaceholderText('initValue: <bool>');
  expect(input).toHaveAttribute('value', '');
  fireEvent.change(input, { target: { value: 'test user Input' } });
  expect(input).toHaveAttribute('value', 'test user Input');
});
it('dispatches the correct values', () => {
  const dispatchMock = jest.fn();
  const { getByPlaceholderText, getByText } = render(
    <InstantiateStep2 constructors={constructors} dispatch={dispatchMock} currentStep={2} />
  );
  const input = getByPlaceholderText('initValue: <bool>');
  const button = getByText('Next');
  fireEvent.change(input, { target: { value: 'true' } });
  fireEvent.click(button);
  expect(dispatchMock).toHaveBeenCalledTimes(1);
  expect(dispatchMock).toHaveBeenCalledWith({
    type: 'STEP_2_COMPLETE',
    payload: {
      constructorName: 'new',
      argValues: {
        initValue: 'true',
      },
    },
  });
});
