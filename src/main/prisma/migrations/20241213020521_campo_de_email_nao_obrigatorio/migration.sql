-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT,
    "customer_phone" TEXT NOT NULL,
    "customer_address" TEXT NOT NULL,
    "customer_cpf" TEXT NOT NULL
);
INSERT INTO "new_customers" ("customer_address", "customer_cpf", "customer_email", "customer_name", "customer_phone", "id") SELECT "customer_address", "customer_cpf", "customer_email", "customer_name", "customer_phone", "id" FROM "customers";
DROP TABLE "customers";
ALTER TABLE "new_customers" RENAME TO "customers";
CREATE UNIQUE INDEX "customers_customer_name_key" ON "customers"("customer_name");
CREATE UNIQUE INDEX "customers_customer_email_key" ON "customers"("customer_email");
CREATE UNIQUE INDEX "customers_customer_phone_key" ON "customers"("customer_phone");
CREATE UNIQUE INDEX "customers_customer_cpf_key" ON "customers"("customer_cpf");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
