/*
  Warnings:

  - A unique constraint covering the columns `[costumer_name]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[costumer_phone]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "customers_costumer_name_key" ON "customers"("costumer_name");

-- CreateIndex
CREATE UNIQUE INDEX "customers_costumer_phone_key" ON "customers"("costumer_phone");
