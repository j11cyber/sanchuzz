-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('PRODUCT', 'SERVICE_DEPOSIT');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('ENQUIRY', 'DEPOSIT_PAID', 'SCHEDULED', 'COMPLETED', 'CANCELLED');

-- AlterTable: rename, not drop, so existing visibility flags are kept
ALTER TABLE "CaseFile" RENAME COLUMN "active" TO "published";

-- AlterTable
ALTER TABLE "CheckupSubmission" ADD COLUMN     "answers" TEXT NOT NULL DEFAULT '{}',
ADD COLUMN     "symptoms" TEXT NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "brand" "StoreSection" NOT NULL,
ADD COLUMN     "type" "OrderType" NOT NULL DEFAULT 'PRODUCT',
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL;

-- AlterTable: backfill any null brand before tightening the column
UPDATE "Product" SET "brand" = 'Santus Sabaoth' WHERE "brand" IS NULL;
ALTER TABLE "Product" ALTER COLUMN "brand" SET NOT NULL,
ALTER COLUMN "brand" SET DEFAULT 'Santus Sabaoth';

-- AlterTable
ALTER TABLE "ServiceItem" ADD COLUMN     "depositPercent" INTEGER NOT NULL DEFAULT 50;

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "occasion" TEXT,
    "preferredDate" TIMESTAMP(3),
    "format" TEXT,
    "notes" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'ENQUIRY',
    "depositAmount" INTEGER NOT NULL,
    "orderId" TEXT,
    "checkupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_reference_key" ON "Booking"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_orderId_key" ON "Booking"("orderId");

-- CreateIndex
CREATE INDEX "Booking_status_createdAt_idx" ON "Booking"("status", "createdAt");

-- CreateIndex
CREATE INDEX "CheckupSubmission_createdAt_idx" ON "CheckupSubmission"("createdAt");

-- CreateIndex
CREATE INDEX "Order_brand_createdAt_idx" ON "Order"("brand", "createdAt");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_checkupId_fkey" FOREIGN KEY ("checkupId") REFERENCES "CheckupSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

