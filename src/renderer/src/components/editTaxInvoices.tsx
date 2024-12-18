import { useState, useEffect } from "react";
import { EditTaxModalProps } from "../types/types";
import CurrencyInput from "react-currency-input-field";

export function EditTaxInvoices({
  isOpen,
  onClose,
  onEditTax,
  selectedTax,
}: EditTaxModalProps) {
  const [editValues, setEditValues] = useState({
    price: "",
    service: "",
    issued_date: new Date(),
  });

  useEffect(() => {
    if (selectedTax) {
      setEditValues({
        price: selectedTax.price,
        service: selectedTax.service,
        issued_date: new Date(selectedTax.issued_date as Date) || new Date(),
      });
    }
  }, [selectedTax, isOpen]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = new Date(e.target.value);
    setEditValues({
      ...editValues,
      issued_date: new Date(
        inputDate.getTime() + inputDate.getTimezoneOffset() * 60000,
      ),
    });
  };

  const handleEditTax = async () => {
    if (selectedTax?.id) {
      await window.api.updateTax(
        selectedTax.id,
        editValues as EditTaxModalProps | any,
      );
      onEditTax(editValues as EditTaxModalProps | any);
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 ${
        isOpen ? "visible" : "hidden"
      }`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Editar NFS-e</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Preço:
            </label>
            <CurrencyInput
              id="price"
              name="price"
              value={editValues.price}
              onValueChange={(value) =>
                setEditValues({ ...editValues, price: value || "" })
              }
              decimalsLimit={2}
              decimalScale={2}
              decimalSeparator=","
              groupSeparator="."
              allowNegativeValue={false}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="service"
              className="block text-sm font-medium text-gray-700"
            >
              Serviço:
            </label>
            <input
              type="text"
              id="service"
              name="service"
              value={editValues.service}
              onChange={(e) =>
                setEditValues({ ...editValues, service: e.target.value })
              }
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="issued_date"
              className="block text-sm font-medium text-gray-700"
            >
              Data de Emissão:
            </label>
            <input
              type="date"
              id="issued_date"
              name="issued_date"
              value={
                new Date(
                  editValues.issued_date.getTime() -
                    editValues.issued_date.getTimezoneOffset() * 60000, 
                )
                  .toISOString()
                  .split("T")[0]
              }
              onChange={handleDateChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={handleEditTax}
            >
              Salvar
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
