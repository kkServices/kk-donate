/**
 * kk service 响应类型
 */
interface CompanyJXKDoorlock {
  result: string
  status: string
}
interface DonateOrderCreate {
  /**
   * 是否是 API 创建的动态码
   */
  isApi: boolean
  /**
   * 请求支付宝 API 创建订单后查询的外部订单号
   */
  outTradeNo?: string
  /**
   * 二维码地址
   */
  qrCode: string
}

interface DonateOrderRecentItem {
  id: number
  totalAmount: number
  payStatus: string
  message: null | string
  messageStatus: DonateMessageStatus
  userName: null | string
  emailHash: string
  time: string
}
type DonateMessageStatus = 'WAITING' | 'SUCCESS' | 'FAIL';

declare interface KS_API {
  '/donate/order/recent': DonateOrderRecentItem[]
  '/donate/order/create': DonateOrderCreate
  '/company/jxk/doorlock': CompanyJXKDoorlock
  '/donate/order/status': boolean
}
