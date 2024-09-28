import type { FetchContext, FetchResponse } from 'ofetch';
import type { RequestOptions } from './types';

type Context = FetchContext<any> & { response: FetchResponse<ResponseType>, options: Required<RequestOptions> };

/** 未登录时跳转的页面路径 */
const NOT_AUTH_REDIRECT = '/login';
const defaultMeta: Required<RequestMeta> = {
  isTransformResponse: true,
  ignoreLogin: false,
  isToastError: true,
};
function createShowToast(nuxtApp: any) {
  function showToast(message: string, errorShowType: ERROR_SHOW_TYPE = 2, toastId?: string) {
    const $toast = nuxtApp.$toast;
    if (!$toast || !message || errorShowType === 0 || ![1, 2, 3].includes(errorShowType)) {
      return;
    }
    const switchType: Record<1 | 2 | 3, string> = {
      1: 'warning',
      2: 'error',
      3: 'info',
    };
    const type = switchType[errorShowType as 1 | 2 | 3] || 'error';
    $toast(message, { type, toastId, autoClose: 5000, position: 'top-right' });
  }
  return showToast;
}

function getRequestPath(context: FetchContext) {
  const { request: _request, options } = context;
  const baseUrl = options.baseURL ?? '';
  return typeof _request === 'string' ? _request.replace(baseUrl, '') : _request as unknown as string;
}

async function authInterceptor(context: Context, nuxtApp: any) {
  const showToast = createShowToast(nuxtApp);
  const { response, options: _options } = context;
  const data = response._data as BaseResponseError;
  if (data.code === 401 && !_options.meta?.ignoreLogin) {
    if (import.meta.server) {
      await nuxtApp?.runWithContext(() => navigateTo(NOT_AUTH_REDIRECT, { replace: true }));
    } else {
      showToast(data.message, data.errorShowType, 'interceptor-401');
      await navigateTo(NOT_AUTH_REDIRECT, { replace: true });
    }
  }
}

export function onResponseError(context: FetchContext<any, any> & { response: FetchResponse<ResponseType> }, nuxtApp: any): Promise<void> | void {
  const $logger = nuxtApp.$logger;
  const { response, request, options } = context;
  const statusCode = response.status;
  const data = response._data as BaseResponse;
  if (import.meta.server) {
    const requestPath = getRequestPath(context);
    $logger?.error(`【HTTP】请求异常：${statusCode}`, { requestPath, request, options, response });
  }

  if (statusCode < 200 || statusCode >= 300) {
    return Promise.reject(createError({ statusCode, message: 'xxx', data }));
  }
}

export async function onResponse(context: FetchContext<any, any> & { response: FetchResponse<ResponseType> }, nuxtApp?: any) {
  const showToast = createShowToast(nuxtApp);
  const $logger = nuxtApp.$logger;
  const { response, options: _options } = context;
  const options: RequestOptions = _options;
  options._endTime = Date.now();
  options._duration = options._endTime - (options._startTime as number);
  const requestPath = getRequestPath(context);
  const data = response._data as BaseResponse;
  // const isSuccess = data.success;

  if (data.success === false) {
    const code = data.code;
    showToast(data.message, data.errorShowType || 1);
    $logger?.error(`【HTTP】业务状态码异常:${code}`, { requestPath, options, response });
    if (options._duration > 1000) {
      $logger?.warning(`【HTTP】请求耗时过长+${options._duration / 1000}s`, { requestPath, options, response });
    }
    await authInterceptor(context as Context, nuxtApp);

    return Promise.reject(createError({ statusCode: data.code, message: data.message, data }));
  }

  if (options.meta?.isTransformResponse) {
    response._data = data.data;
  }
}

export async function onRequestError(context: FetchContext<any, any> & { error: Error }, nuxtApp: any): Promise<void> {
  const $logger = nuxtApp.$logger;
  const showToast = createShowToast(nuxtApp);
  if (import.meta.client && context.error) {
    showToast(context.error.message, ERROR_SHOW_TYPE.ERROR_MESSAGE);
  } else {
    const requestPath = getRequestPath(context as any);
    $logger?.error('【HTTP】请求异常', { requestPath, context });
  }
  return Promise.reject(context);
}
export async function onRequest(context: FetchContext<any, any>, _nuxtApp: any) {
  const { options: _options, request } = context;
  const config = useRuntimeConfig();
  const options: RequestOptions = _options;
  /**
   * 如果请求地址不是以http://或https://开头，则默认使用baseApiHost
   * 使用 $fetch 的baseURL时不会判断传入URL是否为绝对路径 因此需要手动判断
   */
  const url = typeof request === 'string' ? request : request.url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    options.baseURL = import.meta.server ? config.baseApiHost : config.public.baseApiHost;
  }
  options.meta = { ...defaultMeta, ...options.meta };
  options._startTime = Date.now();
  options.headers = {
    ...options.headers,
  };
}
