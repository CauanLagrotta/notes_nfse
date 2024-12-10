import { Request, Response } from "express";
import { prisma } from "../db/database";

export class CustomerController {
  async createCustomer(req: Request, res: Response): Promise<Response> {
    try {
      const {
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_cpf,
      } = req.body;

      const userExists = await prisma.customer.findFirst({
        where: {
          OR: [
            { customer_name },
            { customer_cpf },
            { customer_email },
            { customer_phone },
          ],
        },
      });

      if (userExists) {
        if (userExists.customer_name === customer_name) {
          return res.status(400).send("Nome já cadastrado");
        }
        if (userExists.customer_cpf === customer_cpf) {
          return res.status(400).send("CPF já cadastrado");
        }
        if (userExists.customer_email === customer_email) {
          return res.status(400).send("Email já cadastrado");
        }
        if (userExists.customer_phone === customer_phone) {
          return res.status(400).send("Telefone já cadastrado");
        }
      }

      await prisma.customer.create({
        data: {
          customer_name: customer_name as string,
          customer_email: customer_email as string,
          customer_phone: customer_phone as string,
          customer_address: customer_address as string,
          customer_cpf: customer_cpf as string,
        },
      });

      return res.status(201).json({ msg: "Cliente criado com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Erro interno" });
    }
  }

  async getCustomers(_: Request, res: Response): Promise<Response> {
    try {
      const customers = await prisma.customer.findMany();
      return res.status(200).json(customers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Erro interno" });
    }
  }

  async getSearchCustomer(req: Request, res: Response): Promise<Response> {
    try {
      const customerName = req.query.customer_name
        ? (req.query.customer_name as string)
        : "";
  
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
  
      if (!customers.length) {
        return res.status(404).json({ msg: "Nenhum cliente encontrado." });
      }
  
      return res.status(200).json({ customers });
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      return res.status(500).json({ msg: "Erro interno" });
    }
  }
  

  async updateCustomer(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const {
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_cpf,
      } = req.body;

      const customerExists = await prisma.customer.findUnique({
        where: { id: Number(id) },
      });

      if (!customerExists) {
        return res.status(404).json({ msg: "Cliente não encontrado" });
      }

      await prisma.customer.update({
        where: { id: Number(id) },
        data: {
          customer_name,
          customer_email,
          customer_phone,
          customer_address,
          customer_cpf,
        },
      });

      return res.status(200).json({ msg: "Cliente atualizado com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Erro interno" });
    }
  }

  async deleteCustomer(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const customerExists = await prisma.customer.findUnique({
        where: { id: Number(id) },
      });

      if (!customerExists) {
        return res.status(404).json({ msg: "Cliente não encontrado" });
      }

      await prisma.customer.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({ msg: "Cliente deletado com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Erro interno" });
    }
  }
}
