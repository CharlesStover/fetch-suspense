# useFetch [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=You%20can%20now%20use%20React%20Suspense%20with%20the%20Fetch%20API!&url=https://github.com/CharlesStover/fetch-suspense&via=CharlesStover&hashtags=react,reactjs,javascript,typescript,webdev,webdevelopment) [![version](https://img.shields.io/npm/v/fetch-suspense.svg)](https://www.npmjs.com/package/fetch-suspense) [![minified size](https://img.shields.io/bundlephobia/min/fetch-suspense.svg)](https://www.npmjs.com/package/fetch-suspense) [![minzipped size](https://img.shields.io/bundlephobia/minzip/fetch-suspense.svg)](https://www.npmjs.com/package/fetch-suspense) [![downloads](https://img.shields.io/npm/dt/fetch-suspense.svg)](https://www.npmjs.com/package/fetch-suspense) [![build](https://api.travis-ci.com/CharlesStover/fetch-suspense.svg)](https://travis-ci.com/CharlesStover/fetch-suspense/)

`useFetch` is a React hook that supports the React 16.6 Suspense component
implementation.

The design decisions and development process for this package are outlined in
the Medium article
[React Suspense with the Fetch API](https://medium.com/@Charles_Stover/react-suspense-with-the-fetch-api-a1b7369b0469).

## Install

* `npm install fetch-suspense` or
* `yarn add fetch-suspense`

## Examples

### Basic Example

```javascript
import useFetch from 'fetch-suspense';
import React, { Suspense } from 'react';

// This fetching component will be delayed by Suspense until the fetch request
//   resolves. The return value of useFetch will be the response of the server.
const MyFetchingComponent = () => {
  const response = useFetch('/path/to/api', { method: 'POST' });
  return 'The server responded with: ' + response;
};

// The App component wraps the asynchronous fetching component in Suspense.
// The fallback component (loading text) is displayed until the fetch request
//   resolves.
const App = () => {
  return (
    <Suspense fallback="Loading...">
      <MyFetchingComponent />
    </Suspense>
  );
};
```

### Using a Custom Fetch API

If you don't want to rely on the global `fetch` API, you can create your own
`useFetch` hook by importing the `createUseFetch` helper function.

```javascript
import { createUseFetch } from 'fetch-suspense';
import myFetchApi from 'my-fetch-package';
import React, { Suspense } from 'react';

// Create a useFetch hook using one's own Fetch API.
// NOTE: useFetch hereafter refers to this constant, not the default export of
//   the fetch-suspense package.
const useFetch = createUseFetch(myFetchApi);

// This fetching component will be delayed by Suspense until the fetch request
//   resolves. The return value of useFetch will be the response of the server.
const MyFetchingComponent = () => {
  const response = useFetch('/path/to/api', { method: 'POST' });
  return 'The server responded with: ' + response;
};

// The App component wraps the asynchronous fetching component in Suspense.
// The fallback component (loading text) is displayed until the fetch request
//   resolves.
const App = () => {
  return (
    <Suspense fallback="Loading...">
      <MyFetchingComponent />
    </Suspense>
  );
};
```

### Including Fetch Metadata

To include fetch metadata with your response, include an `options` parameter
with `metadata: true`.

```javascript
import useFetch from 'fetch-suspense';
import React, { Suspense } from 'react';

// This fetching component will be delayed by Suspense until the fetch request
//   resolves. The return value of useFetch will be the response of the server
//   AS WELL AS metadata for the request.
const MyFetchingComponent = () => {
  const { contentType, response } = useFetch(
    '/path/to/api',
    { method: 'POST' },
    { metadata: true }, // <--
  );
  return `The server responded with ${contentType}: ${response}`;
};

// The App component wraps the asynchronous fetching component in Suspense.
// The fallback component (loading text) is displayed until the fetch request
//   resolves.
const App = () => {
  return (
    <Suspense fallback="Loading...">
      <MyFetchingComponent />
    </Suspense>
  );
};
```

## Options

The supported options for the third, options parameter are:

### lifespan?: number

_Default: 0_

The number of milliseconds to cache the result of the request. Each time the
component mounts before this many milliseconds have passed, it will return the
response from the last time this same request was made.

If 0, the cache will be last the remainder of the browser session.

### metadata?: boolean

_Default: false_

If true, the `useFetch` hook will return metadata _in addition to_ the response
from the fetch request. Instead of returning just the response, an interface
as follows will be returned:

```typescript
interface UseFetchResponse {
  bodyUsed: boolean;
  contentType: null | string;
  headers: Headers;
  ok: boolean;
  redirected: boolean;
  // The same response from the server that would be returned if metadata were
  //   false. It is an Object is the server responded with JSON, and it is a
  //   string if the server responded with plain text.
  response: Object | string;
  status: number;
  statusText: string;
  url: string;
}
```

You can access these properties easily through destructuring. See
[Including Fetch Metadata](#including-fetch-metadata).

## Sponsor 💗

If you are a fan of this project, you may
[become a sponsor](https://github.com/sponsors/CharlesStover)
via GitHub's Sponsors Program.
