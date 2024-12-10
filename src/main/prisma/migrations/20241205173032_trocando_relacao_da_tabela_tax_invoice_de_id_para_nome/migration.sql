/*
  Warnings:

  - You are about to drop the column `customer_id` on the `tax_invoices` table. All the data in the column will be lost.
  - Added the required column `customer_tax_name` to the `tax_invoices` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tax_invoices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_tax_name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "service" TEXT NOT NULL,
    "tax_status" TEXT NOT NULL DEFAULT 'Pendente',
    "issued_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tax_invoices_customer_tax_name_fkey" FOREIGN KEY ("customer_tax_name") REFERENCES "customers" ("customer_name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tax_invoices" ("id", "issued_date", "price", "service", "tax_status") SELECT "id", "issued_date", "price", "service", "tax_status" FROM "tax_invoices";
DROP TABLE "tax_invoices";
ALTER TABLE "new_tax_invoices" RENAME TO "tax_invoices";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
