import { DonateOrderService } from '~~/server/service/donate-order.service';
import { z } from 'zod';

const requestSchema = z
  .object({ outTradeNo: z.string().optional(), tradeNo: z.string().optional() })
  .refine((data) => data.outTradeNo || data.tradeNo, '请传入outTradeNo或tradeNo');

export default defineWrappedResponseHandler(async (event) => {
  const { outTradeNo, tradeNo } = await validateRequest(requestSchema, event);

  const donateOrderService = new DonateOrderService();

  if (!outTradeNo && !tradeNo) {
    throw new Error('请传入 outTradeNo 或 tradeNo');
  }
  const result = outTradeNo
    ? await donateOrderService.queryDonateOrderByOutTradeNo(outTradeNo)
    : await donateOrderService.queryDonateOrderByTradeNo(tradeNo as string);
  return result?.payStatus === 'TRADE_SUCCESS';
});
