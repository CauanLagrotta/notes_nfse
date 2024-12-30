import { ipcMain } from "electron";
import {
  createCustomer,
  getCustomers,
  getSearchCustomer,
  updateCustomer,
  deleteCustomer,
} from "./controllers/customerController";

import {
  createTax,
  deleteTax,
  getAllDoneTaxes,
  getAllToDoTaxes,
  getSearchCustomerTaxes,
  updateTax,
  updateStatus,
} from "./controllers/taxController";

import { backupCustomers, backupTaxes } from "./controllers/backupController";

import { type CustomerProps, type TaxInvoiceProps } from "./types/types";

// ================ Backup Controller
ipcMain.handle("backupCustomers", async () => {
  return await backupCustomers();
})

ipcMain.handle("backupTaxes", async () => {
  return await backupTaxes();
})

// ================ Customer Controller
ipcMain.handle("createCustomer", async (_, data: CustomerProps) => {
  console.log("dados recebidos: ", data);
  return await createCustomer(data);
});

ipcMain.handle("getCustomers", async (_, page: number, limit: number) => {
  return await getCustomers(page, limit);
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

// ================ Tax Controller
ipcMain.handle("createTax", async (_, dataTax: TaxInvoiceProps) => {
  if(!dataTax.customerId) throw new Error("Cliente nao encontrado");
  console.log("dados recebidos: ", dataTax);

  return await createTax(dataTax);
});

ipcMain.handle("getAllDoneTaxes", async (_, page: number, limit: number) => {
  return await getAllDoneTaxes(page, limit);
});

ipcMain.handle("getAllToDoTaxes", async (_, page: number, limit: number) => {
  return await getAllToDoTaxes(page, limit);
});

ipcMain.handle("getSearchCustomerTaxes", async (_, dataTax: string) => {
  return await getSearchCustomerTaxes(dataTax);
});

ipcMain.handle("updateStatus", async (_, id: number, tax_status: string) => {
  return await updateStatus(id, tax_status);
});

ipcMain.handle("updateTax", async (_, id: number, dataTax: TaxInvoiceProps) => {
  return await updateTax(id, dataTax);
})

ipcMain.handle("deleteTax", async (_, id: number) => {
  return await deleteTax(id);
});
