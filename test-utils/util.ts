export function timeout(ms = 10) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
