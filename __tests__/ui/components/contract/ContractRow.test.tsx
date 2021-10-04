import moment from 'moment';
import React from 'react';
import { jest } from '@jest/globals';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router';
import type { VoidFn } from 'types';
import { ContractRow } from 'ui/components/contract/ContractRow';
import { getMockCodeBundles, getMockContracts } from 'test-utils';
import { truncate } from 'ui/util';

describe('Homepage: ContractRow', () => {
  const codeBundles = getMockCodeBundles();
  const contract = getMockContracts(codeBundles)[0];

  let rendered: RenderResult;
  let favoriteButton: HTMLButtonElement;
  let onToggleStar: VoidFn;

  beforeEach(() => {
    onToggleStar = jest.fn();

    rendered = render(
      <MemoryRouter>
        <ContractRow contract={contract} isStarred={false} onToggleStar={onToggleStar} />
      </MemoryRouter>
    );
    favoriteButton = rendered.getByLabelText('Add to favorites') as HTMLButtonElement;
  });

  test('correctly renders contract documents', () => {
    const { getByText } = rendered;

    expect(getByText(contract.name)).toBeInTheDocument();
    expect(
      getByText(truncate(contract.address, 4))
    ).toBeInTheDocument();
    expect(favoriteButton).toBeInTheDocument();
    expect(getByText(moment(contract.date).format('MMM d'))).toBeInTheDocument();
  });

  test('toggles user favorite', () => {
    fireEvent.click(favoriteButton);

    expect(onToggleStar).toHaveBeenCalled();
  });
});
