/*
  Warnings:

  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'PAID', 'DONE', 'ABANDONED');

-- DropIndex
DROP INDEX "Profile_id_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "Status" NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");
