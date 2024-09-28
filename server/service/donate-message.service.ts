import prisma from '~~/lib/prisma';

export class DonateMessageService {
  async createDonateMessage(content: string) {
    return prisma.donateMessages.create({ data: { content } });
  }
}
