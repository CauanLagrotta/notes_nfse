import { prisma } from "../db/database";
import { TaxInvoiceProps, CustomerInvoiceProps } from "../types/types";

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

export async function getAllTaxes(): Promise<CustomerInvoiceProps[]> {
  try {
    const taxes = await prisma.taxInvoice.findMany({ // Buscar todas as TaxInvoices incluindo o relacionamento com o cliente
      include: {
        customer: true,
      }
    });

    const mappedTaxes: CustomerInvoiceProps[] = taxes.map((tax) => ({ // mapeando as taxes para o formata especifico para mostrar no frontend

      id: tax.id,
      customerId: tax.customerId,
      price: tax.price,
      service: tax.service,
      tax_status: tax.tax_status,
      issued_date: tax.issued_date,
      customer_name: tax.customer.customer_name,
    }))

    return mappedTaxes;

  } catch (error) {
    console.log(error);
    throw new Error("Erro ao buscar NFS-e");
  }
}

export async function getSearchCustomerTaxes(customer_name: CustomerInvoiceProps["customer_name"]) {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        customer_name: {
          contains: customer_name.toLowerCase(),
        },
      },
      include: {
        taxInvoices: true, // incluindo nfs-e de cada cliente
      },
      orderBy: {
        customer_name: "asc",
      },
    });

    if(!customers.length) {
      throw new Error("Nenhum cliente encontrado");
    }

    const taxes = customers.flatMap((customer) => 
      customer.taxInvoices.map((tax) => ({
        id: tax.id,
        customer_name: customer.customer_name,
        price: tax.price,
        service: tax.service,
        tax_status: tax.tax_status,
        issued_date: tax.issued_date
      }))
  );

    if (!customer_name) {
      console.log(!customer_name);
      throw new Error("Nenhum cliente encontrado");
    }

    console.log(customers);
    return taxes;
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
