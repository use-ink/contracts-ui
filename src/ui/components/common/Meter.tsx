// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

interface Props {
  percentage: number;
  label: React.ReactNode;
  accessory?: React.ReactNode;
  withAccessory?: boolean;
}

export function Meter({ accessory, label, withAccessory }: Props) {
  return (
    <div className="relative pt-2">
      <div className="text-gray-500 text-xs pb-2">
        {label}
        {withAccessory && <div className="float-right">{accessory}</div>}
      </div>
    </div>
  );
}
