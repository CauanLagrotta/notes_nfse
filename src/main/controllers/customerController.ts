import { prisma } from "../db/database";
import { CustomerProps } from "../types/types";

export async function createCustomer(data: CustomerProps){
    try {
      const {
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_cpf,
      } = data;

      const userExists = await prisma.customer.findFirst({
        where: {
          OR: [
            { customer_name },
            { customer_cpf },
            { customer_phone },
          ],
        },
      });

      if (userExists) {
        if (userExists.customer_name === customer_name) {
          throw new Error("Nome já cadastrado")
        }
        if (userExists.customer_cpf === customer_cpf) {
          throw new Error("CPF já cadastrado");
        }
        if (userExists.customer_phone === customer_phone) {
          throw new Error("Telefone já cadastrado");
        }
      }

      await prisma.customer.create({
        data: {
          customer_name: customer_name as string,
          customer_email: customer_email as string || null,
          customer_phone: customer_phone as string,
          customer_address: customer_address as string,
          customer_cpf: customer_cpf as string,
        },
      })
    } catch (error) {
      console.error(error);
      throw error
    }
  }

export async function getCustomers(){
    try {
      return await prisma.customer.findMany();
      
    } catch (error) {
      throw new Error("Erro ao buscar clientes");
    }
  }

export async function getSearchCustomer(customerName: string){
    try {
      const customers = await prisma.customer.findMany({
        where: customerName
          ? {
              customer_name: {
                contains: customerName.toLowerCase(),
              },
            }
          : undefined,
        orderBy: {
          customer_name: "asc",
        },
      });
  
      return customers.length ? customers : [];
    } catch (error) {
      throw new Error("Erro ao buscar clientes");
    }
  }
  

export async function updateCustomer(id: number, data: CustomerProps){
    try {
      const customerExists = await prisma.customer.findUnique({
        where: { id },
      });

      if (!customerExists) {
        throw new Error("Cliente nao encontrado");
      }

      const customerUpdated = await prisma.customer.update({
        where: { id },
        data: {
          customer_name: data.customer_name as string,
          customer_email: data.customer_email as string,
          customer_phone: data.customer_phone as string,
          customer_address: data.customer_address as string,
          customer_cpf: data.customer_cpf as string,
        },
      })

      return customerUpdated

    } catch (error) {
      throw new Error("Erro ao atualizar o cliente");
    }
  }

  export async function deleteCustomer(id: number){
    try {
      await prisma.customer.delete({
        where: { id },
      })

    } catch (error) {
      console.log(error);
      throw new Error("Erro ao deletar o cliente",);
    }
  }
