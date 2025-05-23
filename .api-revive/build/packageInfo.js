export const packageInfo = {
  name: '@polkadot/api-revive',
  path:
    import.meta && import.meta.url
      ? new URL(import.meta.url).pathname.substring(
          0,
          new URL(import.meta.url).pathname.lastIndexOf('/') + 1,
        )
      : 'auto',
  type: 'esm',
  version: '15.8.1',
};
