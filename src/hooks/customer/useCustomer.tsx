import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import BaseCustomerInterface, {
    CustomerDataApiInterface,
} from "../../pages/Customer/customer.interface";

export interface CustomerHooksApiInterface {
    options?: object;
    query?: {
        search?: string;
    };
}

export interface CustomerApiWithIdInterface extends CustomerHooksApiInterface {
    customer_id: string;
}

const fetchCustomers = async ({ query = {} }: CustomerHooksApiInterface) =>
    api(`/customer`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((data: CustomerDataApiInterface) => data.data);

const useCustomers = ({
    query = {},
    options = {},
}: CustomerHooksApiInterface) =>
    useQuery(["customers", query], () => fetchCustomers({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchCustomer = async ({ customer_id }: CustomerApiWithIdInterface) =>
    api(`/customer/${customer_id}`).then((data) => data);

const useCustomer = ({
    customer_id,
    options = {},
}: CustomerApiWithIdInterface) =>
    useQuery(["customer", customer_id], () => fetchCustomer({ customer_id }), {
        ...options,
    });

const useCreateCustomer = ({ options = {} }: CustomerHooksApiInterface) => {
    return useMutation(
        (newData: BaseCustomerInterface) =>
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
}: CustomerApiWithIdInterface) => {
    return useMutation(
        (updates: Partial<BaseCustomerInterface>) =>
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
}: CustomerApiWithIdInterface) => {
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
