// type UseFetchOptions = UseFetchOptions
declare enum ERROR_SHOW_TYPE {
  // 不提示
  SILENT = 0,
  // 警告消息
  WARN_MESSAGE = 1,
  // 错误消息
  ERROR_MESSAGE = 2,
  // 通知消息
  NOTIFICATION = 3,
  // 页面消息
  REDIRECT = 9,
}

declare interface BaseResponseSuccess<T = unknown> {
  /** 错误码 */
  success: true
  /** 结果 */
  data: T
}
declare interface BaseResponseError<T = null> {
  code: number
  data: T
  errorShowType: ERROR_SHOW_TYPE
  message: string
  requestId: string
  success: false
  timestamp: string
}
type BaseResponse<T = unknown> = BaseResponseSuccess<T> | BaseResponseError<T>;

declare interface RequestMeta {
  isTransformResponse?: boolean
  ignoreLogin?: boolean
  isToastError?: boolean
}
