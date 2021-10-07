// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
            method: action.payload.method,
            returnType: action.payload.returnType,
            time: action.payload.time,
            isMutating: action.payload.isMutating,
            isPayable: action.payload.isPayable,
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
