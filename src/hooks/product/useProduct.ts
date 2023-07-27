import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import {
    ProductBaseInterface,
    ProductDataApiInterface,
} from "../../pages/Product/product.interface";

export interface ProductHooksApiInterface {
    options?: object;
    query?: {
        search?: string;
    };
}

export interface ProductApiWithIdInterface extends ProductHooksApiInterface {
    product_id: string;
}

const fetchProducts = async ({ query = {} }: ProductHooksApiInterface) =>
    api(`/product`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((res: ProductDataApiInterface) => res.data);

const useProducts = ({ query = {}, options = {} }: ProductHooksApiInterface) =>
    useQuery(["products", query], () => fetchProducts({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchProduct = async ({ product_id }: ProductApiWithIdInterface) =>
    api(`/product/${product_id}`).then((data) => data);

const useProduct = ({ product_id, options = {} }: ProductApiWithIdInterface) =>
    useQuery(["product", product_id], () => fetchProduct({ product_id }), {
        ...options,
    });

const useCreateProduct = ({ options = {} }: ProductHooksApiInterface) => {
    return useMutation(
        (newData: ProductBaseInterface) =>
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
}: ProductApiWithIdInterface) => {
    return useMutation(
        (updates: Partial<ProductBaseInterface>) =>
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
}: ProductApiWithIdInterface) => {
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
