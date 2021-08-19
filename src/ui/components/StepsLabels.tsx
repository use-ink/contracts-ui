import React from 'react';
import { CheckIcon } from '@heroicons/react/outline';

export type StepInfo = {
  label: string;
  step: number;
};

interface Props {
  currentStep: number;
  stepsInfo: StepInfo[];
}

export const StepsLabels = ({ currentStep, stepsInfo }: Props) => {
  return stepsInfo.length > 0 ? (
    <>
      {stepsInfo.map((stepInfo, index) => {
        return (
          <>
            <div className="flex space-x-4 items-center" key={index}>
              {stepInfo.step <= currentStep - 1 ? (
                <CheckIcon className="bg-indigo-500 text-white rounded-md w-8 h-8 p-1" />
              ) : (
                <p
                  className={`${
                    currentStep == stepInfo.step || currentStep > index
                      ? 'bg-indigo-500'
                      : 'bg-elevation-2'
                  } bg-indigo-500 text-white rounded-md w-8 h-8 p-1 text-center`}
                >
                  {stepInfo.step}
                </p>
              )}

              <span
                className={`${
                  currentStep == stepInfo.step || currentStep > index
                    ? 'text-gray-200'
                    : 'text-gray-500'
                } text-sm`}
              >
                {stepInfo.label}
              </span>
            </div>
            {stepsInfo.length !== index + 1 ? (
              <div className="flex justify-center w-8 py-4">
                <span
                  className={`h-8 ${
                    currentStep > stepInfo.step ? 'bg-indigo-500' : 'bg-elevation-2'
                  }`}
                  style={{ width: '2px' }}
                ></span>
              </div>
            ) : null}
          </>
        );
      })}
    </>
  ) : null;
};
