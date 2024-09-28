import type { AsyncData, UseFetchOptions } from '#app';

interface UseFetchOptionsWithMeta<T> extends UseFetchOptions<T> {
  meta?: RequestMeta
}

function useRequest<K extends keyof KS_API, T = KS_API[K] | unknown, E = BaseResponseError>(url: K, options?: UseFetchOptionsWithMeta<T>): AsyncData<KS_API[K] | undefined, E | undefined>;
function useRequest<T = unknown, E = BaseResponseError>(url: string, options?: UseFetchOptionsWithMeta<T>): AsyncData<T | undefined, E | undefined>;

function useRequest<T = unknown, E = BaseResponseError>(
  url: string,
  options: UseFetchOptionsWithMeta<T> = {},
) {
  const { $request } = useNuxtApp();
  return useFetch<T, E>(url, {

    ...options,
    $fetch: $request,
  } as any);
}
export { useRequest };

// const { data: data1 } = await useRequest('/saasddsa/sad', {})
// console.log(data1.value) // 类型为 unknown
//
// const { data: data2 } = await useRequest<{ a: 1 }>('/saasddsa/sad', {})
// console.log(data2.value) // 类型为 { a: 1 }
//
// // 通过 KS_API 接口定义的请求
// const { data: data3 } = await useRequest('/as/as', {})
// console.log(data3.value) // 类型为 KS_API['/as/as']
//
// const { data: data4 } = await useRequest<{ a: 1 }>('/as/as', {})
// console.log(data4.value) // 类型为 { a: 1 }
