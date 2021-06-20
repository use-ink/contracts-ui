import React from 'react';
import { jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InstantiateStep3 from '../../src/components/instantiate/InstantiateStep3';
import { InstantiateState, AppState } from '../../src/types';
import { CanvasContext } from '../../src/contexts';

const mockState: InstantiateState = {
  isLoading: false,
  isSuccess: false,
  contract: null,
  currentStep: 1,
  fromAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  codeHash: '0xd0bc2fee1ad35d66436a1ee818859322b24ba8c9ad80a26ef369cdd2666d173d',
  constructorName: 'new',
  argValues: { initValue: 'true' },
};
const mockAppState: AppState = {
  socket: '',
  keyring: null,
  keyringState: null,
  api: null,
  apiError: null,
  apiState: null,
};
const mockSubmitHandler = jest.fn();

const customRender = (ui: JSX.Element, providerProps: AppState) => {
  return render(<CanvasContext.Provider value={providerProps}>{ui}</CanvasContext.Provider>);
};

it('displays a button that calls the submit handler', () => {
  customRender(
    <InstantiateStep3
      state={mockState}
      dispatch={jest.fn()}
      currentStep={3}
      submitHandler={mockSubmitHandler}
    />,
    { ...mockAppState }
  );
  const submitBtn = screen.getByText('Instantiate');
  expect(submitBtn).toBeInTheDocument();
  fireEvent.click(submitBtn);
  expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
});
it('does not render when current step is not 3', () => {
  const { container } = render(
    <InstantiateStep3
      state={mockState}
      dispatch={jest.fn()}
      currentStep={1}
      submitHandler={mockSubmitHandler}
    />
  );
  expect(container).toBeEmptyDOMElement();
});
