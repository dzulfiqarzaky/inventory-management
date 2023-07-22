import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export interface SupplierApiInterface {
    supplier_id?: string;
    options?: {};
    query?: {
        search?: string;
    };
}

const fetchSuppliers = async ({ query = {} }: SupplierApiInterface) =>
    api(`/supplier`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((data) => data.data);

const useSuppliers = ({ query = {}, options = {} }: SupplierApiInterface) =>
    useQuery(["suppliers", query], () => fetchSuppliers({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchSupplier = async ({ supplier_id }: SupplierApiInterface) =>
    api(`/supplier/${supplier_id}`).then((data) => data);

const useSupplier = ({ supplier_id, options = {} }: SupplierApiInterface) =>
    useQuery(["supplier", supplier_id], () => fetchSupplier({ supplier_id }), {
        ...options,
    });

const useCreateSupplier = ({ options = {} }: SupplierApiInterface) => {
    return useMutation(
        (newData: DataType) =>
            api("/supplier", {
                method: "POST",
                data: newData,
            }),
        { ...options }
    );
};

const useUpdateSupplier = ({
    supplier_id,
    options = {},
}: SupplierApiInterface) => {
    return useMutation(
        (updates: DataType) =>
            api(`/supplier/${supplier_id}`, {
                method: "PUT",
                data: updates,
            }),
        { ...options }
    );
};

const useDeleteSupplier = ({
    supplier_id,
    options = {},
}: SupplierApiInterface) => {
    return useMutation(
        () =>
            api(`/supplier/${supplier_id}`, {
                method: "Delete",
            }),
        { ...options }
    );
};

export {
    useSuppliers,
    useSupplier,
    useCreateSupplier,
    useUpdateSupplier,
    useDeleteSupplier,
};
