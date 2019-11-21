import { expect } from 'chai';

describe('useFetch', (): void => {

  it('should be a function that throws an error when window is not available', (): void => {
    // Remove the window object on global.
    (global as any).window = undefined;
    delete require.cache[require.resolve('../fetch-suspense')];
    const useFetch = require('../fetch-suspense');
    expect(useFetch).to.be.a('function');
    expect(useFetch.length).to.equal(0);
    expect(useFetch.default).to.eq(useFetch);
    expect(() => useFetch()).to.throw('Cannot find `window`');
  });

  it('should be a function that throws an error when window.fetch is not available', (): void => {
    // Set window object on global but without fetch.
    (global as any).window = {};
    delete require.cache[require.resolve('../fetch-suspense')];
    const useFetch = require('../fetch-suspense');
    expect(useFetch).to.be.a('function');
    expect(useFetch.length).to.equal(0);
    expect(useFetch.default).to.eq(useFetch);
    expect(() => useFetch()).to.throw('Cannot find `window.fetch`');
  });

  it('should be a function with 3 parameters via CommonJS when window.fetch is available', (): void => {
    // Set window object on global with a mock fetch function.
    (global as any).window = { fetch: () => 'test-val' };
    delete require.cache[require.resolve('../fetch-suspense')];
    const useFetch = require('../fetch-suspense');
    expect(useFetch).to.be.a('function');
    expect(useFetch.length).to.equal(3);
    expect(useFetch.default).to.eq(useFetch);
  });

  it('should be a function with 3 parameters via ES6 when window.fetch is available', async (): Promise<void> => {
    // Set window object on global with a mock fetch function.
    (global as any).window = { fetch: () => 'test-val' };
    delete require.cache[require.resolve('../fetch-suspense')];
    const useFetch = await import('../fetch-suspense');
    expect(useFetch).to.be.a('function');
    expect((useFetch as any).length).to.equal(3);
    expect(useFetch.default).to.eq(useFetch);
  });
});
