# fetch-suspense
`useFetch` is a React hook that supports the React 16.6 Suspense component implementation.

[![package](https://img.shields.io/github/package-json/v/CharlesStover/fetch-suspense.svg)](https://travis-ci.com/CharlesStover/fetch-suspense/)
[![build](https://api.travis-ci.com/CharlesStover/fetch-suspense.svg)](https://travis-ci.com/CharlesStover/fetch-suspense/)
[![downloads](https://img.shields.io/npm/dt/fetch-suspense.svg)](https://www.npmjs.com/package/fetch-suspense)
[![minified size](https://img.shields.io/bundlephobia/min/fetch-suspense.svg)](https://www.npmjs.com/package/fetch-suspense)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/fetch-suspense.svg)](https://www.npmjs.com/package/fetch-suspense)

## Use

```JavaScript
import useFetch from 'fetch-suspense';

// This fetching component will be delayed by Suspense until the fetch request resolves.
// The return value of useFetch will be the response of the server.
const MyFetchingComponent = () => {
  const data = useFetch('/path/to/api', { method: 'POST' });
  return 'The server responded with: ' + data;
};

// The App component wraps the asynchronous fetching component in Suspense.
// The fallback component (loading text) is displayed until the fetch request resolves.
const App = () => {
  return (
    <Suspense fallback="Loading...">
      <MyFetchingComponent />
    </Suspense>
  );
};
```

## Install

* `npm install fetch-suspense --save` or
* `yarn add fetch-suspense`
