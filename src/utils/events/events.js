class EventEmitter {
  constructor() {
    this.events = {};
  }

  addEventListener(event, listener) {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = [];
    }
    this.events[event].push(listener);

    return listener;
  }

  removeLister(event, listener) {
    if (typeof this.events[event] === 'object') {
      const i = this.events[event].indexOf(listener);
      if (i > -1) {
        this.events[event].splice(i, 1);
      }
      if (this.events[event].length === 0) {
        delete this.events[event];
      }
    }
  }

  emitter(event, ...args) {
    if (typeof this.events[event] === 'object') {
      this.events[event].forEach(listener => {
        try {
          listener.apply(this, args);
        } catch (err) {
          console.log(err);
        }
      });
    }
  }
}

export const event = new EventEmitter();
