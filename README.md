# useFetch [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=You%20can%20now%20use%20React%20Suspense%20with%20the%20Fetch%20API!&url=https://github.com/CharlesStover/fetch-suspense&via=CharlesStover&hashtags=react,reactjs,javascript,typescript,webdev,webdevelopment) [![version](https://img.shields.io/npm/v/fetch-suspense.svg)](https://www.npmjs.com/package/fetch-suspense) [![minified size](https://img.shields.io/bundlephobia/min/fetch-suspense.svg)](https://www.npmjs.com/package/fetch-suspense) [![minzipped size](https://img.shields.io/bundlephobia/minzip/fetch-suspense.svg)](https://www.npmjs.com/package/fetch-suspense) [![downloads](https://img.shields.io/npm/dt/fetch-suspense.svg)](https://www.npmjs.com/package/fetch-suspense) [![build](https://api.travis-ci.com/CharlesStover/fetch-suspense.svg)](https://travis-ci.com/CharlesStover/fetch-suspense/)

`useFetch` is a React hook that supports the React 16.6 Suspense component
implementation.

The design decisions and development process for this package are outlind in
the Medium article
[React Suspense with the Fetch API](https://medium.com/@Charles_Stover/react-suspense-with-the-fetch-api-a1b7369b0469).

## Install

* `npm install fetch-suspense --save` or
* `yarn add fetch-suspense`

## Example

```JavaScript
import useFetch from 'fetch-suspense';
import React, { Suspense } from 'react';

// This fetching component will be delayed by Suspense until the fetch request
//   resolves.
// The return value of useFetch will be the response of the server.
const MyFetchingComponent = () => {
  const data = useFetch('/path/to/api', { method: 'POST' });
  return 'The server responded with: ' + data;
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

## Using a Custom Fetch API

If you don't want to rely on the global `fetch` API, you can create your own
`useFetch` hook by importing the `createUseFetch` helper function.

```JavaScript
import { createUseFetch } from 'fetch-suspense';
import myFetchApi from 'my-fetch-package';
import React, { Suspense } from 'react';

// Create a useFetch hook using one's own Fetch API.
// NOTE: useFetch hereafter refers to this constant, not the default export of
//   the fetch-suspense package.
const useFetch = createUseFetch(myFetchApi);

// This fetching component will be delayed by Suspense until the fetch request
//   resolves.
// The return value of useFetch will be the response of the server.
const MyFetchingComponent = () => {
  const data = useFetch('/path/to/api', { method: 'POST' });
  return 'The server responded with: ' + data;
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
