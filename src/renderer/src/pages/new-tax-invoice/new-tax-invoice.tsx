import { Sidebar } from "../../components/sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { NewCustomerProps, TaxInvoiceProps } from "../../types/types";

export function NewTaxInvoice() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<NewCustomerProps[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<NewCustomerProps | null>(null);

  const [values, setValues] = useState({
    service: "",
    price: "",
  });

  // Função para pesquisar clientes
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Por favor, insira um nome para pesquisar.");
      return;
    }
    try {
      const result = await window.api.getSearchCustomer(searchTerm);
      setCustomers(result);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Erro ao buscar clientes.");
    }
  };

  // Função para criar a nota fiscal
  const handleCreateTax = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne o comportamento padrão
    if (!selectedCustomer) {
      toast.error("Por favor, selecione um cliente.");
      return;
    }
    try {
      const newTax = {
        ...values,
        customerId: selectedCustomer.id,
      };
      await window.api.createTax(newTax as TaxInvoiceProps);
      toast.success("NFS-e criada com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setValues({
        service: "",
        price: "",
      });
    } catch (error) {
      console.error("Erro ao criar nota fiscal:", error);
      toast.error("Erro ao criar a nota fiscal.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col w-full p-6 bg-white shadow-md rounded-md pl-80">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Nova Nota Fiscal
        </h1>

        {/* ====== Busca de clientes ====== */}
        <div className="mb-8">
          <label htmlFor="search" className="block text-lg font-medium mb-2">
            Pesquisar Cliente
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome do cliente"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-cyan-700"
            />
            <button
              onClick={handleSearch}
              className="bg-cyan-900 text-white px-6 py-3 rounded-lg hover:bg-cyan-950 transition"
            >
              Pesquisar
            </button>
          </div>

          {/* Lista de clientes na barra de pesquisa */}
          {customers.length > 0 && (
            <ul className="mt-4 border border-gray-200 rounded-lg divide-y divide-gray-200 bg-white">
              {customers.map((customer) => (
                <li
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`p-4 cursor-pointer hover:bg-blue-50 transition ${
                    selectedCustomer?.id === customer.id ? "bg-blue-100" : ""
                  }`}
                >
                  {customer.customer_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ===== Formulário ====== */}
        <form
          onSubmit={handleCreateTax}
          className="flex flex-col gap-6 bg-gray-50 p-6 rounded-md shadow"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Informações do Cliente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium"
              >
                Nome do Cliente
              </label>
              <input
                type="text"
                id="customerName"
                value={selectedCustomer?.customer_name || ""}
                readOnly
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-200"
              />
            </div>
            <div>
              <label
                htmlFor="customerEmail"
                className="block text-sm font-medium"
              >
                Email do Cliente
              </label>
              <input
                type="email"
                id="customerEmail"
                value={selectedCustomer?.customer_email || ""}
                readOnly
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-200"
              />
            </div>
            <div>
              <label
                htmlFor="customerPhone"
                className="block text-sm font-medium"
              >
                Telefone do Cliente
              </label>
              <input
                type="text"
                id="customerPhone"
                value={selectedCustomer?.customer_phone || ""}
                readOnly
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-200"
              />
            </div>
            <div>
              <label
                htmlFor="customerAddress"
                className="block text-sm font-medium"
              >
                Endereço do Cliente
              </label>
              <input
                type="text"
                id="customerAddress"
                value={selectedCustomer?.customer_address || ""}
                readOnly
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="customerCpf"
                className="block text-sm font-medium"
              >
                CPF/CNPJ
              </label>
              <input
                type="text"
                id="customerCpf"
                value={selectedCustomer?.customer_cpf || ""}
                readOnly
                className="border border-gray-300 rounded-lg p-3 w-full bg-gray-200"
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Informações da NFS-e
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label htmlFor="value" className="block text-sm font-medium">
                Valor
              </label>
              <CurrencyInput
                id="value"
                name="value"
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-blue-200"
                value={values.price}
                onValueChange={(value) =>
                  setValues({ ...values, price: value || "" })
                }
                prefix="R$ "
                decimalScale={2}
                decimalsLimit={2}
                decimalSeparator=","
                groupSeparator="."
                allowNegativeValue={false}
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="service" className="block text-sm font-medium">
                Serviços
              </label>
              <textarea
                name="service"
                id="service"
                placeholder="Descreva os serviços prestados"
                value={values.service}
                onChange={(e) =>
                  setValues({ ...values, service: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-3 resize-none h-24 w-full focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Salvar
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}
