export interface CustomerProps {
  id?: number;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  customer_address: string;
  customer_cpf: string;
}

export interface TaxInvoiceProps {
  id?: number;
  customerId: number;
  price: string;
  service: string;
  tax_status?: string;
  issued_date?: Date;
}

export interface CustomerInvoiceProps extends TaxInvoiceProps {
  customer_name: string;
}