const listeners = {};

export function on(event, fn) {
  (listeners[event] ??= []).push(fn);
  return () => off(event, fn);
}

export function off(event, fn) {
  const list = listeners[event];
  if (list) listeners[event] = list.filter(f => f !== fn);
}

export function emit(event, data) {
  (listeners[event] ?? []).forEach(fn => fn(data));
}
