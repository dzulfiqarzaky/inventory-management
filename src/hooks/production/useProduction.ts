/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import { ProductionBaseInterface } from "../../pages/Production/production.interface";

export interface ProductionHooksApiInterface {
    options?: object;
    query?: {
        search?: string;
    };
}

export interface ProductionApiWithIdInterface
    extends ProductionHooksApiInterface {
    production_id: string;
}

const fetchProductions = async ({ query = {} }: ProductionHooksApiInterface) =>
    api(`/product/production`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((res) => res.data);

const useProductions = ({
    query = {},
    options = {},
}: ProductionHooksApiInterface) =>
    useQuery(["productions", query], () => fetchProductions({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchProduction = async ({
    production_id,
}: ProductionApiWithIdInterface) =>
    api(`/product/production/${production_id}`).then((data) => data);

const useProduction = ({
    production_id,
    options = {},
}: ProductionApiWithIdInterface) =>
    useQuery(
        ["production", production_id],
        () => fetchProduction({ production_id }),
        {
            ...options,
        }
    );

const useCreateProduction = ({ options = {} }: ProductionHooksApiInterface) => {
    return useMutation(
        (newData: ProductionBaseInterface) =>
            api("/product/production", {
                method: "POST",
                data: newData,
            }),
        { ...options }
    );
};

const useUpdateProduction = ({
    production_id,
    options = {},
}: ProductionApiWithIdInterface) => {
    return useMutation(
        (updates: Partial<ProductionBaseInterface>) =>
            api(`/product/production/${production_id}`, {
                method: "PUT",
                data: updates,
            }),
        { ...options }
    );
};

const useDeleteProduction = ({
    production_id,
    options = {},
}: ProductionApiWithIdInterface) => {
    return useMutation(
        () =>
            api(`/product/production/${production_id}`, {
                method: "Delete",
            }),
        { ...options }
    );
};

export {
    useProductions,
    useProduction,
    useCreateProduction,
    useUpdateProduction,
    useDeleteProduction,
};
