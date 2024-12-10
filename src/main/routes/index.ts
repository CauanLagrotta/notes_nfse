import { Router } from "express";
import { customerRoutes } from "./customerRoutes";
import { taxRoutes } from "./taxRoutes";

export const routes = Router();

routes.use("/api/customers", customerRoutes);

routes.use("/api/taxes", taxRoutes);