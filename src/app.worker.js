/* eslint-disable no-restricted-globals */
export default () => {
  self.addEventListener('message', e => {
    console.dir(self);
    if (!e) return;

    console.log('[WEB WORKER] Message received:', e.data);
    let i = 0;

    setInterval(() => i++);

    setInterval(
      () => self.requestAnimationFrame(() => postMessage(i)),
      50,
    );
  });
};
