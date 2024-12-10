"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const express = require("express");
const client = require("@prisma/client");
const cors = require("cors");
const prisma = new client.PrismaClient();
class CustomerController {
  async createCustomer(req, res) {
    try {
      const {
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_cpf
      } = req.body;
      const userExists = await prisma.customer.findFirst({
        where: {
          OR: [
            { customer_name },
            { customer_cpf },
            { customer_email },
            { customer_phone }
          ]
        }
      });
      if (userExists) {
        if (userExists.customer_name === customer_name) {
          return res.status(400).send("Nome já cadastrado");
        }
        if (userExists.customer_cpf === customer_cpf) {
          return res.status(400).send("CPF já cadastrado");
        }
        if (userExists.customer_email === customer_email) {
          return res.status(400).send("Email já cadastrado");
        }
        if (userExists.customer_phone === customer_phone) {
          return res.status(400).send("Telefone já cadastrado");
        }
      }
      await prisma.customer.create({
        data: {
          customer_name,
          customer_email,
          customer_phone,
          customer_address,
          customer_cpf
        }
      });
      return res.status(201).json({ msg: "Cliente criado com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Erro interno" });
    }
  }
  async getCustomers(_, res) {
    try {
      const customers = await prisma.customer.findMany();
      return res.status(200).json(customers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Erro interno" });
    }
  }
  async getSearchCustomer(req, res) {
    try {
      const customerName = req.query.customer_name ? req.query.customer_name : "";
      const customers = await prisma.customer.findMany({
        where: customerName ? {
          customer_name: {
            contains: customerName.toLowerCase()
          }
        } : void 0,
        orderBy: {
          customer_name: "asc"
        }
      });
      if (!customers.length) {
        return res.status(404).json({ msg: "Nenhum cliente encontrado." });
      }
      return res.status(200).json({ customers });
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      return res.status(500).json({ msg: "Erro interno" });
    }
  }
  async updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const {
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_cpf
      } = req.body;
      const customerExists = await prisma.customer.findUnique({
        where: { id: Number(id) }
      });
      if (!customerExists) {
        return res.status(404).json({ msg: "Cliente não encontrado" });
      }
      await prisma.customer.update({
        where: { id: Number(id) },
        data: {
          customer_name,
          customer_email,
          customer_phone,
          customer_address,
          customer_cpf
        }
      });
      return res.status(200).json({ msg: "Cliente atualizado com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Erro interno" });
    }
  }
  async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const customerExists = await prisma.customer.findUnique({
        where: { id: Number(id) }
      });
      if (!customerExists) {
        return res.status(404).json({ msg: "Cliente não encontrado" });
      }
      await prisma.customer.delete({
        where: { id: Number(id) }
      });
      return res.status(200).json({ msg: "Cliente deletado com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Erro interno" });
    }
  }
}
const customerRoutes = express.Router();
const customerController = new CustomerController();
customerRoutes.post("/", async (req, res) => {
  await customerController.createCustomer(req, res);
});
customerRoutes.get("/", async (req, res) => {
  await customerController.getCustomers(req, res);
});
customerRoutes.get("/search", async (req, res) => {
  await customerController.getSearchCustomer(req, res);
});
customerRoutes.put("/:id", async (req, res) => {
  await customerController.updateCustomer(req, res);
});
customerRoutes.delete("/:id", async (req, res) => {
  await customerController.deleteCustomer(req, res);
});
class TaxController {
  async createTax(req, res) {
    try {
      const { customer_tax_name, price, service } = req.body;
      if (!customer_tax_name || !price || !service) {
        return res.status(400).send({ msg: "Dados incompletos" });
      }
      const customerExists = await prisma.customer.findUnique({
        where: {
          customer_name: customer_tax_name
        }
      });
      if (!customerExists) {
        return res.status(404).send({ msg: "Cliente não encontrado" });
      }
      const taxInvoice = await prisma.taxInvoice.create({
        data: {
          customer_tax_name: customerExists.customer_name,
          price: parseFloat(price),
          service: service.trim()
        }
      });
      return res.status(201).send({
        msg: "NFS-e cadastrada com sucesso",
        taxInvoice
      });
    } catch (error) {
      console.error("Erro ao criar nota fiscal:", error);
      return res.status(500).send({ msg: "Erro interno" });
    }
  }
  async getAllTaxes(_, res) {
    try {
      const taxes = await prisma.taxInvoice.findMany();
      return res.status(200).send(taxes);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Erro interno" });
    }
  }
  async getSearchCustomerTaxes(req, res) {
    try {
      const customerName = req.query.customer_name ? req.query.customer_name : "";
      if (!customerName) {
        return res.status(400).json({ msg: "O nome do cliente é obrigatório" });
      }
      const invoices = await prisma.taxInvoice.findMany({
        where: {
          customer: {
            customer_name: {
              contains: customerName.toLowerCase()
            }
          }
        },
        orderBy: {
          customer: {
            customer_name: "asc"
          }
        },
        include: {
          customer: true
        }
      });
      if (invoices.length === 0) {
        return res.status(404).json({ msg: "Nenhuma NFS-e encontrada para esse cliente" });
      }
      return res.status(200).json({ invoices });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Erro interno" });
    }
  }
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { tax_status } = req.body;
      const taxInvoice = await prisma.taxInvoice.update({
        where: {
          id: Number(id)
        },
        data: {
          tax_status
        }
      });
      return res.status(200).json({ msg: "Status atualizado com sucesso", taxInvoice });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Erro interno" });
    }
  }
  async updateTax(req, res) {
    try {
      const { id } = req.params;
      const { price, service } = req.body;
      const taxInvoice = await prisma.taxInvoice.update({
        where: {
          id: Number(id)
        },
        data: {
          price: parseFloat(price),
          service: service.trim()
        }
      });
      return res.status(200).json({ msg: "NFS-e atualizada com sucesso", taxInvoice });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Erro interno" });
    }
  }
  async deleteTax(req, res) {
    try {
      const { id } = req.params;
      await prisma.taxInvoice.delete({
        where: { id: Number(id) }
      });
      return res.status(200).json({ msg: "NFS-e deletada com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Erro interno" });
    }
  }
}
const taxRoutes = express.Router();
const taxController = new TaxController();
taxRoutes.post("/", async (req, res) => {
  await taxController.createTax(req, res);
});
taxRoutes.get("/", async (req, res) => {
  await taxController.getAllTaxes(req, res);
});
taxRoutes.get("/search", async (req, res) => {
  await taxController.getSearchCustomerTaxes(req, res);
});
taxRoutes.put("/:id", async (req, res) => {
  await taxController.updateTax(req, res);
});
taxRoutes.put("/status/:id", async (req, res) => {
  await taxController.updateStatus(req, res);
});
taxRoutes.delete("/:id", async (req, res) => {
  await taxController.deleteTax(req, res);
});
const routes = express.Router();
routes.use("/api/customers", customerRoutes);
routes.use("/api/taxes", taxRoutes);
const icon = path.join(__dirname, "../../resources/icon.png");
const appServer = express();
appServer.use(cors({
  origin: utils.is.dev ? "http://localhost:5173" : "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
appServer.use(express.json());
appServer.use(express.urlencoded({ extended: false }));
appServer.use(routes);
appServer.listen(3e3, () => {
  console.log("Express server running on http://localhost:3000");
});
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    fullscreen: true,
    resizable: true,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : { icon },
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  electron.ipcMain.handle("create-new-customer", async (_, customer) => {
    try {
      const response = await fetch("http://localhost:3000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.msg || "Ocorreu um erro ao criar o cliente");
      }
      return { success: true, data };
    } catch (error) {
      console.error("Erro ao criar o cliente:", error);
      return { success: false, msg: "Ocorreu um erro ao criar o cliente" };
    }
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
