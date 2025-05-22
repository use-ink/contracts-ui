import { InkVersion, useVersion } from 'ui/contexts';
import { Dropdown } from 'ui/components';

export function VersionSelect() {
  const { version, setVersion } = useVersion();
  const dropdownOptions = [
    {
      label: 'ink! v6 (default)',
      value: 'v6',
    },
    {
      label: 'ink! v5',
      value: 'v5',
    },
  ];
  return (
    <div className="network-and-user">
      <Dropdown
        className="chain"
        onChange={e => setVersion(e as InkVersion)}
        options={dropdownOptions}
        value={version}
      />
    </div>
  );
}
