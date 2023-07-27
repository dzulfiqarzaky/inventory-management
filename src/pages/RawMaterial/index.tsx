/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import InvTableEditComponent from "../../components/InvTableEdit";
import {
    useCreateRawMaterial,
    useDeleteRawMaterial,
    useUpdateRawMaterial,
    useRawMaterials,
} from "../../hooks/rawMaterial/useRawMaterial";
import useHandleEditTable from "../../components/InvTableEdit/useHandleTableEdit";
import { Skeleton } from "antd";
import { queryClient } from "../../main";
import { useState } from "react";
import InvNotif from "../../components/InvNotif";
import { CustomError } from "../Login";
import {
    RawMaterialApiDataInterface,
    RawMaterialApiInterface,
    RawMaterialDataInterface,
    RawMaterialInterface,
} from "./rawMaterial.interface";
import useRawMaterialColumns from "./useRawMaterialColumns";

const RawMaterialPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const { handleDelete, handleSaveGlobal } = useHandleEditTable();
    const [rawMaterialError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState("");

    const { data, isLoading, isError } = useRawMaterials({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: RawMaterialApiDataInterface) => {
                const mappedData: RawMaterialInterface[] = data.data.map(
                    (rawMaterial: RawMaterialApiInterface) => {
                        return {
                            key: rawMaterial._id,
                            name: rawMaterial.name,
                            SKU: rawMaterial.SKU,
                            unit: rawMaterial.unit,
                            qty: rawMaterial.qty,
                        };
                    }
                );
                return { data: mappedData };
            },
        },
        query: {
            search: "asd",
        },
    });

    const RawMaterialData: RawMaterialDataInterface =
        data as unknown as RawMaterialDataInterface;

    const {
        mutate: createRawMaterial,
        isLoading: isLoadingCreateRawMaterial,
        isError: isErrorCreateRawMaterial,
    } = useCreateRawMaterial({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["raw-materials"]);
            },
        },
    });

    const {
        mutate: updateRawMaterial,
        isLoading: isLoadingUpdateRawMaterial,
        isError: isErrorUpdateRawMaterial,
    } = useUpdateRawMaterial({
        rawMaterial_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["raw-materials"]);
            },
        },
    });

    const {
        mutate: deleteRawMaterial,
        isLoading: isLoadingDeleteRawMaterial,
        isError: isErrorDeleteRawMaterial,
    } = useDeleteRawMaterial({
        rawMaterial_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["raw-materials"]);
            },
        },
    });
    const columns = useRawMaterialColumns({
        createRawMaterial,
        updateRawMaterial,
        deleteRawMaterial,
        handleSaveGlobal,
        handleDelete,
        setTableRowId,
        isLoadingUpdateRawMaterial,
        isLoadingCreateRawMaterial,
        isLoadingDeleteRawMaterial,
    });
    if (
        isError ||
        isErrorCreateRawMaterial ||
        isErrorDeleteRawMaterial ||
        isErrorUpdateRawMaterial
    ) {
        openNotificationWithIcon("error", rawMaterialError);
    }
    return (
        <>
            <h1>Raw Material Page</h1>
            {contextNotif}
            <Skeleton
                loading={
                    isLoading ||
                    isLoadingDeleteRawMaterial ||
                    isLoadingCreateRawMaterial ||
                    isLoadingUpdateRawMaterial
                }
            >
                <InvTableEditComponent
                    columns={columns}
                    items={RawMaterialData?.data}
                    addButtonLabel="+ Add Raw Material"
                />
            </Skeleton>
        </>
    );
};

export default RawMaterialPage;
