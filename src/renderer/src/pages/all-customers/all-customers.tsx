import { Sidebar } from "../../components/sidebar";
import { useEffect, useState } from "react";
import { NewCustomerProps } from "@/types/types";
import { EditCustomerModal } from "../../components/editCustomerModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function AllCustomers() {
  const [customers, setCustomers] = useState<NewCustomerProps[]>([]);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] =
    useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<NewCustomerProps | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const openEditCustomerModal = (customer: NewCustomerProps) => {
    setSelectedCustomer(customer);
    setIsEditCustomerModalOpen(true);
  };

  const getAllCustomers = () => {
    window.api.getCustomers().then((customers) => {
      setCustomers(customers);
    });
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      getAllCustomers();
      return;
    }
    try {
      const result = await window.api.getSearchCustomer(searchTerm);
      setCustomers(result);
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

  const closeEditCustomerModal = () => {
    setIsEditCustomerModalOpen(false);
  };

  const handleEditCustomer = (customer: NewCustomerProps) => {
    setSelectedCustomer(customer);
    setIsEditCustomerModalOpen(true);
    getAllCustomers();
  };

  const handleDeleteCustomer = async (id: number) => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir o cliente? Todas as NFS-e vinculadas ao cliente serão excluídas.",
      )
    ) {
      return;
    }

    await window.api.deleteCustomer(id);

    toast.success("Cliente excluído com sucesso!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    getAllCustomers();
  };

  useEffect(() => {
    getAllCustomers();
  }, [searchTerm]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 pl-80">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Clientes</h1>

        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-700"
          />
          <button
            onClick={handleSearch}
            className="bg-cyan-900 hover:bg-cyan-950 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all"
          >
            Pesquisar
          </button>
        </div>

        <div className="overflow-hidden rounded-lg shadow-lg">
          <table className="w-full text-left bg-white rounded-lg shadow-md">
            <thead className="bg-cyan-950 text-white text-sm uppercase">
              <tr>
                <th className="p-4">Nome</th>
                <th className="p-4">Telefone</th>
                <th className="p-4">E-mail</th>
                <th className="p-4">CPF/CNPJ</th>
                <th className="p-4">Endereço</th>
                <th className="p-4 ">Ações</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-100 transition-all"
                >
                  <td className="p-4 border-t border-gray-200">
                    {customer.customer_name}
                  </td>
                  <td className="p-4 border-t border-gray-200">
                    {customer.customer_phone}
                  </td>
                  <td className="p-4 border-t border-gray-200">
                    {customer.customer_email}
                  </td>
                  <td className="p-4 border-t border-gray-200">
                    {customer.customer_cpf}
                  </td>
                  <td className="p-4 border-t border-gray-200">
                    {customer.customer_address}
                  </td>
                  <td className="p-4 border-t border-gray-200 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => openEditCustomerModal(customer)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteCustomer(customer.id as number)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditCustomerModal
        isOpen={isEditCustomerModalOpen}
        onClose={closeEditCustomerModal}
        onEditCustomer={handleEditCustomer}
        selectedCustomer={selectedCustomer}
      />

      <ToastContainer />
    </div>
  );
}
