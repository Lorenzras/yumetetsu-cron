
export const browserURL = 'http://127.0.0.1:9222';
export const optionsTest = () => ({
  headless: false,
  defaultViewport: null,
  // slowMo: 50,
});
export const browserTimeOut = 1000 * 60 * 60 * 6;

export const minimalArgs = [
  '--disable-canvas-aa',
  '--disable-2d-canvas-clip-aa',
  '--disable-dev-shm-usage', // ???
  '--no-zygote', // wtf does that mean ?
  '--enable-webgl',
  '--hide-scrollbars',
  '--mute-audio',
  '--no-first-run',
  '--disable-infobars',
  '--disable-breakpad',
  '--no-sandbox', // meh but better resource comsuption
  '--disable-setuid-sandbox', // same
];
