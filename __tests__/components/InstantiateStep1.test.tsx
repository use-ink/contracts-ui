import React from 'react';
import { jest } from '@jest/globals';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InstantiateStep1 from '../../src/components/instantiate/InstantiateStep1';

const keyringPairsMock = [
  { address: '5H3pnZeretwBDzaJFxKMgr4fQMsVa2Bu73nB5Tin2aQGQ9H3', meta: { name: 'alice' } },
  {
    address: '5HKbr8t4Qg5y9kZBU9nwuDkoTsPShGQHYUbvyoB4ujvfKsbL',
    meta: { name: 'alice_stash' },
  },
  { address: '5DkocVtKdD6wM7qrSAVTpR4jfTAPHvQhbrDZ6ZUB39d1DWzf', meta: { name: 'bob' } },
  {
    address: '5DUpcTjvPXG63kt1z8iwacJv7W7m6YuxfKCd4NoJtXhaUt6h',
    meta: { name: 'bob_stash' },
  },
];

it('renders correctly with initial values', () => {
  const { getByText } = render(
    <InstantiateStep1
      keyringPairs={keyringPairsMock}
      codeHashes={['0xd0bc2fee1ad35d66436a1ee818859322b24ba8c9ad80a26ef369cdd2666d173d']}
      dispatch={jest.fn()}
      currentStep={1}
    />
  );
  expect(getByText('ALICE')).toBeInTheDocument();
  expect(getByText('Upload metadata.json')).toBeInTheDocument();
  expect(getByText('Next')).toBeDisabled();
});

it('does not render if current step is not 1', () => {
  const { container } = render(
    <InstantiateStep1
      keyringPairs={keyringPairsMock}
      codeHashes={['0xd0bc2fee1ad35d66436a1ee818859322b24ba8c9ad80a26ef369cdd2666d173d']}
      dispatch={jest.fn()}
      currentStep={2}
    />
  );

  expect(container).toBeEmptyDOMElement();
});
