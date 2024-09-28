import type { Prisma } from '~~/lib/prisma';

import prisma from '~~/lib/prisma';
import dayjs from 'dayjs';
import short from 'short-uuid';

export class DonateOrderService {
  constructor() {}

  createOrderNum() {
    const decimalTranslator = short('0123456789', { consistentLength: true }); // Provide a specific alphabet for translation
    const currentDay = dayjs().format('YYYYMMDDHHmmss');
    const uuid = decimalTranslator.new();
    return `ORD_1_${currentDay.toString()}_${uuid}`;
  }

  async createDonateOrder(data: Prisma.XOR<Prisma.DonateOrdersCreateInput, Prisma.DonateOrdersUncheckedCreateInput>) {
    return prisma.donateOrders.create({ data });
  }

  async queryDonateOrderByOutTradeNo(outTradeNo: string) {
    return prisma.donateOrders.findFirst({ where: { outTradeNo } });
  }

  async queryDonateOrderByTradeNo(tradeNo: string) {
    return prisma.donateOrders.findFirst({ where: { tradeNo } });
  }

  async queryDonateOrders(take = 5) {
    return prisma.donateOrders.findMany({
      take,
      where: { OR: [{ payStatus: 'TRADE_FINISHED' }, { payStatus: 'TRADE_SUCCESS' }], AND: { totalAmount: { gte: 1 } } },
      include: { donateMessage: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateDonateOrder(outTradeNo: string, data: Prisma.DonateOrdersUncheckedUpdateInput) {
    return prisma.donateOrders.updateMany({ where: { outTradeNo }, data });
  }

  async getTodayApiDonateAmount() {
    const YMD = dayjs().format('YYYY-MM-DD');
    const result = await prisma.donateOrders.aggregate({
      _sum: { totalAmount: true },
      where: { AND: { payStatus: 'TRADE_SUCCESS', payMethod: 'API', createdAt: { gte: new Date(YMD), lte: new Date(`${YMD} 23:59:59`) } } },
    });
    return result._sum.totalAmount || 0;
  }
}
