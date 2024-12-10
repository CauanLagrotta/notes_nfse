import { Router } from "express";
import { TaxController } from "../controllers/taxController";
import { Request, Response } from "express";

export const taxRoutes = Router();

const taxController = new TaxController();

taxRoutes.post("/", async (req: Request, res: Response) => { 
    await taxController.createTax(req, res)
})

taxRoutes.get("/", async (req: Request, res: Response) => { 
    await taxController.getAllTaxes(req, res)
})

taxRoutes.get("/search", async (req: Request, res: Response) => { 
    await taxController.getSearchCustomerTaxes(req, res)
})

taxRoutes.put("/:id", async (req: Request, res: Response) => { 
    await taxController.updateTax(req, res)
})

taxRoutes.put("/status/:id", async (req: Request, res: Response) => {
    await taxController.updateStatus(req, res)
})

taxRoutes.delete("/:id", async (req: Request, res: Response) => { 
    await taxController.deleteTax(req, res)
})