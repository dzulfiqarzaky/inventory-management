import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export interface RawMaterialUseApiInterface {
    rawMaterialUse_id?: string;
    options?: {};
    query?: {
        search?: string;
    };
}

const fetchRawMaterialUses = async ({
    query = {},
}: RawMaterialUseApiInterface) =>
    api(`/rawMaterialUse`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((data) => data.data);

const useRawMaterialUses = ({
    query = {},
    options = {},
}: RawMaterialUseApiInterface) =>
    useQuery(
        ["rawMaterialUses", query],
        () => fetchRawMaterialUses({ query }),
        {
            keepPreviousData: true,
            ...options,
        }
    );

const fetchRawMaterialUse = async ({
    rawMaterialUse_id,
}: RawMaterialUseApiInterface) =>
    api(`/rawMaterialUse/${rawMaterialUse_id}`).then((data) => data);

const useRawMaterialUse = ({
    rawMaterialUse_id,
    options = {},
}: RawMaterialUseApiInterface) =>
    useQuery(
        ["rawMaterialUse", rawMaterialUse_id],
        () => fetchRawMaterialUse({ rawMaterialUse_id }),
        {
            ...options,
        }
    );

const useCreateRawMaterialUse = ({
    options = {},
}: RawMaterialUseApiInterface) => {
    return useMutation(
        (newData: DataType) =>
            api("/rawMaterialUse", {
                method: "POST",
                data: newData,
            }),
        { ...options }
    );
};

const useUpdateRawMaterialUse = ({
    rawMaterialUse_id,
    options = {},
}: RawMaterialUseApiInterface) => {
    return useMutation(
        (updates: DataType) =>
            api(`/rawMaterialUse/${rawMaterialUse_id}`, {
                method: "PUT",
                data: updates,
            }),
        { ...options }
    );
};

const useDeleteRawMaterialUse = ({
    rawMaterialUse_id,
    options = {},
}: RawMaterialUseApiInterface) => {
    return useMutation(
        () =>
            api(`/rawMaterialUse/${rawMaterialUse_id}`, {
                method: "Delete",
            }),
        { ...options }
    );
};

export {
    useRawMaterialUses,
    useRawMaterialUse,
    useCreateRawMaterialUse,
    useUpdateRawMaterialUse,
    useDeleteRawMaterialUse,
};
