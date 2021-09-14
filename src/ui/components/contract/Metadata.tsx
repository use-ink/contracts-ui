import React from 'react';
import { Abi } from 'types';
interface Props {
  isActive: boolean;
  abi: Abi;
}
export const MetadataTab = ({ isActive, abi: { constructors, messages } }: Props) => {
  if (!isActive) return null;
  console.log(constructors, messages);

  return <div>to do</div>;
};
