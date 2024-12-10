import { Route, Routes } from "react-router-dom";
import { AllCustomers } from "../pages/all-customers/all-customers";
import { TaxInvoicesDone } from "../pages/tax-invoices-done/tax-invoices-done";
import { NewCustomer } from "../pages/new-customer/new-customer";
import { NewTaxInvoice } from "../pages/new-tax-invoice/new-tax-invoice";
import { TaxInvoicesToDo } from "../pages/tax-invoices-to-do/tax-invoices-to-do";

export function Router(){
    return(
        <Routes>
            <Route path="/" element={<TaxInvoicesDone />} />
            <Route path="/all-customers" element={<AllCustomers />} />
            <Route path="/new-customer" element={<NewCustomer />} />
            <Route path="/new-tax-invoice" element={<NewTaxInvoice />} />
            <Route path="/tax-invoices-to-do" element={<TaxInvoicesToDo />} />
        </Routes>
    )
}