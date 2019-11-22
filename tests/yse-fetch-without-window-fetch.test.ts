const windowFetchBak: typeof window.fetch = window.fetch;
delete window.fetch;

import { expect } from 'chai';
import useFetch from '../fetch-suspense';
import CommonJS = require('../fetch-suspense');

describe('useFetch without window.fetch', (): void => {
  it('should reject via CommonJS', async (): Promise<void> => {
    try {
      CommonJS('test'); // initial fetch
    } catch (p) {
      try {
        await p; // await Suspesne
        CommonJS('test'); // post-Suspense fetch
      } catch (e) {
        expect(e).to.be.an.instanceOf(Error);
        expect(e.message).to.equal('Cannot find `window.fetch`. Use `createUseFetch` to provide a custom `fetch` function.');
        return;
      }
      throw new Error('useFetch did not reject.');
    }
    throw new Error('useFetch did not throw.');
  });

  it('should reject via ES6', async (): Promise<void> => {
    try {
      useFetch('test'); // initial fetch
    } catch (p) {
      try {
        await p; // await Suspense
        useFetch('test'); // post-Suspense fetch
      } catch (e) {
        expect(e).to.be.an.instanceOf(Error);
        expect(e.message).to.equal('Cannot find `window.fetch`. Use `createUseFetch` to provide a custom `fetch` function.');
        return;
      }
      throw new Error('useFetch did not reject.');
    }
    throw new Error('useFetch did not throw.');
  });
});

window.fetch = windowFetchBak;
