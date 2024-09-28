import { AlipayService } from '~~/server/service/alipay.service';
import { DonateMessageService } from '~~/server/service/donate-message.service';
import { DonateOrderService } from '~~/server/service/donate-order.service';
import { z } from 'zod';

const bodySchema = z.object({
  tradeNo: z.string({ message: '请填写正确的tradeNo' }),
  message: z.string({ message: '请填写正确的subject' }).optional(),
  email: z.string().email({ message: '请填写正确的email' }).optional(),
});

export default defineWrappedResponseHandler(async (event) => {
  const { tradeNo, message, email } = await validateRequest(bodySchema, event);
  const donateOrderService = new DonateOrderService();
  const isExist = await donateOrderService.queryDonateOrderByTradeNo(tradeNo);
  if (isExist) {
    throw new Error('订单已存在');
  }

  let donateMessageId: number | null = null;

  if (message) {
    const donateMessageService = new DonateMessageService();
    donateMessageId = (await donateMessageService.createDonateMessage(message)).id;
  }
  const alipayService = new AlipayService(event);
  const { totalAmount, outTradeNo, buyerLogonId, receiptAmount, sendPayDate, tradeStatus, code } = await alipayService.alipayQuery({ tradeNo });

  if (code === '10000') {
    const result = await donateOrderService.createDonateOrder({
      email,
      tradeNo,
      outTradeNo,
      donateMessageId,
      buyerUserId: buyerLogonId,
      payMethod: 'STATIC_CODE',
      payStatus: tradeStatus as any,
      totalAmount: Number(totalAmount),
      createdAt: new Date(sendPayDate),
      updatedAt: new Date(sendPayDate),
      receiptAmount: Number(receiptAmount),
    });
    return result.id;
  } else if (code === '40004') {
    throw new Error('未查询到该订单号');
  } else {
    throw new Error('只能添加支付成功的订单');
  }
});
