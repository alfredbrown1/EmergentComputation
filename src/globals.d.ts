declare global {
  // fxhash globals
  const fxrand: () => number;
  const fxpreview: () => void;
  const $fx: {
    hash: string;
    rand: () => number;
    preview: () => void;
    isPreview: boolean;
    params: Record<string, any>;
    minter: string;
  };
}

// This export statement is needed to make the file a module
export {};
