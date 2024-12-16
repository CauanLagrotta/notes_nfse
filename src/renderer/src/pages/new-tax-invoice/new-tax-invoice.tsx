import { Sidebar } from "../../components/sidebar";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { NewCustomerProps, TaxInvoiceProps } from "../../types/types";

const validationSchema = Yup.object({
  price: Yup.string().required("O valor é obrigatório"),

  service: Yup.string().required("O serviço é obrigatório"),
});

export function NewTaxInvoice() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<NewCustomerProps[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<NewCustomerProps | null>(null);

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
  const handleCreateTax = async (
    values: Omit<TaxInvoiceProps, "customerId">,
    { resetForm }: { resetForm: () => void },
  ) => {
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
      toast.success("Nota fiscal criada com sucesso!");
      resetForm();
    } catch (error) {
      console.error("Erro ao criar nota fiscal:", error);
      toast.error("Erro ao criar a nota fiscal.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col w-full p-4">
        <h1 className="text-2xl font-bold mb-4">Nova Nota Fiscal</h1>

        {/* ====== Busca de clientes ====== */}
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium">
            Pesquisar Cliente
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome do cliente"
              className="border border-gray-300 rounded p-2 w-full"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Pesquisar
            </button>
          </div>

          {/* ====== Lista de clientes encontrados  =======*/}
          {customers.length > 0 && (
            <ul className="mt-2 border rounded">
              {customers.map((customer) => (
                <li
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`p-2 cursor-pointer hover:bg-gray-200 ${
                    selectedCustomer?.id === customer.id ? "bg-gray-300" : ""
                  }`}
                >
                  {customer.customer_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ===== Formulário ====== */}
        <Formik
          initialValues={{ price: "", service: "" }}
          validationSchema={validationSchema}
          onSubmit={handleCreateTax}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium">
                  Valor
                </label>
                <Field name="price">
                  {({ field }: FieldProps) => (
                    <CurrencyInput
                      {...field}
                      id="price"
                      placeholder="Digite o valor"
                      className={`border p-2 rounded w-full ${
                        errors.price && touched.price ? "border-red-500" : ""
                      }`}
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      decimalsLimit={2}
                      decimalScale={2}
                      decimalSeparator=","
                      groupSeparator="."
                      allowNegativeValue={false}
                    />
                  )}
                </Field>
                {errors.price && touched.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="service" className="block text-sm font-medium">
                  Serviço
                </label>
                <Field
                  name="service"
                  id="service"
                  placeholder="Descreva o serviço"
                  className={`border p-2 rounded w-full ${
                    errors.service && touched.service ? "border-red-500" : ""
                  }`}
                />
                {errors.service && touched.service && (
                  <p className="text-red-500 text-sm">{errors.service}</p>
                )}
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Criar Nota Fiscal
              </button>
            </Form>
          )}
        </Formik>

        <ToastContainer />
      </div>
    </div>
  );
}
