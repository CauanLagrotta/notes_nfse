/*
  Warnings:

  - You are about to drop the column `costumer_address` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `costumer_cpf` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `costumer_email` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `costumer_name` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `costumer_phone` on the `customers` table. All the data in the column will be lost.
  - Added the required column `customer_address` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_cpf` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_email` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_name` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_phone` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "customer_address" TEXT NOT NULL,
    "customer_cpf" TEXT NOT NULL
);
INSERT INTO "new_customers" ("id") SELECT "id" FROM "customers";
DROP TABLE "customers";
ALTER TABLE "new_customers" RENAME TO "customers";
CREATE UNIQUE INDEX "customers_customer_name_key" ON "customers"("customer_name");
CREATE UNIQUE INDEX "customers_customer_email_key" ON "customers"("customer_email");
CREATE UNIQUE INDEX "customers_customer_phone_key" ON "customers"("customer_phone");
CREATE UNIQUE INDEX "customers_customer_cpf_key" ON "customers"("customer_cpf");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
