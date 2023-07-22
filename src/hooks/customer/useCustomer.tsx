import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export interface CustomerApiInterface {
    customer_id?: string;
    options?: {};
    query?: {
        search?: string;
    };
}

const fetchCustomers = async ({ query = {} }: CustomerApiInterface) =>
    api(`/customer`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((data) => data.data);

const useCustomers = ({ query = {}, options = {} }: CustomerApiInterface) =>
    useQuery(["customers", query], () => fetchCustomers({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchCustomer = async ({ customer_id }: CustomerApiInterface) =>
    api(`/customer/${customer_id}`).then((data) => data);

const useCustomer = ({ customer_id, options = {} }: CustomerApiInterface) =>
    useQuery(["customer", customer_id], () => fetchCustomer({ customer_id }), {
        ...options,
    });

const useCreateCustomer = ({ options = {} }: CustomerApiInterface) => {
    return useMutation(
        (newData: DataType) =>
            api("/customer", {
                method: "POST",
                data: newData,
            }),
        { ...options }
    );
};

const useUpdateCustomer = ({
    customer_id,
    options = {},
}: CustomerApiInterface) => {
    return useMutation(
        (updates: DataType) =>
            api(`/customer/${customer_id}`, {
                method: "PUT",
                data: updates,
            }),
        { ...options }
    );
};

const useDeleteCustomer = ({
    customer_id,
    options = {},
}: CustomerApiInterface) => {
    return useMutation(
        () =>
            api(`/customer/${customer_id}`, {
                method: "Delete",
            }),
        { ...options }
    );
};

export {
    useCustomers,
    useCustomer,
    useCreateCustomer,
    useUpdateCustomer,
    useDeleteCustomer,
};
