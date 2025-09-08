// Extend the Window interface to include our custom property
declare global {
  interface Window {
    __MICRODEMO_STUDIO__?: string;
  }
}

export {}; // This file doesn't need to export anything
