import { Router } from "express";
import { CustomerController } from "../controllers/customerController";
import { Request, Response } from "express";

export const customerRoutes = Router();

const customerController = new CustomerController();

customerRoutes.post("/", async (req: Request, res: Response) => {
    await customerController.createCustomer(req, res);
});

customerRoutes.get("/", async (req: Request, res: Response) => {
    await customerController.getCustomers(req, res);
});

customerRoutes.get("/search", async (req: Request, res: Response) => {
    await customerController.getSearchCustomer(req, res);
})

customerRoutes.put("/:id", async (req: Request, res: Response) => {
    await customerController.updateCustomer(req, res);
})

customerRoutes.delete("/:id", async (req: Request, res: Response) => {
  await customerController.deleteCustomer(req, res);
})