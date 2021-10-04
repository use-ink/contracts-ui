import { Reducer } from 'react';
import { ContractCallState, ContractCallAction } from 'types';

export const contractCallReducer: Reducer<ContractCallState, ContractCallAction> = (
  state,
  action
) => {
  switch (action.type) {
    case 'CALL_INIT':
      return {
        ...state,
        isLoading: true,
        results: [
          ...state.results,
          {
            ...action.payload,
            isComplete: false,
          },
        ],
      };

    case 'CALL_FINALISED':
      return {
        ...state,
        isSuccess: true,
        results: state.results.map(result =>
          action.payload.id === result.id
            ? {
                ...result,
                ...action.payload,
                isComplete: true,
              }
            : result
        ),
        isLoading: false,
      };

    default:
      throw new Error();
  }
};
