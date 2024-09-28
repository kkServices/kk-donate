import type { FetchOptions } from 'ofetch';

interface _FetchOptions extends FetchOptions {
  _startTime?: number
  _endTime?: number
  _duration?: number
}
export interface RequestOptions extends _FetchOptions {
  meta?: RequestMeta
}
