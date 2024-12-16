export interface NewCustomerProps {
    id?: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    customer_cpf: string;
}

export interface EditCustomerModalProps{
    isOpen: boolean;
    onClose: () => void;
    onEditCustomer: (customer: {
        id: number;
        customer_name: string;
        customer_email: string;
        customer_phone: string;
        customer_address: string;
        customer_cpf: string;
    }) => void;
    
    selectedCustomer: NewCustomerProps | null;
}

export interface TaxInvoiceProps{
    id?: number;
    customerId: number;
    price: string;
    service: string;
    tax_status?: string;
    issued_date?: Date;
}