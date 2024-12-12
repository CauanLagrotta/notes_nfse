"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  createCustomer: async (data) => {
    return await electron.ipcRenderer.invoke("createCustomer", data);
  },
  getCustomers: async () => {
    return await electron.ipcRenderer.invoke("getCustomers");
  },
  getSearchCustomer: async (data) => {
    return await electron.ipcRenderer.invoke("getSearchCustomer", data);
  },
  updateCustomer: async (id, data) => {
    return await electron.ipcRenderer.invoke("updateCustomer", id, data);
  },
  deleteCustomer: async (id) => {
    return await electron.ipcRenderer.invoke("deleteCustomer", id);
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
