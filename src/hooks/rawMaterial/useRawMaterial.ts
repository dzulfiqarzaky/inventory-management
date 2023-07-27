import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import {
    RawMaterialApiDataInterface,
    RawMaterialBaseInterface,
} from "../../pages/RawMaterial/rawMaterial.interface";

export interface RawMaterialHooksApiInterface {
    options?: object;
    query?: {
        search?: string;
    };
}

export interface RawMaterialWithIdInterface
    extends RawMaterialHooksApiInterface {
    rawMaterial_id: string;
}
const fetchRawMaterials = async ({
    query = {},
}: RawMaterialHooksApiInterface) =>
    api(`/raw-material`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((res: RawMaterialApiDataInterface) => res.data);

const useRawMaterials = ({
    query = {},
    options = {},
}: RawMaterialHooksApiInterface) =>
    useQuery(["raw-materials", query], () => fetchRawMaterials({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchRawMaterial = async ({
    rawMaterial_id,
}: RawMaterialWithIdInterface) =>
    api(`/raw-material/${rawMaterial_id}`).then((data) => data);

const useRawMaterial = ({
    rawMaterial_id,
    options = {},
}: RawMaterialWithIdInterface) =>
    useQuery(
        ["raw-material", rawMaterial_id],
        () => fetchRawMaterial({ rawMaterial_id }),
        {
            ...options,
        }
    );

const useCreateRawMaterial = ({
    options = {},
}: RawMaterialHooksApiInterface) => {
    return useMutation(
        (newData: RawMaterialBaseInterface) =>
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
}: RawMaterialWithIdInterface) => {
    return useMutation(
        (updates: Partial<RawMaterialBaseInterface>) =>
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
}: RawMaterialWithIdInterface) => {
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
