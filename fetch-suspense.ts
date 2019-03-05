const deepEqual = require('deep-equal');

interface FetchCache {
  client: (input: RequestInfo, init?: RequestInit | undefined) => Promise<any>;
  fetch?: Promise<void>;
  error?: any;
  init: RequestInit | undefined;
  input: RequestInfo;
  response?: any;
}

const fetchCaches: FetchCache[] = [];

interface UseFetchConfig {
  client?: (input: RequestInfo, init?: RequestInit | undefined) => Promise<any>;
  lifespan?: number;
}

const useFetch = (input: RequestInfo, init?: RequestInit | undefined, config?: UseFetchConfig | number) => {
  let client = fetch/* implicit global */;
  let lifespan: number = 0;
  if (typeof config === "object") {
    client = config.client || client;
    lifespan = config.lifespan || lifespan;
  } else if (typeof config === "number") {
    lifespan = config;
  }

  for (const fetchCache of fetchCaches) {

    // The request hasn't changed since the last call.
    if (
      client === fetchCache.client &&
      deepEqual(input, fetchCache.input) &&
      deepEqual(init, fetchCache.init)
    ) {

      // If an error occurred,
      if (Object.prototype.hasOwnProperty.call(fetchCache, 'error')) {
        throw fetchCache.error;
      }

      // If a response was successful,
      if (Object.prototype.hasOwnProperty.call(fetchCache, 'response')) {
        return fetchCache.response;
      }
      throw fetchCache.fetch;
    }
  }

  // The request is new or has changed.
  const fetchCache: FetchCache = {
    client,
    fetch:

      // Make the fetch request.
      client(input, init)

        // Parse the response.
        .then(response => {
          const contentType = response.headers.get('Content-Type');
          if (
            contentType &&
            contentType.indexOf('application/json') !== -1
          ) {
            return response.json();
          }
          return response.text();
        })

        // Cache the response.
        .then(response => {
          fetchCache.response = response;
        })
        .catch(e => {
          fetchCache.error = e;
        })

        // Invalidate the cache.
        .then(() => {
          if (lifespan > 0) {
            setTimeout(
              () => {
                const index = fetchCaches.indexOf(fetchCache);
                if(index !== -1) {
                  fetchCaches.splice(index, 1);
                }
              },
              lifespan
            );
          }
        }),
    init,
    input
  };
  fetchCaches.push(fetchCache);
  throw fetchCache.fetch;
};

module.exports = useFetch;
