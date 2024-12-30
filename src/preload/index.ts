import { contextBridge, ipcRenderer } from "electron";
import { electronAPI, type ElectronAPI } from "@electron-toolkit/preload";
import type { CustomerProps, TaxInvoiceProps } from "../main/types/types";

declare global {
  interface Window {
    electron: ElectronAPI
    api: typeof api
  }
}

// Custom APIs for renderer
const api = {

  // ================ Backup Controller
  backupCustomers: async() => {
    return await ipcRenderer.invoke("backupCustomers");
  },

  backupTaxes: async() => {
    return await ipcRenderer.invoke("backupTaxes");
  },

  // ================ Customer Controller
  createCustomer: async(data: CustomerProps) => {
    return await ipcRenderer.invoke("createCustomer", data);
  },

  getCustomers: async(page: number, limit: number) => {
    return await ipcRenderer.invoke("getCustomers", page, limit);
  },

  getSearchCustomer: async(data: string) => {
    return await ipcRenderer.invoke("getSearchCustomer", data);
  },

  updateCustomer: async(id: number, data: CustomerProps) => {
    return await ipcRenderer.invoke("updateCustomer", id, data);
  },

  deleteCustomer: async(id: number) => {
    return await ipcRenderer.invoke("deleteCustomer", id);
  },

  // ================ Tax Controller
  createTax: async(dataTax: TaxInvoiceProps) => {
    return await ipcRenderer.invoke("createTax", dataTax);
  },

  getAllDoneTaxes: async(page: number, limit: number) => {
    return await ipcRenderer.invoke("getAllDoneTaxes", page, limit);
  },

  getAllToDoTaxes: async(page: number, limit: number) => {
    return await ipcRenderer.invoke("getAllToDoTaxes", page, limit);
  },

  getSearchCustomerTaxes: async(dataTax: string) => {
    return await ipcRenderer.invoke("getSearchCustomerTaxes", dataTax);
  },

  updateStatus: async(id: number, tax_status: string) => {
    return await ipcRenderer.invoke("updateStatus", id, tax_status);
  },

  updateTax: async(id: number, dataTax: TaxInvoiceProps) => {  
    return await ipcRenderer.invoke("updateTax", id, dataTax);
  },

  deleteTax: async(id: number) => {
    return await ipcRenderer.invoke("deleteTax", id);
  }
  
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
