import { Request, Response } from "express";
import { prisma } from "../db/database";

export class TaxController {
  async createTax(req: Request, res: Response): Promise<Response> {
    try {
      const { customer_tax_name, price, service } = req.body;

      if (!customer_tax_name || !price || !service) {
        return res.status(400).send({ msg: "Dados incompletos" });
      }

      const customerExists = await prisma.customer.findUnique({
        where: {
          customer_name: customer_tax_name,
        },
      });

      if (!customerExists) {
        return res.status(404).send({ msg: "Cliente não encontrado" });
      }

      const taxInvoice = await prisma.taxInvoice.create({
        data: {
          customer_tax_name: customerExists.customer_name,
          price: parseFloat(price),
          service: service.trim(),
        },
      });

      return res.status(201).send({
        msg: "NFS-e cadastrada com sucesso",
        taxInvoice,
      });
    } catch (error) {
      console.error("Erro ao criar nota fiscal:", error);
      return res.status(500).send({ msg: "Erro interno" });
    }
  }

  async getAllTaxes(_: Request, res: Response): Promise<Response> {
    try {
      const taxes = await prisma.taxInvoice.findMany();
      return res.status(200).send(taxes);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Erro interno" });
    }
  }

  async getSearchCustomerTaxes(req: Request, res: Response): Promise<Response> {
    try {
      const customerName = req.query.customer_name
        ? (req.query.customer_name as string)
        : "";
  
      if (!customerName) {
        return res.status(400).json({ msg: "O nome do cliente é obrigatório" });
      }
  
      const invoices = await prisma.taxInvoice.findMany({
        where: {
          customer: {
            customer_name: {
              contains: customerName.toLowerCase(),
            },
          },
        },
        orderBy: {
          customer: {
            customer_name: "asc",
          },
        },
        include: {
          customer: true,
        },
      });
  
      if (invoices.length === 0) {
        return res
          .status(404)
          .json({ msg: "Nenhuma NFS-e encontrada para esse cliente" });
      }
  
      return res.status(200).json({ invoices });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Erro interno" });
    }
  }
  

  async updateStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { tax_status } = req.body;

      const taxInvoice = await prisma.taxInvoice.update({
        where: {
          id: Number(id),
        },
        data: {
          tax_status: tax_status,
        },
      });

      return res
        .status(200)
        .json({ msg: "Status atualizado com sucesso", taxInvoice });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Erro interno" });
    }
  }

  async updateTax(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { price, service } = req.body;

      const taxInvoice = await prisma.taxInvoice.update({
        where: {
          id: Number(id),
        },
        data: {
          price: parseFloat(price),
          service: service.trim(),
        },
      });

      return res
        .status(200)
        .json({ msg: "NFS-e atualizada com sucesso", taxInvoice });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Erro interno" });
    }
  }

  async deleteTax(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await prisma.taxInvoice.delete({
        where: { id: Number(id) },
      });
      return res.status(200).json({ msg: "NFS-e deletada com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Erro interno" });
    }
  }
}
