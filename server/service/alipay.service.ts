import type { EventHandlerRequest, H3Event } from 'h3';
import { AlipaySdk } from 'alipay-sdk';

export interface AlipayQueryResult {
  code: string // 10000 成功
  msg: string
  buyerLogonId: string // 买家支付宝账号
  buyerPayAmount: string // 买家实付金额
  buyerUserId: string // 买家支付宝用户号
  invoiceAmount: string // 交易中用户支付的可开具发票的金额
  outTradeNo: string // 商户订单号
  pointAmount: string // 使用集分宝付款的金额
  receiptAmount: string // 实收金额
  sendPayDate: string // 交易付款时间
  totalAmount: string // 订单金额
  tradeNo: string // 支付宝交易号
  tradeStatus: string
  traceId: string
}

export class AlipayService {
  private alipaySdk: AlipaySdk;
  constructor(
    private readonly event: H3Event<EventHandlerRequest>,
  ) {
    const config = useRuntimeConfig(event);

    const appId = config.baseAlipayAppId;
    const privateKey = config.baseAlipayPrivateKey;
    const alipayPublicKey = config.baseAlipayPublicKey;
    const gateway = config.baseAlipayGateway;
    this.alipaySdk = new AlipaySdk({ appId, privateKey, alipayPublicKey, gateway });
  }

  /**
   * 预创建订单
   * @param subject 订单标题
   * @param totalAmount 订单金额
   * @param outTradeNo 商户订单号
   */
  async alipayPreCreate(subject: string, totalAmount: number, outTradeNo: string) {
    return this.alipaySdk.exec('alipay.trade.precreate', {
      bizContent: { subject, totalAmount, outTradeNo },
      notify_url: 'https://www.kkfive.top/api/donate/order/notify',
    });
  }

  /**
   * 关闭订单
   * @param outTradeNo 商户订单号
   */
  async alipayClose(outTradeNo: string) {
    return this.alipaySdk.exec('alipay.trade.close', {
      bizContent: { outTradeNo },
    });
  }

  async alipayQuery({ outTradeNo, tradeNo }: { outTradeNo: string, tradeNo?: string } | { tradeNo: string, outTradeNo?: string }): Promise<AlipayQueryResult> {
    return await this.alipaySdk.exec('alipay.trade.query', {
      bizContent: { outTradeNo, tradeNo },
    }) as any as AlipayQueryResult;
  }

  async alipayCancel(outTradeNo: string) {
    return this.alipaySdk.exec('alipay.trade.cancel', {
      bizContent: { outTradeNo },
    });
  }

  async alipayCheckNotifySign(query: Record<string, any>) {
    return this.alipaySdk.checkNotifySign(query, false);
  }
}
