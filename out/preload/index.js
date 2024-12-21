"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  // ================ Customer Controller
  createCustomer: async (data) => {
    return await electron.ipcRenderer.invoke("createCustomer", data);
  },
  getCustomers: async (page, limit) => {
    return await electron.ipcRenderer.invoke("getCustomers", page, limit);
  },
  getSearchCustomer: async (data) => {
    return await electron.ipcRenderer.invoke("getSearchCustomer", data);
  },
  updateCustomer: async (id, data) => {
    return await electron.ipcRenderer.invoke("updateCustomer", id, data);
  },
  deleteCustomer: async (id) => {
    return await electron.ipcRenderer.invoke("deleteCustomer", id);
  },
  // ================ Tax Controller
  createTax: async (dataTax) => {
    return await electron.ipcRenderer.invoke("createTax", dataTax);
  },
  getAllDoneTaxes: async (page, limit) => {
    return await electron.ipcRenderer.invoke("getAllDoneTaxes", page, limit);
  },
  getAllToDoTaxes: async (page, limit) => {
    return await electron.ipcRenderer.invoke("getAllToDoTaxes", page, limit);
  },
  getSearchCustomerTaxes: async (dataTax) => {
    return await electron.ipcRenderer.invoke("getSearchCustomerTaxes", dataTax);
  },
  updateStatus: async (id, tax_status) => {
    return await electron.ipcRenderer.invoke("updateStatus", id, tax_status);
  },
  updateTax: async (id, dataTax) => {
    return await electron.ipcRenderer.invoke("updateTax", id, dataTax);
  },
  deleteTax: async (id) => {
    return await electron.ipcRenderer.invoke("deleteTax", id);
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
