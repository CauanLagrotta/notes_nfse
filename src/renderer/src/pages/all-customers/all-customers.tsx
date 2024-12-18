import { Sidebar } from "../../components/sidebar";
import { useEffect, useState } from "react";
import { NewCustomerProps } from "@/types/types";
import { EditCustomerModal } from "../../components/editCustomerModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FixedSizeList as List } from "react-window"; // Importando o componente FixedSizeList do react-window para criar uma lista com dimensões fixas

export function AllCustomers() {
  const [customers, setCustomers] = useState<NewCustomerProps[]>([]);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] =
    useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<NewCustomerProps | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para abrir o modal de edição
  const openEditCustomerModal = (customer: NewCustomerProps) => {
    setSelectedCustomer(customer);
    setIsEditCustomerModalOpen(true);
  };

  function getAllCustomers() {
    window.api.getCustomers().then((customers) => {
      setCustomers(customers);
    });
  }

  // Função para pesquisar clientes
  const handleSearch = async (query: string) => {
    setLoading(true);

    try {
      const results = await window.api.getSearchCustomer(query);
      setCustomers(results);
    } catch (error) {
      toast.error("Erro ao buscar clientes", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para fechar o modal de edição
  const closeEditCustomerModal = () => {
    setIsEditCustomerModalOpen(false);
  };


  // Função para editar um cliente
  const handleEditCustomer = (customer: NewCustomerProps) => {
    setSelectedCustomer(customer);
    setIsEditCustomerModalOpen(true);
    getAllCustomers();
  };


  // Função para excluir um cliente
  const handleDeleteCustomer = async (id: number) => {
    await window.api.deleteCustomer(id);
    setCustomers(customers.filter((customer) => customer.id !== id));

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
  };

  useEffect(() => {
    getAllCustomers(); // Carrega os clientes ao montar o componente

    const timeout = setTimeout(() => { // Executa a busca de clientes a cada 500ms
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const renderRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const customer = customers[index];

    return (
      <div style={style} className="flex items-center border-t border-gray-200">
        {/* Renderiza os dados do cliente */}
        <div className="flex-1 py-3 px-4">{customer.customer_name}</div>
        <div className="flex-1 py-3 px-4">{customer.customer_email}</div>
        <div className="flex-1 py-3 px-4">{customer.customer_phone}</div>
        <div className="flex-1 py-3 px-4">{customer.customer_address}</div>
        <div className="flex-1 py-3 px-4">{customer.customer_cpf}</div>
        <div className="flex justify-center py-3 px-4">
          <EditIcon
            onClick={() => openEditCustomerModal(customer)}
            className="text-gray-800 cursor-pointer"
          />
          <DeleteIcon
            onClick={() => handleDeleteCustomer(customer.id as number)}
            className="text-red-500 cursor-pointer ml-2"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 pl-80">
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

        <div className="overflow-hidden bg-white shadow-md rounded-lg">
          {loading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : (
            <List
              height={600}
              itemCount={customers.length}
              itemSize={50}
              width="100%"
            >
              {renderRow}
            </List>
          )}
        </div>
      </div>

      <EditCustomerModal // Modal de edição
        isOpen={isEditCustomerModalOpen}
        onClose={closeEditCustomerModal}
        onEditCustomer={handleEditCustomer}
        selectedCustomer={selectedCustomer}
      />

      <ToastContainer />
    </div>
  );
}