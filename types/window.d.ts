declare interface Window {
  requestIdleCallback: (
    callback: () => void,
    options?: { timeout: number }
  ) => number;
  cancelIdleCallback: (handle: number) => void;
}
