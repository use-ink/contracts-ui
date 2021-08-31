import { Reducer } from 'react';
import { InstantiateHashAction, InstantiateState } from 'types';

export const HashReducer: Reducer<InstantiateState, InstantiateHashAction> = (state, action) => {
  switch (action.type) {
    case 'STEP_1_COMPLETE':
      return {
        ...state,
        codeHash: action.payload.codeHash,
        metadata: action.payload.metadata,
        contractName: action.payload.contractName,
        currentStep: 2,
      };
    case 'STEP_2_COMPLETE':
      return {
        ...state,
        fromAddress: action.payload.fromAddress,
        fromAccountName: action.payload.fromAccountName,
        contractName: action.payload.contractName,
        currentStep: 3,
      };
    case 'DEPLOYMENT_INFO': // previously called STEP_3_COMPLETE
      return {
        ...state,
        constructorName: action.payload.constructorName,
        argValues: action.payload.argValues,
        endowment: action.payload.endowment,
        salt: action.payload.salt,
        gas: action.payload.gas,
        currentStep: 4,
      };
    case 'GO_TO':
      return { ...state, currentStep: action.payload.step };
    case 'INSTANTIATE':
      return { ...state, isLoading: true };
    case 'INSTANTIATE_SUCCESS':
      return { ...state, isSuccess: true, contract: action.payload, isLoading: false };
    case 'INSTANTIATE_ERROR':
      return { ...state, isLoading: false };

    default:
      throw new Error();
  }
};
