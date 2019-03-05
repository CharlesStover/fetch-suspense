declare const deepEqual: any;
interface FetchCache {
    client: (input: RequestInfo, init?: RequestInit | undefined) => Promise<any>;
    fetch?: Promise<void>;
    error?: any;
    init: RequestInit | undefined;
    input: RequestInfo;
    response?: any;
}
declare const fetchCaches: FetchCache[];
interface UseFetchConfig {
    client?: (input: RequestInfo, init?: RequestInit | undefined) => Promise<any>;
    lifespan?: number;
}
declare const useFetch: (input: RequestInfo, init?: RequestInit | undefined, config?: number | UseFetchConfig | undefined) => any;
