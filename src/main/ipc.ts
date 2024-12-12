import { ipcMain } from "electron";
import {
  createCustomer,
  getCustomers,
  getSearchCustomer,
  updateCustomer,
  deleteCustomer,
} from "./controllers/customerController";
import { type CustomerProps } from "./types/types";

ipcMain.handle("createCustomer", async (_, data: CustomerProps) => {
  console.log("dados recebidos: ", data);
  return await createCustomer(data);
});

ipcMain.handle("getCustomers", async () => {
  return await getCustomers();
});

ipcMain.handle("getSearchCustomer", async (_, data: string) => {
  return await getSearchCustomer(data);
});

ipcMain.handle("updateCustomer", async (_, id: number, data: CustomerProps) => {
  return await updateCustomer(id, data);
});

ipcMain.handle("deleteCustomer", async (_, id: number) => {
  return await deleteCustomer(id);
});