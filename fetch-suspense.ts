const deepEqual = require('deep-equal');

interface FetchCache {
  fetch?: Promise<void>;
  error?: any;
  init: RequestInit | undefined;
  input: RequestInfo;
  response?: any;
}

const createUseFetch = (fetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<any>) => {
  const fetchCaches: FetchCache[] = [];

  const jsonContentTypes: string[] = [ 'application/json', 'application/vnd.api+json' ];

  return (input: RequestInfo, init?: RequestInit | undefined, lifespan: number = 0) => {
    for (const fetchCache of fetchCaches) {
  
      // The request hasn't changed since the last call.
      if (
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
      fetch:
  
        // Make the fetch request.
        fetch(input, init)
  
          // Parse the response.
          .then(response => {
            const contentType = response.headers.get('Content-Type');
            if (
              contentType &&
              jsonContentTypes.indexOf(contentType) !== -1
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
}

const useFetch: any = createUseFetch(
  fetch /* implicit global */
);

useFetch.createUseFetch = createUseFetch;
useFetch.default = useFetch;

module.exports = useFetch;
