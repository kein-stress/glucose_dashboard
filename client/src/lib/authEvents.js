const listeners = new Set();

export function onUnauthorized(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function emitUnauthorized() {
  for (const callback of listeners) callback();
}
