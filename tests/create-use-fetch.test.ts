import { expect } from 'chai';
import { Headers as NodeFetchHeaders } from 'node-fetch';
import { createUseFetch } from '../fetch-suspense';
import CommonJS = require('../fetch-suspense');

type FetchResponse = Object | string;

interface FetchResponseMetadata {
  contentType: null | string;
  headers: Headers;
  ok: boolean;
  redirected: boolean;
  response: FetchResponse;
  status: number;
  statusText: string;
}

interface Options {
  lifespan?: number;
  metadata?: boolean;
}

interface OptionsWithMetadata extends Options {
  metadata: true;
}

interface OptionsWithoutMetadata extends Options {
  metadata?: false;
}

interface UseFetch {
  (
    input: RequestInfo,
    init?: RequestInit | undefined,
    options?: number | OptionsWithoutMetadata,
  ): FetchResponse;
  (
    input: RequestInfo,
    init: RequestInit | undefined,
    options: OptionsWithMetadata,
  ): FetchResponseMetadata;
}

const MOCK_BODY: string = 'mock body';

const MOCK_STATUS: number = 420;

const MOCK_STATUS_TEXT: string = 'mock status text';

const TEST_CONTENT_TYPE: string = 'text/plain';

const TEST_PATH: string = '/test-path';

const MOCK_HEADERS_INIT: HeadersInit = {
  'Content-Type': TEST_CONTENT_TYPE,
};

const MOCK_HEADERS: Headers =
  new NodeFetchHeaders(MOCK_HEADERS_INIT) as any as Headers;

const MOCK_RESPONSE: Response = {
  arrayBuffer: (): Promise<ArrayBuffer> =>
    Promise.resolve(null as any as ArrayBuffer),
  blob: (): Promise<Blob> => Promise.resolve(null as any as Blob),
  body: null,
  bodyUsed: true,
  clone: (): Response => MOCK_RESPONSE,
  formData: (): Promise<FormData> => Promise.resolve(null as any as FormData),
  headers: MOCK_HEADERS,
  json: (): Promise<null> => Promise.resolve(null),
  ok: true,
  redirected: false,
  status: MOCK_STATUS,
  statusText: MOCK_STATUS_TEXT,
  text: (): Promise<string> => Promise.resolve(MOCK_BODY),
  trailer: Promise.resolve(MOCK_HEADERS),
  type: null as any as ResponseType,
  url: '',
};

const MOCK_FETCH = (): Promise<Response> => Promise.resolve(MOCK_RESPONSE);

describe('createUseFetch', (): void => {

  it('should be a function with 1 parameter via CommonJS', (): void => {
    expect(CommonJS.createUseFetch).to.be.a('function');
    expect(CommonJS.createUseFetch.length).to.equal(1);
  });

  it('should be a function with 1 parameter via ES6', (): void => {
    expect(createUseFetch).to.be.a('function');
    expect(createUseFetch.length).to.equal(1);
  });

  describe('return value', (): void => {
    it('should be a function with 3 parameters via CommonJS', (): void => {
      const useFetch = CommonJS.createUseFetch(MOCK_FETCH);
      expect(useFetch).to.be.a('function');
      expect(useFetch.length).to.equal(3);
    });

    it('should be a function with 3 parameters via ES6', (): void => {
      const useFetch = createUseFetch(MOCK_FETCH);
      expect(useFetch).to.be.a('function');
      expect(useFetch.length).to.equal(3);
    });

    describe('useFetch', (): void => {

      let useFetch: UseFetch;
      beforeEach((): void => {
        useFetch = createUseFetch(MOCK_FETCH)
      });

      it('should throw a Promise', (): void => {
        try {
          useFetch(TEST_PATH);
        } catch (p) {
          expect(p).to.be.instanceOf(Promise);
          return;
        }
        throw new Error('useFetch did not throw.');
      });

      it('should not throw twice', async (): Promise<void> => {
        try {
          useFetch(TEST_PATH);
        } catch (p) {
          await p;
          try {
            useFetch(TEST_PATH);
            return;
          } catch (q) {
            throw new Error('useFetch threw twice.');
          }
        }
        throw new Error('useFetch did not throw.');
      });

      it('should return a Response', async (): Promise<void> => {
        try {
          useFetch(TEST_PATH);
        } catch (p) {
          await p;
          const response = useFetch(TEST_PATH);
          expect(response).to.equal(MOCK_BODY);
          return;
        }
        throw new Error('useFetch did not throw.');
      });

      it('should return a Response with metadata', async (): Promise<void> => {
        try {
          useFetch(TEST_PATH, undefined, { metadata: true });
        } catch (p) {
          await p;
          const { contentType, headers, response, status, statusText } =
            useFetch(TEST_PATH, undefined, { metadata: true });
          expect(contentType).to.equal(TEST_CONTENT_TYPE);
          expect(headers).to.equal(MOCK_HEADERS);
          expect(response).to.equal(MOCK_BODY);
          expect(status).to.equal(MOCK_STATUS);
          expect(statusText).to.equal(MOCK_STATUS_TEXT);
          return;
        }
        throw new Error('useFetch did not throw.');
      });
    });
  });
});
