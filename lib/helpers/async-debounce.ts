export const asyncDebounce = <T extends unknown[]>(
  fn: (...args: T) => Promise<unknown>,
  ms: number,
): (...args: T) => void => {
  let complete = true;
  let lastArgs: T | null = null;
  let lastTime = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  const rechargeTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    const waitTime = ms - (Date.now() - lastTime);
    if (waitTime <= 0) {
      callLastFn();
      return;
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      callLastFn();
    }, waitTime);
  };

  const onComplete = () => {
    complete = true;
    if (lastArgs) {
      rechargeTimeout();
    }
  };

  const callLastFn = () => {
    complete = false;
    const promise: Promise<unknown> = fn.apply(this, lastArgs!);
    lastArgs = null;
    promise.then(onComplete, onComplete);
  };

  return (...args: T) => {
    lastArgs = args;
    lastTime = Date.now();
    if (complete) {
      rechargeTimeout();
    }
  };
}
