import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export interface ProductionApiInterface {
    production_id?: string;
    options?: {};
    query?: {
        search?: string;
    };
}

const fetchProductions = async ({ query = {} }: ProductionApiInterface) =>
    api(`/production`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((data) => data.data);

const useProductions = ({ query = {}, options = {} }: ProductionApiInterface) =>
    useQuery(["productions", query], () => fetchProductions({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchProduction = async ({ production_id }: ProductionApiInterface) =>
    api(`/production/${production_id}`).then((data) => data);

const useProduction = ({
    production_id,
    options = {},
}: ProductionApiInterface) =>
    useQuery(
        ["production", production_id],
        () => fetchProduction({ production_id }),
        {
            ...options,
        }
    );

const useCreateProduction = ({ options = {} }: ProductionApiInterface) => {
    return useMutation(
        (newData: DataType) =>
            api("/production", {
                method: "POST",
                data: newData,
            }),
        { ...options }
    );
};

const useUpdateProduction = ({
    production_id,
    options = {},
}: ProductionApiInterface) => {
    return useMutation(
        (updates: DataType) =>
            api(`/production/${production_id}`, {
                method: "PUT",
                data: updates,
            }),
        { ...options }
    );
};

const useDeleteProduction = ({
    production_id,
    options = {},
}: ProductionApiInterface) => {
    return useMutation(
        () =>
            api(`/production/${production_id}`, {
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
