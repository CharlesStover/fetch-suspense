import { expect } from 'chai';
import { createUseFetch } from '../fetch-suspense';
import CommonJS = require('../fetch-suspense');



describe('createUseFetch', (): void => {

  it('should be a function with 1 parameter via CommonJS', (): void => {
    expect(CommonJS.createUseFetch).to.be.a('function');
    expect(CommonJS.createUseFetch.length).to.equal(1);
  });

  it('should be a function with 1 parameter via ES6', (): void => {
    expect(createUseFetch).to.be.a('function');
    expect(createUseFetch.length).to.equal(1);
  });
});
