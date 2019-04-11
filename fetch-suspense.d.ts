declare const deepEqual: any;
interface FetchCache {
    fetch?: Promise<void>;
    error?: any;
    init: RequestInit | undefined;
    input: RequestInfo;
    response?: any;
}
declare const fetchCaches: FetchCache[];
declare const useFetch: (input: RequestInfo, init?: RequestInit | undefined, lifespan?: number) => any;

export { useFetch };
export default useFetch;
