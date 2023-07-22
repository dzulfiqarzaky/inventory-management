import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export interface RawMaterialApiInterface {
    rawMaterial_id?: string;
    options?: {};
    query?: {
        search?: string;
    };
}

const fetchRawMaterials = async ({ query = {} }: RawMaterialApiInterface) =>
    api(`/raw-material`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((data) => data.data);

const useRawMaterials = ({
    query = {},
    options = {},
}: RawMaterialApiInterface) =>
    useQuery(["raw-materials", query], () => fetchRawMaterials({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchRawMaterial = async ({ rawMaterial_id }: RawMaterialApiInterface) =>
    api(`/raw-material/${rawMaterial_id}`).then((data) => data);

const useRawMaterial = ({
    rawMaterial_id,
    options = {},
}: RawMaterialApiInterface) =>
    useQuery(
        ["raw-material", rawMaterial_id],
        () => fetchRawMaterial({ rawMaterial_id }),
        {
            ...options,
        }
    );

const useCreateRawMaterial = ({ options = {} }: RawMaterialApiInterface) => {
    return useMutation(
        (newData: DataType) =>
            api("/raw-material", {
                method: "POST",
                data: newData,
            }),
        { ...options }
    );
};

const useUpdateRawMaterial = ({
    rawMaterial_id,
    options = {},
}: RawMaterialApiInterface) => {
    return useMutation(
        (updates: DataType) =>
            api(`/raw-material/${rawMaterial_id}`, {
                method: "PUT",
                data: updates,
            }),
        { ...options }
    );
};

const useDeleteRawMaterial = ({
    rawMaterial_id,
    options = {},
}: RawMaterialApiInterface) => {
    return useMutation(
        () =>
            api(`/raw-material/${rawMaterial_id}`, {
                method: "Delete",
            }),
        { ...options }
    );
};

export {
    useRawMaterials,
    useRawMaterial,
    useCreateRawMaterial,
    useUpdateRawMaterial,
    useDeleteRawMaterial,
};
