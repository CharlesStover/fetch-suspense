# fetch-suspense
React Suspense is a React hook that supports the React 16.6 Suspense component implementation.

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
