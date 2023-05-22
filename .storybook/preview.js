import '../src/scss/main.scss';
import { initializeLibrary } from '../src/utils';

// TODO: This is async, how to wait for it?
initializeLibrary();

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'fullscreen',
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
