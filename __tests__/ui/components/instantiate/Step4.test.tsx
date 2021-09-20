// import React from 'react';
// import { jest } from '@jest/globals';
// import { fireEvent, render } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import { getMockInstantiateState } from 'test-utils';
// import { Step4 } from 'ui/components/instantiate/Step4';

// describe('Instantiate Step 4', () => {
//   const mockSubmitHandler = jest.fn();

//   test('displays a button that calls the submit handler', () => {
//     const { getByText } = render(
//       <Step4
//         state={getMockInstantiateState()}
//         dispatch={jest.fn()}
//         currentStep={4}
//         submitHandler={mockSubmitHandler}
//       />
//     );
//     const submitBtn = getByText('Instantiate');
//     expect(submitBtn).toBeInTheDocument();
//     fireEvent.click(submitBtn);
//     expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
//   });
//   test('does not render when current step is not 3', () => {
//     const { container } = render(
//       <Step4
//         state={getMockInstantiateState()}
//         dispatch={jest.fn()}
//         currentStep={1}
//         submitHandler={mockSubmitHandler}
//       />
//     );
//     expect(container).toBeEmptyDOMElement();
//   });
// });
