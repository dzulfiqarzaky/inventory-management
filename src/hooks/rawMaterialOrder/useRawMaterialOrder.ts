import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export interface RawMaterialOrderApiInterface {
    rawMaterialOrder_id?: string;
    options?: {};
    query?: {
        search?: string;
    };
}

const fetchRawMaterialOrders = async ({
    query = {},
}: RawMaterialOrderApiInterface) =>
    api(`/rawMaterialOrder`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((data) => data.data);

const useRawMaterialOrders = ({
    query = {},
    options = {},
}: RawMaterialOrderApiInterface) =>
    useQuery(
        ["rawMaterialOrders", query],
        () => fetchRawMaterialOrders({ query }),
        {
            keepPreviousData: true,
            ...options,
        }
    );

const fetchRawMaterialOrder = async ({
    rawMaterialOrder_id,
}: RawMaterialOrderApiInterface) =>
    api(`/rawMaterialOrder/${rawMaterialOrder_id}`).then((data) => data);

const useRawMaterialOrder = ({
    rawMaterialOrder_id,
    options = {},
}: RawMaterialOrderApiInterface) =>
    useQuery(
        ["rawMaterialOrder", rawMaterialOrder_id],
        () => fetchRawMaterialOrder({ rawMaterialOrder_id }),
        {
            ...options,
        }
    );

const useCreateRawMaterialOrder = ({
    options = {},
}: RawMaterialOrderApiInterface) => {
    return useMutation(
        (newData: DataType) =>
            api("/rawMaterialOrder", {
                method: "POST",
                data: newData,
            }),
        { ...options }
    );
};

const useUpdateRawMaterialOrder = ({
    rawMaterialOrder_id,
    options = {},
}: RawMaterialOrderApiInterface) => {
    return useMutation(
        (updates: DataType) =>
            api(`/rawMaterialOrder/${rawMaterialOrder_id}`, {
                method: "PUT",
                data: updates,
            }),
        { ...options }
    );
};

const useDeleteRawMaterialOrder = ({
    rawMaterialOrder_id,
    options = {},
}: RawMaterialOrderApiInterface) => {
    return useMutation(
        () =>
            api(`/rawMaterialOrder/${rawMaterialOrder_id}`, {
                method: "Delete",
            }),
        { ...options }
    );
};

export {
    useRawMaterialOrders,
    useRawMaterialOrder,
    useCreateRawMaterialOrder,
    useUpdateRawMaterialOrder,
    useDeleteRawMaterialOrder,
};
