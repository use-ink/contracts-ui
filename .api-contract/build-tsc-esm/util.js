export function applyOnEvent(result, types, fn) {
  if (result.isInBlock || result.isFinalized) {
    const records = result.filterRecords('contracts', types);
    if (records.length) {
      return fn(records);
    }
  }
  return undefined;
}
