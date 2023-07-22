import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export interface InvoiceApiInterface {
    invoice_id?: string;
    options?: {};
    query?: {
        search?: string;
    };
}

const fetchInvoices = async ({ query = {} }: InvoiceApiInterface) =>
    api(`/invoice`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((data) => data.data);

const useInvoices = ({ query = {}, options = {} }: InvoiceApiInterface) =>
    useQuery(["invoices", query], () => fetchInvoices({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchInvoice = async ({ invoice_id }: InvoiceApiInterface) =>
    api(`/invoice/${invoice_id}`).then((data) => data);

const useInvoice = ({ invoice_id, options = {} }: InvoiceApiInterface) =>
    useQuery(["invoice", invoice_id], () => fetchInvoice({ invoice_id }), {
        ...options,
    });

const useCreateInvoice = ({ options = {} }: InvoiceApiInterface) => {
    return useMutation(
        (newData: DataType) =>
            api("/invoice", {
                method: "POST",
                data: newData,
            }),
        { ...options }
    );
};

const useUpdateInvoice = ({
    invoice_id,
    options = {},
}: InvoiceApiInterface) => {
    return useMutation(
        (updates: DataType) =>
            api(`/invoice/${invoice_id}`, {
                method: "PUT",
                data: updates,
            }),
        { ...options }
    );
};

const useDeleteInvoice = ({
    invoice_id,
    options = {},
}: InvoiceApiInterface) => {
    return useMutation(
        () =>
            api(`/invoice/${invoice_id}`, {
                method: "Delete",
            }),
        { ...options }
    );
};

export {
    useInvoices,
    useInvoice,
    useCreateInvoice,
    useUpdateInvoice,
    useDeleteInvoice,
};
