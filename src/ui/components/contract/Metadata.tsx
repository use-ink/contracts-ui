import React from 'react';

interface Props {
  isActive: boolean;
}
export const MetadataTab = ({ isActive }: Props) => {
  if (!isActive) return null;
  return <div>to do</div>;
};
