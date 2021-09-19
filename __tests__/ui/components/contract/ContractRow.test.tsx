import React from 'react';
import { jest } from '@jest/globals';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router';
import type { VoidFn } from 'types';
import { ContractRow } from 'ui/components/contract/ContractRow';
import { getTestCodeBundles, getTestContracts } from 'test-utils';

describe('Homepage: ContractRow', () => {
  const codeBundles = getTestCodeBundles();
  const contract = getTestContracts(codeBundles)[0];

  let rendered: RenderResult;
  let favoriteButton: HTMLButtonElement;
  let onToggleStar: VoidFn;

  const date = new Date(contract.date).toLocaleDateString('en-EN', {
    month: 'long',
    day: 'numeric',
  });
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
      getByText(`${contract.address.slice(0, 4)}...${contract.address.slice(-4)}`)
    ).toBeInTheDocument();
    expect(favoriteButton).toBeInTheDocument();
    expect(getByText(date)).toBeInTheDocument();
  });

  test('toggles user favorite', () => {
    fireEvent.click(favoriteButton);

    expect(onToggleStar).toHaveBeenCalled();
  });
});
