import { Sidebar } from "@renderer/components/sidebar";
import InputMask from "react-input-mask";
import { Formik, Form, Field, FieldProps, FormikValues } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object({
  customer_name: Yup.string().required("O nome é obrigatório"),
  customer_email: Yup.string()
    .email("Email inválido")
    .required("O email é obrigatório"),
  customer_phone: Yup.string().required("O telefone é obrigatório"),
  customer_address: Yup.string().required("O endereço é obrigatório"),
  customer_cpf: Yup.string()
    .min(14, "CPF inválido")
    .required("O CPF é obrigatório"),
});

const MaskedInput = ({ field, mask, ...props }: FieldProps & { mask: string }) => (
  <InputMask mask={mask} {...field} {...props} />
);

export function NewCustomer() {
  const handleCreateCustomer = async (values: FormikValues) => {
    try {
      const response = await (window.api as any).sendCustomer({
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_phone: values.customer_phone,
        customer_address: values.customer_address,
        customer_cpf: values.customer_cpf,
      });

      if (response.success) {
        toast.success("Novo cliente criado com sucesso", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        throw new Error(response.error || "Erro desconhecido");
      }
    } catch (error: any) {
      toast.error(`Erro ao criar cliente: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
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
    <div className="flex">
      <Sidebar />
      <Formik
        initialValues={{
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          customer_address: "",
          customer_cpf: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          handleCreateCustomer(values);
          actions.resetForm();
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <h1>Novo Cliente</h1>
            <div className="flex flex-col">
              <label htmlFor="customer_name">Nome</label>
              <Field
                name="customer_name"
                type="text"
                id="customer_name"
                placeholder="Nome"
              />
              {errors.customer_name && touched.customer_name && (
                <span>{errors.customer_name}</span>
              )}

              <label htmlFor="customer_email">Email</label>
              <Field
                name="customer_email"
                type="email"
                id="customer_email"
                placeholder="Email"
              />
              {errors.customer_email && touched.customer_email && (
                <span>{errors.customer_email}</span>
              )}

              <label htmlFor="customer_phone">Telefone</label>
              <Field
                name="customer_phone"
                id="customer_phone"
                placeholder="Telefone"
                mask="(99) 99999-9999"
                component={MaskedInput}
              />
              {errors.customer_phone && touched.customer_phone && (
                <span>{errors.customer_phone}</span>
              )}

              <label htmlFor="customer_address">Endereço</label>
              <Field
                name="customer_address"
                type="text"
                id="customer_address"
                placeholder="Endereço"
              />
              {errors.customer_address && touched.customer_address && (
                <span>{errors.customer_address}</span>
              )}

              <label htmlFor="customer_cpf">CPF</label>
              <Field
                name="customer_cpf"
                id="customer_cpf"
                placeholder="CPF"
                mask="999.999.999-99"
                component={MaskedInput}
              />
              {errors.customer_cpf && touched.customer_cpf && (
                <span>{errors.customer_cpf}</span>
              )}
            </div>
            <button type="submit">Salvar</button>
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </div>
  );
}
