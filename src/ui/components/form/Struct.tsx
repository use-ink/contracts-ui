// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { encodeTypeDef } from '@polkadot/types';
import { TypeDef, ArgComponentProps } from 'types';

type Props = ArgComponentProps<Record<string, unknown>> & {
  components: React.ComponentType<ArgComponentProps<unknown>>[];
};

export function Struct ({ components, value, nestingNumber, onChange, registry, typeDef }: Props) {
  const _onChange = (name: string) => (newEntry: unknown) => {
    const newValue = { ...value, [name]: newEntry };
    onChange(newValue);
  };

  console.log('ass');
  console.log(typeDef);

  return (
    <>
      {typeDef?.sub && components &&
        components.map((Component, index) => {
          const subType = (typeDef.sub as TypeDef[])[index];
          const name = subType.name as string;

          return (
            <>
              <label
                className="block mb-1.5 text-sm font-semibold dark:text-white text-gray-600"
                key={`${typeDef.name}-label-${index}`}
                htmlFor={name}
              >
                {name}: {encodeTypeDef(registry, subType)}
              </label>
              <div key={`${typeDef.name}-component-${index}`} className={'mb-4 mr-1'}>
                <Component value={value ? value[name] : ''} nestingNumber={nestingNumber + 1} onChange={_onChange(name)} registry={registry} typeDef={subType} />
              </div>
            </>
          )
        })}
    </>
  );
}
