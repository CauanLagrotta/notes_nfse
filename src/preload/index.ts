import { contextBridge, ipcRenderer } from "electron";
import { electronAPI, type ElectronAPI } from "@electron-toolkit/preload";
import type { CustomerProps } from "../main/types/types";

declare global {
  interface Window {
    electron: ElectronAPI
    api: typeof api
  }
}

// Custom APIs for renderer
const api = {
  createCustomer: async(data: CustomerProps) => {
    return await ipcRenderer.invoke("createCustomer", data);
  },

  getCustomers: async() => {
    return await ipcRenderer.invoke("getCustomers");
  },

  getSearchCustomer: async(data: string) => {
    return await ipcRenderer.invoke("getSearchCustomer", data);
  },

  updateCustomer: async(id: number, data: CustomerProps) => {
    return await ipcRenderer.invoke("updateCustomer", id, data);
  },

  deleteCustomer: async(id: number) => {
    return await ipcRenderer.invoke("deleteCustomer", id);
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
