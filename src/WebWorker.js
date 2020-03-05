export default class WebWorker {
  constructor() {
    this.reset();
  }

  reset() {
    const code = this.thread.toString();
    const blob = new Blob([`(${code})()`]);

    this.worker = new Worker(URL.createObjectURL(blob));
    this.runState = 'stopped';
  }

  addCallback(callback) {
    return this.worker.addEventListener('message', callback);
  }

  removeCallback(callback) {
    return this.worker.removeEventListener('message', callback);
  }

  start(initial) {
    this.worker.postMessage({ command: 'start', initial });
    this.runState = 'started';
  }

  pause() {
    this.worker.postMessage({ command: 'pause' });
    this.runState = 'paused';
  }

  stop() {
    this.worker.postMessage({ command: 'stop' });
    this.runState = 'stopped';
  }

  isRunning() {
    return this.runState === 'started';
  }

  isPaused() {
    return this.runState === 'paused';
  }

  isStopped() {
    return this.runState === 'stopped';
  }

  /**
   * This is the code that runs on the Web Worker thread: it
   * will be bundled in its own file, and it has its own scope,
   * that is different from `window`, so we use `self` here in
   * order to access its scope.
   */
  /* eslint-disable no-restricted-globals */
  thread = () => {
    const doWork = () => {
      self.state += 1;
    };

    const doCallback = () =>
      self.requestAnimationFrame(() => postMessage(self.state));

    self.addEventListener(
      'message',
      ({ data: { command, initial } }) => {
        switch (command) {
          case 'start':
            if (initial !== undefined) {
              self.state = initial;
            }

            self.workInterval = setInterval(doWork);
            self.updateInterval = setInterval(doCallback);
            break;
          case 'pause':
          case 'stop':
            if (command === 'stop') {
              self.state = 0;
            }

            clearInterval(self.workInterval);
            clearInterval(self.updateInterval);

            postMessage(self.state);
            break;
          default:
            break;
        }
      },
    );
  };
}
