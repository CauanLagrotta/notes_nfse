/*
  Warnings:

  - You are about to drop the `tax_invoices_to_do` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tax_invoices_to_do";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tax_invoices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "service" TEXT NOT NULL,
    "tax_status" TEXT NOT NULL DEFAULT 'Pendente',
    "issued_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tax_invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tax_invoices" ("customer_id", "id", "issued_date", "price", "service") SELECT "customer_id", "id", "issued_date", "price", "service" FROM "tax_invoices";
DROP TABLE "tax_invoices";
ALTER TABLE "new_tax_invoices" RENAME TO "tax_invoices";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
