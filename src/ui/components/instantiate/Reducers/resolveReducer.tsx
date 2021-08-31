import { CodeReducer } from './CodeReducer';
import { HashReducer } from './HashReducer';

export const resolveReducer = (instatiationType: string) => {
  switch (instatiationType) {
    case 'code':
      return CodeReducer;
    case 'hash':
      return HashReducer;
    default:
      throw new Error('Unknown instantiation type');
  }
};
