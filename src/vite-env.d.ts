/// <reference types="vite/client" />

interface Document {
  startViewTransition(update: () => void | Promise<void>): {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
  };
}
