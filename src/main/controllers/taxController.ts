import { prisma } from "../db/database";
import { TaxInvoiceProps } from "../types/types";

export async function createTax(dataTax: TaxInvoiceProps) {
  try {
    // Verificar se o customerId existe no banco de dados
    const customer = await prisma.customer.findUnique({
      where: { id: dataTax.customerId },
    });

    if (!customer) {
      throw new Error("Cliente não encontrado.");
    }

    // Criar uma nova TaxInvoice
    const newTaxInvoice = await prisma.taxInvoice.create({
      data: {
        customerId: dataTax.customerId,
        price: dataTax.price,
        service: dataTax.service,
        tax_status: dataTax.tax_status || "Pendente", // Valor padrão caso não seja fornecido
        issued_date: dataTax.issued_date || new Date(), // Data atual como padrão
      },
    });

    console.log("Nota fiscal criada com sucesso:", newTaxInvoice);

    return newTaxInvoice;
  } catch (error: any) {
    console.error("Erro ao criar nota fiscal:", error.message);

    throw new Error(error.message);
  }
}

export async function getAllTaxes() {
  try {
    const taxes = await prisma.taxInvoice.findMany({
      include: {
        customer: true,
      },
    });
    return taxes;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao buscar NFS-e");
  }
}

export async function getSearchCustomerTaxes(customerName: string) {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        customer_name: {
          contains: customerName.toLowerCase(),
        },
      },
      include: {
        taxInvoices: true,
      },
      orderBy: {
        customer_name: "asc",
      },
    });

    if (!customerName) {
      console.log(!customerName);
      throw new Error("Nenhum cliente encontrado");
    }

    console.log(customers);
    return customers.length ? customers : [];
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao buscar clientes");
  }
}

export async function updateStatus(id: number, tax_status: string) {
  try {
    const taxInvoice = await prisma.taxInvoice.update({
      where: {
        id: Number(id),
      },
      data: {
        tax_status: tax_status,
      },
    });

    console.log(taxInvoice);
    return taxInvoice;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao atualizar o status");
  }
}

export async function updateTax(id: number, dataTax: TaxInvoiceProps) {
  try {
    const taxUpdated = await prisma.taxInvoice.update({
      where: { id },
      data: {
        customerId: dataTax.customerId as number,
        price: dataTax.price as string,
        service: dataTax.service as string,
        issued_date: dataTax.issued_date as Date,
      },
    });

    console.log(taxUpdated);
    return taxUpdated;
  } catch (error) {
    throw new Error("Erro ao atualizar NFS-e");
  }
}

export async function deleteTax(id: number) {
  try {
    await prisma.taxInvoice.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao deletar NFS-e");
  }
}
