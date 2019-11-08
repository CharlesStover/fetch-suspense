import deepEqual = require('deep-equal');



type CreateUseFetch = (fetch: FetchFunction) => UseFetch;

interface Export extends UseFetch {
  createUseFetch: CreateUseFetch;
  default: UseFetch;
}

interface FetchCache {
  bodyUsed?: boolean;
  contentType?: null | string;
  fetch?: Promise<void>;
  error?: any;
  headers?: Headers;
  init: RequestInit | undefined;
  input: RequestInfo;
  ok?: boolean;
  redirected?: boolean;
  response?: any;
  status?: number;
  statusText?: string;
  url?: string;
}

type FetchFunction = WindowOrWorkerGlobalScope extends HasFetch ? WindowOrWorkerGlobalScope['fetch'] : GlobalFetch['fetch'];

type FetchResponse = Object | string;

interface FetchResponseMetadata {
  bodyUsed: boolean;
  contentType: null | string;
  headers: Headers;
  ok: boolean;
  redirected: boolean;
  response: FetchResponse;
  status: number;
  statusText: string;
  url: string;
}

interface GlobalFetch { }

interface HasFetch {
    fetch: Function;
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

interface WindowOrWorkerGlobalScope { }



const createUseFetch: CreateUseFetch = (
  fetch: FetchFunction,
): UseFetch => {

  // Create a set of caches for this hook.
  const caches: FetchCache[] = [];

  function useFetch(
    input: RequestInfo,
    init?: RequestInit | undefined,
    options?: number | OptionsWithoutMetadata,
  ): FetchResponse;
  function useFetch(
    input: RequestInfo,
    init: RequestInit | undefined,
    options: OptionsWithMetadata,
  ): FetchResponseMetadata;
  function useFetch(
    input: RequestInfo,
    init?: RequestInit | undefined,
    options: number | Options = 0,
  ): FetchResponse | FetchResponseMetadata {

    if (typeof options === 'number') {
      return useFetch(input, init, { lifespan: options });
    }

    const { metadata = false, lifespan = 0 } = options;

    // Check each cache by this useFetch hook.
    for (const cache of caches) {

      // If this cache matches the request,
      if (
        deepEqual(input, cache.input) &&
        deepEqual(init, cache.init)
      ) {

        // If an error occurred, throw it so that componentDidCatch can handle
        //   it.
        if (Object.prototype.hasOwnProperty.call(cache, 'error')) {
          throw cache.error;
        }
  
        // If a response was successful, return it.
        if (Object.prototype.hasOwnProperty.call(cache, 'response')) {
          if (metadata) {
            return {
              bodyUsed: cache.bodyUsed,
              contentType: cache.contentType,
              headers: cache.headers,
              ok: cache.ok,
              redirected: cache.redirected,
              response: cache.response,
              status: cache.status,
              statusText: cache.statusText,
              url: cache.url,
            };
          }
          return cache.response;
        }

        // If we are still waiting, throw the Promise so that Suspense can
        //   fallback.
        throw cache.fetch;
      }
    }

    // If no request in the cache matched this one, create a new cache entry.
    const cache: FetchCache = {

      // Make the fetch request.
      fetch: fetch(input, init)

        // Parse the response.
        .then((response: Response): Promise<FetchResponse> => {
          cache.contentType = response.headers.get('Content-Type');
          if (metadata) {
            cache.bodyUsed = response.bodyUsed;
            cache.headers = response.headers;
            cache.ok = response.ok;
            cache.redirected = response.redirected;
            cache.status = response.status;
            cache.statusText = response.statusText;
          }
          if (
            cache.contentType &&
            cache.contentType.indexOf('application/json') !== -1
          ) {
            return response.json();
          }
          return response.text();
        })

        // Cache the response.
        .then((response: FetchResponse): void => {
          cache.response = response;
        })

        // Handle an error.
        .catch((e: Error): void => {
          cache.error = e;
        })

        // Invalidate the cache.
        .then((): void => {
          if (lifespan > 0) {
            setTimeout(
              (): void => {
                const index: number = caches.indexOf(cache);
                if (index !== -1) {
                  caches.splice(index, 1);
                }
              },
              lifespan,
            );
          }
        }),
      init,
      input,
    };
    caches.push(cache);
    throw cache.fetch;
  }

  return useFetch;
};

const _export: Export = Object.assign(
  createUseFetch(window.fetch), {
  createUseFetch,
  default: createUseFetch(window.fetch)
});

export = _export;
