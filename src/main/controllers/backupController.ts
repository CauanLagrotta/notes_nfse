import { prisma } from "../db/database";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function backupCustomers() {
  try {
    const customers = await prisma.customer.findMany();
    const backupDir = join(__dirname, "../../backup");
    const backupPath = join(backupDir, "clientes.json");

    // Cria a pasta backup se ela não existir
    await mkdir(backupDir, { recursive: true });

    await writeFile(backupPath, JSON.stringify(customers, null, 2));
    console.log("Backup criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar backup:", error);
  }
}

export async function backupTaxes() {
  try {
    const taxes = await prisma.taxInvoice.findMany({
      include: {
        customer: true,
      },
    });
    const backupDir = join(__dirname, "../../backup");
    const backupPath = join(backupDir, "nfse.json");

    // Cria a pasta backup se ela não existir
    await mkdir(backupDir, { recursive: true });

    await writeFile(backupPath, JSON.stringify(taxes, null, 2));
    console.log("Backup criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar backup:", error);
  }
}