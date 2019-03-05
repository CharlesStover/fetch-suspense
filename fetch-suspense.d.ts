declare const deepEqual: any;
interface FetchCache {
    fetch?: Promise<void>;
    error?: any;
    init: RequestInit | undefined;
    input: RequestInfo;
    response?: any;
}
declare const createUseFetch: (fetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<any>) => (input: RequestInfo, init?: RequestInit | undefined, lifespan?: number) => any;
declare const useFetch: (input: RequestInfo, init?: RequestInit | undefined, lifespan?: number) => any;
