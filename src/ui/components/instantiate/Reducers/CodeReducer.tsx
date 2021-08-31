import { Reducer } from 'react';
import { InstantiateCodeAction, InstantiateState } from 'types';

export const CodeReducer: Reducer<InstantiateState, InstantiateCodeAction> = (state, action) => {
  switch (action.type) {
    case 'UPLOAD_CONTRACT': // previously called STEP_1_COMPLETE
      return {
        ...state,
        fromAccountName: action.payload.fromAccountName,
        fromAddress: action.payload.fromAddress,
        metadata: action.payload.metadata,
        contractName: action.payload.contractName,
        file: action.payload.file,
        currentStep: 2,
      };

    case 'DEPLOYMENT_INFO': // previously called STEP_2_COMPLETE
      return {
        ...state,
        constructorName: action.payload.constructorName,
        argValues: action.payload.argValues,
        endowment: action.payload.endowment,
        salt: action.payload.salt,
        gas: action.payload.gas,
        currentStep: 3,
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
