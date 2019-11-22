import { expect } from 'chai';
import useFetch from '../fetch-suspense';
import CommonJS = require('../fetch-suspense');

describe('useFetch', (): void => {
  it('should be a function with 3 parameters via CommonJS', (): void => {
    expect(CommonJS).to.be.a('function');
    expect(CommonJS.length).to.equal(3);
  });

  it('should be a function with 3 parameters via ES6', async (): Promise<void> => {
    expect(useFetch).to.be.a('function');
    expect(useFetch.length).to.equal(3);
  });
});
