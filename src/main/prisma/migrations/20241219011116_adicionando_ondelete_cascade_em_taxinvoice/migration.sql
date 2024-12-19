-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tax_invoices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "price" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "tax_status" TEXT NOT NULL DEFAULT 'Pendente',
    "issued_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tax_invoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tax_invoices" ("customerId", "id", "issued_date", "price", "service", "tax_status") SELECT "customerId", "id", "issued_date", "price", "service", "tax_status" FROM "tax_invoices";
DROP TABLE "tax_invoices";
ALTER TABLE "new_tax_invoices" RENAME TO "tax_invoices";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
