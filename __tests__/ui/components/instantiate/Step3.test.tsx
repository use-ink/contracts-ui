// import React from 'react';
// import { jest } from '@jest/globals';
// import { render, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import { flipperMock } from 'test-utils/mockData';
// import { Step3 } from 'ui/components/instantiate/Step3';

// describe('Instantiate Step 3', () => {
//   const { constructors } = flipperMock;

//   test('renders correctly with initial values', () => {
//     const { getByPlaceholderText } = render(
//       <Step3 constructors={constructors} dispatch={jest.fn()} currentStep={3} />
//     );
//     expect(getByPlaceholderText('initValue: <bool>')).toBeInTheDocument();
//   });
//   test('does not render when no constructors given', () => {
//     const { container } = render(<Step3 dispatch={jest.fn()} currentStep={3} />);
//     expect(container).toBeEmptyDOMElement();
//   });
//   test('does not render when current step is not 3', () => {
//     const { container } = render(
//       <Step3 constructors={constructors} dispatch={jest.fn()} currentStep={1} />
//     );
//     expect(container).toBeEmptyDOMElement();
//   });
//   test('accepts user input', () => {
//     const { getByPlaceholderText } = render(
//       <Step3 constructors={constructors} dispatch={jest.fn()} currentStep={3} />
//     );
//     const input = getByPlaceholderText('initValue: <bool>');
//     expect(input).toHaveAttribute('value', '');
//     fireEvent.change(input, { target: { value: 'test user Input' } });
//     expect(input).toHaveAttribute('value', 'test user Input');
//   });
//   test('dispatches the correct values', () => {
//     const dispatchMock = jest.fn();
//     const { getByPlaceholderText, getByText } = render(
//       <Step3 constructors={constructors} dispatch={dispatchMock} currentStep={3} />
//     );
//     const input = getByPlaceholderText('initValue: <bool>');
//     const button = getByText('Next');
//     fireEvent.change(input, { target: { value: 'true' } });
//     fireEvent.click(button);
//     expect(dispatchMock).toHaveBeenCalledTimes(1);
//     expect(dispatchMock).toHaveBeenCalledWith({
//       type: 'STEP_3_COMPLETE',
//       payload: {
//         constructorName: 'new',
//         argValues: {
//           initValue: 'true',
//         },
//       },
//     });
//   });
// });
