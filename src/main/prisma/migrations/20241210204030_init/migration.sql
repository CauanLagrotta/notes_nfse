-- CreateTable
CREATE TABLE "customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "customer_address" TEXT NOT NULL,
    "customer_cpf" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "tax_invoices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_tax_name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "service" TEXT NOT NULL,
    "tax_status" TEXT NOT NULL DEFAULT 'Pendente',
    "issued_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tax_invoices_customer_tax_name_fkey" FOREIGN KEY ("customer_tax_name") REFERENCES "customers" ("customer_name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_customer_name_key" ON "customers"("customer_name");

-- CreateIndex
CREATE UNIQUE INDEX "customers_customer_email_key" ON "customers"("customer_email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_customer_phone_key" ON "customers"("customer_phone");

-- CreateIndex
CREATE UNIQUE INDEX "customers_customer_cpf_key" ON "customers"("customer_cpf");
