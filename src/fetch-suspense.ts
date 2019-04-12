import deepEqual = require('deep-equal');



type CreateUseFetch = (fetch: GlobalFetch['fetch']) => UseFetch;

interface Export extends UseFetch {
  createUseFetch: CreateUseFetch;
  default: UseFetch;
}

interface FetchCache {
  fetch?: Promise<void>;
  error?: any;
  init: RequestInit | undefined;
  input: RequestInfo;
  response?: any;
}

type UseFetch = (
  input: RequestInfo,
  init?: RequestInit | undefined,
  lifespan?: number,
) => Object | string;



const createUseFetch: CreateUseFetch = (
  fetch: GlobalFetch['fetch'],
): UseFetch => {

  // Create a set of caches for this hook.
  const caches: FetchCache[] = [];

  return (
    input: RequestInfo,
    init?: RequestInit | undefined,
    lifespan: number = 0,
  ): Object | string => {

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
        .then((response: Response): Promise<Object | string> => {
          const contentType: null | string =
            response.headers.get('Content-Type');
          if (
            contentType &&
            contentType.indexOf('application/json') !== -1
          ) {
            return response.json();
          }
          return response.text();
        })

        // Cache the response.
        .then((response: Object | string): void => {
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
  };
};

const _export: Export = Object.assign(
  createUseFetch(window.fetch), {
  createUseFetch,
  default: createUseFetch(window.fetch)
});

export = _export;
