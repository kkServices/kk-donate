import { AlipayService } from '~~/server/service/alipay.service';
import { DonateMessageService } from '~~/server/service/donate-message.service';
import { DonateOrderService } from '~~/server/service/donate-order.service';
import { RecaptchaService } from '~~/server/service/recaptcha.service';
import { z } from 'zod';

const bodySchema = z.object({
  totalAmount: z.number({ message: '请填写正确的金额' }),
  message: z.string({ message: '请填写正确的subject' }).optional(),
  email: z.string().email({ message: '请填写正确的email' }).optional().nullable(),
  recaptcha: z.string({ message: '请填写正确的recaptcha' }),
});

export default defineWrappedResponseHandler(async (event) => {
  const { totalAmount, email, message, recaptcha } = await validateRequest(bodySchema, event);
  const recaptchaService = new RecaptchaService();
  const ip = event.node.req.headers['x-real-ip'] || event.node.req.headers['x-forwarded-for'] || '';
  try {
    const recaptchaResult = await recaptchaService.validateToken(recaptcha, Array.isArray(ip) ? ip[0] : ip);
    if (!recaptchaResult.success) {
      console.warn(`recaptcha 验证失败`, ip, recaptchaResult);
      return new Error('recaptcha 验证失败');
    }
  } catch (e) {
    console.error(`recaptcha 验证失败`, e);
    throw new Error('recaptcha 验证失败');
  }

  let donateMessageId: number | null = null;
  let qrCode = 'https://qr.alipay.com/fkx18534hbg50ut9ucl5lc7';
  let isApi = false;
  let outTradeNo: string | null = null;
  const donateOrderService = new DonateOrderService();
  // 创建订单
  outTradeNo = donateOrderService.createOrderNum();
  const alipayService = new AlipayService(event);
  const result = await alipayService.alipayPreCreate('赞助站长', totalAmount, outTradeNo);

  if (result.code === '10000') {
    if (message) {
      const donateMessageService = new DonateMessageService();
      donateMessageId = (await donateMessageService.createDonateMessage(message)).id;
    }
    await donateOrderService.createDonateOrder({ totalAmount, email, outTradeNo, donateMessageId, payMethod: 'API' });
    qrCode = result.qrCode;
    isApi = true;
  } else {
    console.warn('支付宝预下单失败', ip, result);
    outTradeNo = null;
  }

  return { qrCode, isApi, outTradeNo };
});
