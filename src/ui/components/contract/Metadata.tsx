// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MessageDocs } from '../message/MessageDocs';
import { Abi } from 'types';

interface Props {
  abi?: Abi;
}
export const MetadataTab = ({ abi }: Props) => {
  if (!abi) return null;

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="col-span-6 lg:col-span-7 2xl:col-span-8 rounded-lg w-full">
        {abi.constructors.concat(abi.messages).map(message => (
          <MessageDocs key={message.identifier} message={message} registry={abi.registry} />
        ))}
      </div>
    </div>
  );
};
