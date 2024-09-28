-- CreateEnum
CREATE TYPE "DONATE_PAY_TYPE" AS ENUM ('ALIPAY');

-- CreateEnum
CREATE TYPE "DONATE_MESSAGE_STATUS" AS ENUM ('SUCCESS', 'WAITING', 'FAIL');

-- CreateEnum
CREATE TYPE "DONATE_PAY_METHOD" AS ENUM ('API', 'STATIC_CODE');

-- CreateEnum
CREATE TYPE "DONATE_ORDER_STATUS" AS ENUM ('TRADE_FINISHED', 'TRADE_SUCCESS', 'TRADE_CLOSED', 'WAIT_BUYER_PAY');

-- CreateTable
CREATE TABLE "donate_orders" (
    "id" SERIAL NOT NULL,
    "out_trade_no" TEXT NOT NULL,
    "trade_no" TEXT,
    "donate_pay_type" "DONATE_PAY_TYPE" NOT NULL DEFAULT 'ALIPAY',
    "donate_message_id" INTEGER,
    "pay_status" "DONATE_ORDER_STATUS" NOT NULL DEFAULT 'WAIT_BUYER_PAY',
    "pay_method" "DONATE_PAY_METHOD" NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "receipt_amount" DOUBLE PRECISION,
    "buyer_email" TEXT,
    "buyer_user_id" TEXT,
    "notify_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donate_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donate_messages" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "status" "DONATE_MESSAGE_STATUS" NOT NULL DEFAULT 'WAITING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donate_messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "donate_orders" ADD CONSTRAINT "donate_orders_donate_message_id_fkey" FOREIGN KEY ("donate_message_id") REFERENCES "donate_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
