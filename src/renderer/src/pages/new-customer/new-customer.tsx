import { Sidebar } from "../../components/sidebar";
import { NewCustomerProps } from "@/types/types";
import InputMask from "react-input-mask";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const validationSchema = Yup.object({
  customer_name: Yup.string().required("O nome é obrigatório"),
  customer_email: Yup.string().email("Email inválido") || null,
  customer_phone: Yup.string().required("O telefone é obrigatório"),
  customer_address: Yup.string().required("O endereço é obrigatório"),
  customer_cpf: Yup.string()
    .min(14, "CPF ou CNPJ inválido")
    .required("O CPF ou CNPJ é obrigatório"),
});

export function NewCustomer() {
  const [selectedDocument, setSelectedDocument] = useState<"CPF" | "CNPJ">(
    "CPF",
  ); //Adicionando um estado para armazenar o documento selecionado, por padrao é CPF

  const handleCreateCustomer = async (
    values: NewCustomerProps,
    { resetForm }: { resetForm: () => void },
  ) => {
    try {
      await window.api.createCustomer(values);
      resetForm();
      toast.success("Cliente cadastrado com sucesso", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      toast.error("Erro ao cadastrar o cliente", {
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
      <div className="flex-1 p-8">
        <Formik
          initialValues={{
            customer_name: "",
            customer_email: "",
            customer_phone: "",
            customer_address: "",
            customer_cpf: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleCreateCustomer}
        >
          {({ errors, touched }) => (
            <Form className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-lg">
              <h1 className="text-2xl font-bold text-gray-700 mb-6">
                Novo Cliente
              </h1>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="customer_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nome
                  </label>
                  <Field
                    name="customer_name"
                    type="text"
                    id="customer_name"
                    placeholder="Nome"
                    className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
                  />
                  {errors.customer_name && touched.customer_name && (
                    <span className="text-sm text-red-500">
                      {errors.customer_name}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="customer_email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Field
                    name="customer_email"
                    type="email"
                    id="customer_email"
                    placeholder="Email"
                    className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
                  />
                  {errors.customer_email && touched.customer_email && (
                    <span className="text-sm text-red-500">
                      {errors.customer_email}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="customer_phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Telefone
                  </label>
                  <Field name="customer_phone">
                    {({ field }: FieldProps) => (
                      <InputMask
                        {...field}
                        mask="(99) 99999-9999"
                        id="customer_phone"
                        placeholder="Telefone"
                        className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
                      />
                    )}
                  </Field>
                  {errors.customer_phone && touched.customer_phone && (
                    <span className="text-sm text-red-500">
                      {errors.customer_phone}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="customer_address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Endereço
                  </label>
                  <Field
                    name="customer_address"
                    type="text"
                    id="customer_address"
                    placeholder="Endereço"
                    className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
                  />
                  {errors.customer_address && touched.customer_address && (
                    <span className="text-sm text-red-500">
                      {errors.customer_address}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="documentType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Documento
                  </label>
                  <select
                    id="documentType"
                    name="documentType"
                    value={selectedDocument}
                    onChange={(e) =>
                      setSelectedDocument(e.target.value as "CPF" | "CNPJ")
                    }
                    className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
                  >
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="customer_cpf"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {selectedDocument === "CPF" ? "CPF" : "CNPJ"}
                  </label>
                  <Field name="customer_cpf">
                    {({ field }: FieldProps) => {
                      const mask =
                        selectedDocument === "CPF"
                          ? "999.999.999-99"
                          : "99.999.999/9999-99";
                      return (
                        <InputMask
                          {...field}
                          mask={mask}
                          id="customer_cpf"
                          placeholder={
                            selectedDocument === "CPF" ? "CPF" : "CNPJ"
                          }
                          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
                        />
                      );
                    }}
                  </Field>
                  {errors.customer_cpf && touched.customer_cpf && (
                    <span className="text-sm text-red-500">
                      {errors.customer_cpf}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-6 bg-zinc-800 text-white py-2 px-4 rounded-md hover:bg-black transition-colors duration-300 focus:outline-none focus:ring focus:ring-gray-700"
              >
                Salvar
              </button>
            </Form>
          )}
        </Formik>
        <ToastContainer />
      </div>
    </div>
  );
}
