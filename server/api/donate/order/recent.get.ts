import { DonateOrderService } from '~~/server/service/donate-order.service';
import dayjs from 'dayjs';

export default defineWrappedResponseHandler(async () => {
  const donateOrderService = new DonateOrderService();
  const result = await donateOrderService.queryDonateOrders();
  return result.map((item) => {
    const totalAmount = item.totalAmount;
    const message = item.donateMessage?.status === 'SUCCESS' ? item.donateMessage.content : null;
    const messageStatus = item.donateMessage?.status;
    const userName = emailMask(item.email) || item.buyerUserId || '热心网友';
    const emailHash = getEmailSha256(item.email || item.buyerUserId || '');
    const time = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss');
    const payStatus = item.payStatus;
    const id = item.id;

    return { totalAmount, payStatus, message, messageStatus, userName, emailHash, time, id };
  });
});
