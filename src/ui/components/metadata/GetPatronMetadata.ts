export function getPatronMetadata(field: string, hash: string) {
  const options = {
    method: 'GET',
    headers:
      field === 'metadata'
        ? {
            'Content-Type': 'application/json',
          }
        : {
            'Content-Type': 'text/plain; charset=UTF-8',
          },
    mode: 'cors' as RequestMode,
  };

  return fetch('https://api.patron.works/buildSessions/' + field + '/' + hash, options).then(
    response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return field === 'metadata' ? response.json() : response.arrayBuffer();
    },
  );
}
