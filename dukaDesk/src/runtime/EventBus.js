const listeners = {};

export const EventBus = {
  on(event, handler) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(handler);
    return () => {
      listeners[event] = listeners[event].filter(h => h !== handler);
    };
  },

  emit(event, data) {
    (listeners[event] || []).forEach(h => h(data));
  },

  clearAll() {
    Object.keys(listeners).forEach(k => delete listeners[k]);
  },
};
