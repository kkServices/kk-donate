import { Prisma, PrismaClient } from '@prisma/client';

function prismaClientSingleton() {
  return new PrismaClient();
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
// eslint-disable-next-line no-restricted-globals
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// eslint-disable-next-line node/prefer-global/process
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
export { Prisma };
