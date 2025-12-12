const originalWarn = console.warn

console.warn = (...args: unknown[]) => {
  const message = args[0]
  if (
    typeof message === 'string' &&
    message.includes('Missing ref owner context')
  ) {
    return
  }
  originalWarn(...args)
}
