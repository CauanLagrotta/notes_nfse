import { Sidebar } from "../../components/sidebar";
import { useState, useEffect } from "react";
import { CustomerInvoiceProps } from "../../types/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EditTaxInvoices } from "../../components/editTaxInvoices";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export function TaxInvoicesToDo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<CustomerInvoiceProps[]>([]);
  const [isEditTaxModalOpen, setIsEditTaxModalOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<CustomerInvoiceProps | null>(null);

  // Função para abrir o modal de edição de NFS-e
  const openEditTaxModal = (invoice: CustomerInvoiceProps) => {
    setSelectedInvoice(invoice);
    setIsEditTaxModalOpen(true);
  };

  const handleEditTax = async (invoices: CustomerInvoiceProps) => {
    setSelectedInvoice(invoices);
    setIsEditTaxModalOpen(true);
    getAllToDoTaxes();
  };

  const handleDeleteTax = async (id: number) => {
    try {
      if (!window.confirm("Tem certeza que deseja excluir a NFS-e?")) {
        return;
      }
      await window.api.deleteTax(id);
      toast.success("NFS-e excluída com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      getAllToDoTaxes();
    } catch (error) {
      console.error("Erro ao excluir NFS-e:", error);
      toast.error("Erro ao excluir NFS-e.", {
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

  const getAllToDoTaxes = async () => {
    try {
      const result = await window.api.getAllToDoTaxes();
      console.log("result: ", result);

      const combinedData: CustomerInvoiceProps[] = result.map(
        (item: CustomerInvoiceProps) => ({
          id: item.id,
          customer_name: item.customer_name,
          price: item.price,
          service: item.service,
          tax_status: item.tax_status && "Pendente",
          issued_date: item.issued_date
            ? new Date(item.issued_date)
            : new Date(),
        }),
      );
      console.log("combinedData: ", combinedData);

      setInvoices(combinedData);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Erro ao buscar clientes.", {
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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      getAllToDoTaxes();
      return;
    }
    try {
      const result = await window.api.getSearchCustomerTaxes(searchTerm);
      const filteredResult = result.filter(
        (item: CustomerInvoiceProps) => item.tax_status === "Pendente",
      );

      setInvoices(filteredResult);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Erro ao buscar clientes.", {
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

  const progress_status = async (id: number, tax_status: string) => {
    const next_status = tax_status === "Pendente" ? "Concluído" : "Concluído";

    try {
      await window.api.updateStatus(id, next_status);
      getAllToDoTaxes();
    } catch (error) {
      throw new Error("Erro ao atualizar o status");
    }
  };

  useEffect(() => {
    getAllToDoTaxes();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      getAllToDoTaxes();
    }
  }, [searchTerm]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col w-full p-8 pl-80">
        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          NFS-e Não Emitidas
        </h1>

        {/* Campo de busca */}
        <div className="bg-white p-6 shadow rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Pesquisar NFS-e
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome do cliente ou serviço"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-cyan-700"
            />
            <button
              onClick={handleSearch}
              className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md"
            >
              Pesquisar
            </button>
          </div>
        </div>

        {/* Lista de NFS-e */}
        {invoices.length > 0 ? (
          <div className="grid grid-cols-2 gap-6">
            {invoices.map((taxInvoice) => (
              <div
                key={taxInvoice.id}
                className="bg-white p-6 shadow-md rounded-lg flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {taxInvoice.id}
                  </h3>

                  <p className="text-gray-600">
                    <span className="font-medium">Cliente:</span>{" "}
                    {taxInvoice.customer_name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Serviço:</span>{" "}
                    {taxInvoice.service}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Valor:</span> R$
                    {taxInvoice.price}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Emitido em: </span>
                    {taxInvoice.issued_date?.toLocaleDateString()}
                  </p>
                  <p
                    className={`font-medium mt-2 ${
                      taxInvoice.tax_status === "Concluído"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    Status: {taxInvoice.tax_status}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => openEditTaxModal(taxInvoice)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <EditIcon />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteTax(taxInvoice.id as number)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <DeleteIcon />
                    Excluir
                  </button>
                  <button
                    onClick={() =>
                      progress_status(
                        taxInvoice.id as number,
                        taxInvoice.tax_status as string,
                      )
                    }
                    className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg shadow-md"
                  >
                    Avançar Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-12">
            Nenhuma NFS-e encontrada.
          </p>
        )}
      </div>

      <EditTaxInvoices
        isOpen={isEditTaxModalOpen}
        onClose={() => setIsEditTaxModalOpen(false)}
        onEditTax={handleEditTax as CustomerInvoiceProps | any}
        selectedTax={selectedInvoice}
      />

      <ToastContainer />
    </div>
  );
}
