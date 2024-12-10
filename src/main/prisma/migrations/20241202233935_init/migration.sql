-- CreateTable
CREATE TABLE "customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "costumer_name" TEXT NOT NULL,
    "costumer_email" TEXT NOT NULL,
    "costumer_phone" TEXT NOT NULL,
    "costumer_address" TEXT NOT NULL,
    "costumer_cpf" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "tax_invoices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "service" TEXT NOT NULL,
    "issued_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tax_invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tax_invoices_to_do" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "service" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "due_date" DATETIME NOT NULL,
    CONSTRAINT "tax_invoices_to_do_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_costumer_email_key" ON "customers"("costumer_email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_costumer_cpf_key" ON "customers"("costumer_cpf");
