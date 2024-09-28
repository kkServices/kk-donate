import type { EventHandler, EventHandlerRequest } from 'h3';
import type { NuxtError } from 'nuxt/app';

export function defineWrappedResponseHandler<T extends EventHandlerRequest, D>(handler: EventHandler<T, D>): EventHandler<T, D> {
  return defineEventHandler<T>(async (event) => {
    try {
      // do something before the route handler
      const data = await handler(event);
      // do something after the route handler
      return { success: true, message: '请求成功', data };
    } catch (err) {
      const error = err as NuxtError<{ errorShowType?: number, [key: string]: any }>;
      const code = error.statusCode || 500;
      const message = error.message || 'Service Error';
      const { errorShowType = 1, ...data } = error.data || {};
      const requestId = null;
      // Error handling
      return { code, message, errorShowType, data: Object.keys(data).length > 0 ? data : null, success: false, timestamp: Date.now(), requestId };
    }
  });
}
