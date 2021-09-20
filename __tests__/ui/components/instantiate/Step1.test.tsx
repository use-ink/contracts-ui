// import React from 'react';
// import { jest } from '@jest/globals';
// import { render } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import { Step1 } from 'ui/components/instantiate/HashSteps';

// describe('Instantiate Step 1', () => {
//   test('renders correctly with initial values', () => {
//     const { getByText, getByPlaceholderText } = render(
//       <Step1 dispatch={jest.fn()} currentStep={1} />
//     );
//     expect(getByPlaceholderText('on-chain code hash')).toBeInTheDocument();
//     expect(getByText('Upload metadata.json')).toBeInTheDocument();
//     expect(getByText('Next')).toBeDisabled();
//   });

//   test('does not render if current step is not 1', () => {
//     const { container } = render(<Step1 dispatch={jest.fn()} currentStep={2} />);

//     expect(container).toBeEmptyDOMElement();
//   });
// });
