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

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const openEditCustomerModal = (customer: NewCustomerProps) => {
    setSelectedCustomer(customer);
    setIsEditCustomerModalOpen(true);
  };

  function getAllCustomers() {
    window.api.getCustomers().then((customers) => {
      setCustomers(customers);
    });
  }

  const handleSearch = async (query: string) =>{
    setLoading(true);

    try{
      const results = await window.api.getSearchCustomer(query);
      setCustomers(results);

    }catch(error){
      toast.error("Erro ao buscar clientes", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })

    }finally{
      setLoading(false);
    }
  }

  const closeEditCustomerModal = () => {
    setIsEditCustomerModalOpen(false);
  };

  const handleEditCustomer = (customer: NewCustomerProps) => {
    setSelectedCustomer(customer);
    setIsEditCustomerModalOpen(true);
    getAllCustomers();
  };

  const handleDeleteCustomer = async (id: number) => {
    await window.api.deleteCustomer(id);
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  useEffect(() => {
    getAllCustomers();

    const timeout = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Todos os clientes
        </h1>

        <input
          type="text" 
          placeholder="Buscar cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-md mb-4"
        />

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-3 px-4 text-left">Nome</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Telefone</th>
                <th className="py-3 px-4 text-left">Endereço</th>
                <th className="py-3 px-4 text-left">CPF/CNPJ</th>
                <th className="py-3 px-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
  {loading ? (
    <tr>
      <td colSpan={6} className="text-center py-4">
        Carregando...
      </td>
    </tr>
  ) : (
    customers.map((customer) => (
      <tr
        key={customer.id}
        className="border-t border-gray-200 hover:bg-gray-50 transition-all"
      >
        <td className="py-3 px-4">{customer.customer_name}</td>
        <td className="py-3 px-4">{customer.customer_email}</td>
        <td className="py-3 px-4">{customer.customer_phone}</td>
        <td className="py-3 px-4">{customer.customer_address}</td>
        <td className="py-3 px-4">{customer.customer_cpf}</td>
        <td className="py-3 px-4">
          <div className="flex gap-2 justify-center">
            <EditIcon
              onClick={() => openEditCustomerModal(customer)}
              className="text-gray-800 cursor-pointer"
            />
            <DeleteIcon
              onClick={() =>
                handleDeleteCustomer(customer.id as number)
              }
              className="text-red-500 cursor-pointer"
            />
          </div>
        </td>
      </tr>
    ))
  )}
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
