import { useState, useEffect } from "react";
import { EditCustomerModalProps, NewCustomerProps } from "../types/types";
import InputMask from "react-input-mask";

export function EditCustomerModal({
  isOpen,
  onClose,
  onEditCustomer,
  selectedCustomer,
}: EditCustomerModalProps) {
  const [editValues, setEditValues] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    customer_cpf: "",
  });

  const [selectedDocument, setSelectedDocument] = useState<"CPF" | "CNPJ">(
    "CPF",
  );

  useEffect(() => {
    if (selectedCustomer) {
      setEditValues({
        customer_name: selectedCustomer.customer_name,
        customer_email: selectedCustomer.customer_email,
        customer_phone: selectedCustomer.customer_phone,
        customer_address: selectedCustomer.customer_address,
        customer_cpf: selectedCustomer.customer_cpf,
      });
    }
  }, [selectedCustomer, isOpen]);

  const handleEditCustomer = async () => {
    if (selectedCustomer?.id) {
      await window.api.updateCustomer(selectedCustomer.id, editValues);
      onEditCustomer(editValues as NewCustomerProps | any);
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 ${
        isOpen ? "visible" : "hidden"
      }`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Editar Cliente</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={editValues.customer_name}
              onChange={(e) =>
                setEditValues({ ...editValues, customer_name: e.target.value })
              }
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={editValues.customer_email}
              onChange={(e) =>
                setEditValues({ ...editValues, customer_email: e.target.value })
              }
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefone
            </label>
            <InputMask
              mask="(99) 99999-9999"
              value={editValues.customer_phone}
              onChange={(e) =>
                setEditValues({ ...editValues, customer_phone: e.target.value })
              }
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Endereço
            </label>

            <input
              type="text"
              id="address"
              value={editValues.customer_address}
              onChange={(e) =>
                setEditValues({
                  ...editValues,
                  customer_address: e.target.value,
                })
              }
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-gray-700"
            >
              CPF/CNPJ
            </label>

            <select
              id="documentType"
              name="documentType"
              value={selectedDocument}
              onChange={(e) =>
                setSelectedDocument(e.target.value as "CPF" | "CNPJ")
              }
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="CPF">CPF</option>
              <option value="CNPJ">CNPJ</option>
            </select>

            <InputMask
              mask={selectedDocument === "CPF" ? "999.999.999-99" : "99.999.999/9999-99"}
              value={editValues.customer_cpf}
              onChange={(e) =>
                setEditValues({ ...editValues, customer_cpf: e.target.value })
              }
              placeholder={selectedDocument === "CPF" ? "CPF" : "CNPJ"}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={handleEditCustomer}
            >
              Salvar
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
