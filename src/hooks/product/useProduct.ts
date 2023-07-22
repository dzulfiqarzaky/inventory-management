import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export interface ProductApiInterface {
    product_id?: string;
    options?: {};
    query?: {
        search?: string;
    };
}

const fetchProducts = async ({ query = {} }: ProductApiInterface) =>
    api(`/product`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((data) => data.data);

const useProducts = ({ query = {}, options = {} }: ProductApiInterface) =>
    useQuery(["products", query], () => fetchProducts({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchProduct = async ({ product_id }: ProductApiInterface) =>
    api(`/product/${product_id}`).then((data) => data);

const useProduct = ({ product_id, options = {} }: ProductApiInterface) =>
    useQuery(["product", product_id], () => fetchProduct({ product_id }), {
        ...options,
    });

const useCreateProduct = ({ options = {} }: ProductApiInterface) => {
    return useMutation(
        (newData: DataType) =>
            api("/product", {
                method: "POST",
                data: newData,
            }),
        { ...options }
    );
};

const useUpdateProduct = ({
    product_id,
    options = {},
}: ProductApiInterface) => {
    return useMutation(
        (updates: DataType) =>
            api(`/product/${product_id}`, {
                method: "PUT",
                data: updates,
            }),
        { ...options }
    );
};

const useDeleteProduct = ({
    product_id,
    options = {},
}: ProductApiInterface) => {
    return useMutation(
        () =>
            api(`/product/${product_id}`, {
                method: "Delete",
            }),
        { ...options }
    );
};

export {
    useProducts,
    useProduct,
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
};
