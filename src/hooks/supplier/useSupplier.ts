import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import {
    BaseSuplierInterface,
    SupplierDataApiInterface,
} from "../../pages/Supplier/supplier.interface";

export interface SupplierHooksApiInterface {
    options?: object;
    query?: {
        search?: string;
    };
}

export interface SuplierApiWithIdInterface extends SupplierHooksApiInterface {
    supplier_id: string;
}

const fetchSuppliers = async ({ query = {} }: SupplierHooksApiInterface) =>
    api(`/supplier`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((data: SupplierDataApiInterface) => data.data);

const useSuppliers = ({
    query = {},
    options = {},
}: SupplierHooksApiInterface) =>
    useQuery(["suppliers", query], () => fetchSuppliers({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchSupplier = async ({ supplier_id }: SuplierApiWithIdInterface) =>
    api(`/supplier/${supplier_id}`).then((data) => data);

const useSupplier = ({
    supplier_id,
    options = {},
}: SuplierApiWithIdInterface) =>
    useQuery(["supplier", supplier_id], () => fetchSupplier({ supplier_id }), {
        ...options,
    });

const useCreateSupplier = ({ options = {} }: SupplierHooksApiInterface) => {
    return useMutation(
        (newData: BaseSuplierInterface) =>
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
}: SuplierApiWithIdInterface) => {
    return useMutation(
        (updates: Partial<BaseSuplierInterface>) =>
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
}: SuplierApiWithIdInterface) => {
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
