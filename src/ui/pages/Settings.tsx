// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router';
import { Input } from '../components/form';
import { Button, Buttons, Dropdown } from 'ui/components';
import { useApi, useTheme } from 'ui/contexts';
import { Page } from 'ui/templates';
import { useNonEmptyString } from 'ui/hooks/useNonEmptyString';
import { isValidWsUrl } from 'helpers';

const options = [
  {
    label: 'Light',
    value: 'light',
  },
  {
    label: 'Dark',
    value: 'dark',
  },
];

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { value: rpcUrl, onChange: setRpcUrl, ...nameValidation } = useNonEmptyString('wss://');
  const apiContext = useApi();
  const navigate = useNavigate();

  const isDisabled = () => {
    return !(nameValidation.isValid && isValidWsUrl(rpcUrl));
  };

  const onSave = () => {
    apiContext.setEndpoint(rpcUrl);

    apiContext.setNetworkOptions(
      apiContext.networkOptions.map(option => {
        if (option.label == 'Local Node') {
          option = { label: 'Local Node', value: rpcUrl };
        }
        return option;
      })
    );

    navigate(`/?rpc=${rpcUrl}`);
  };

  return (
    <Page header="Settings" help={<>Manage settings and preferences.</>}>
      <div className="pb-10 border-b border-gray-200 dark:border-gray-800 mt-4 dark:text-white text-gray-600">
        <h2 className="text-lg pb-1 mb-2">Appearance</h2>
        <div className="grid grid-cols-12 w-full">
          <div className="flex flex-col col-span-6 lg:col-span-7 2xl:col-span-8 text-sm">
            <span className="font-semibold">Theme mode</span>
            <span className="dark:text-gray-400 text-gray-500">Select a display theme</span>
          </div>
          <div className="col-span-6 lg:col-span-5 2xl:col-span-4">
            <Dropdown
              onChange={e => setTheme && setTheme(e as 'light' | 'dark')}
              options={options}
              value={theme}
            />
          </div>
        </div>
      </div>

      <div className="pb-10 border-b border-gray-200 dark:border-gray-800 mt-4 dark:text-white text-gray-600">
        <h2 className="text-lg pb-1 mb-2">Node</h2>
        <div className="grid grid-cols-12 w-full">
          <div className="flex flex-col col-span-6 lg:col-span-7 2xl:col-span-8 text-sm">
            <span className="font-semibold">Custom endpoint</span>
            <span className="dark:text-gray-400 text-gray-500">
              Use a custom endpoint for local nodes
            </span>
          </div>
          <div className="col-span-6 lg:col-span-5 2xl:col-span-4">
            <Buttons>
              <Input
                id="customEndpoint"
                value={rpcUrl}
                width="200px"
                onChange={setRpcUrl}
                {...nameValidation}
              />
              <Button
                onClick={onSave}
                isDisabled={isDisabled()}
                variant="primary"
                data-cy="next-btn"
              >
                Save
              </Button>
            </Buttons>
          </div>
        </div>
      </div>
    </Page>
  );
}
