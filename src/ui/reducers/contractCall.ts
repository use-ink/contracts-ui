import { Reducer } from 'react';
import { ContractCallState, ContractCallAction } from 'types';

export const contractCallReducer: Reducer<ContractCallState, ContractCallAction> = (
  state,
  action
) => {
  switch (action.type) {
    case 'CALL_INIT':
      return { ...state, isLoading: true };
    case 'CALL_FINALISED':
      return {
        ...state,
        isSuccess: true,
        results: [
          ...state.results,
          {
            data: action.payload.data,
            message: action.payload.message,
            time: action.payload.time,
            blockHash: action.payload.blockHash,
            info: action.payload.info,
            error: action.payload.error,
            log: action.payload.log,
          },
        ],
        isLoading: false,
      };

    default:
      throw new Error();
  }
};
