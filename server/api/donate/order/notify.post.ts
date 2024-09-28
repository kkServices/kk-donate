import { AlipayService } from '~~/server/service/alipay.service';
import { DonateOrderService } from '~~/server/service/donate-order.service';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const alipayService = new AlipayService(event);
  const { out_trade_no, trade_status, trade_no, total_amount, receipt_amount, buyer_logon_id, notify_id } = body;
  const isTrusty = await alipayService.alipayCheckNotifySign(body);
  if (!isTrusty) {
    return 'failed';
  }
  const donateOrderService = new DonateOrderService();
  await donateOrderService.updateDonateOrder(out_trade_no, {
    tradeNo: trade_no,
    payStatus: trade_status as any,
    totalAmount: Number(total_amount),
    receiptAmount: Number(receipt_amount),
    buyerUserId: buyer_logon_id,
    notifyId: notify_id,
  });

  return 'success';
});
