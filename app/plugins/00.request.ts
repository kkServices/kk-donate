import { onRequest, onRequestError, onResponse, onResponseError } from '~/service/kk-service/interceptor';

export default defineNuxtPlugin((nuxtApp) => {
  const $request = $fetch.create({
    onRequest: (context) => onRequest(context, nuxtApp),
    onRequestError: (context) => onRequestError(context, nuxtApp),
    onResponse: (context) => onResponse(context, nuxtApp),
    onResponseError: (context) => onResponseError(context, nuxtApp),
  });

  return {
    provide: {
      request: $request,
    },
  };
});
