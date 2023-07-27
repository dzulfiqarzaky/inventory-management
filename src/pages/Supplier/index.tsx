/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import InvTableEditComponent from "../../components/InvTableEdit";
import {
    useCreateSupplier,
    useDeleteSupplier,
    useUpdateSupplier,
    useSuppliers,
} from "../../hooks/supplier/useSupplier";
import useHandleEditTable from "../../components/InvTableEdit/useHandleTableEdit";
import { Skeleton } from "antd";
import { queryClient } from "../../main";
import { useState } from "react";
import InvNotif from "../../components/InvNotif";
import { CustomError } from "../Login";
import {
    SupplierApiInterface,
    SupplierDataApiInterface,
    SupplierDataInterface,
    SupplierInterface,
} from "./supplier.interface";
import useSupplierColumn from "./useSupplierColumn";

const SupplierPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const { handleDelete, handleSaveGlobal } = useHandleEditTable();
    const [supplierError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState("");

    const { data, isLoading, isError } = useSuppliers({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: SupplierDataApiInterface) => {
                const mappedData: SupplierInterface[] = data.data.map(
                    (supplier: SupplierApiInterface) => {
                        return {
                            key: supplier._id,
                            name: supplier.name,
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

    const SupplierData: SupplierDataInterface = data;

    const {
        mutate: createSupplier,
        isLoading: isLoadingCreateSupplier,
        isError: isErrorCreateSupplier,
    } = useCreateSupplier({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["suppliers"]);
            },
        },
    });

    const {
        mutate: updateSupplier,
        isLoading: isLoadingUpdateSupplier,
        isError: isErrorUpdateSupplier,
    } = useUpdateSupplier({
        supplier_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["suppliers"]);
            },
        },
    });

    const {
        mutate: deleteSupplier,
        isLoading: isLoadingDeleteSupplier,
        isError: isErrorDeleteSupplier,
    } = useDeleteSupplier({
        supplier_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["suppliers"]);
            },
        },
    });
    const columns = useSupplierColumn({
        createSupplier,
        updateSupplier,
        deleteSupplier,
        handleSaveGlobal,
        handleDelete,
        setTableRowId,
        isLoadingUpdateSupplier,
        isLoadingCreateSupplier,
        isLoadingDeleteSupplier,
    });
    if (
        isError ||
        isErrorCreateSupplier ||
        isErrorDeleteSupplier ||
        isErrorUpdateSupplier
    ) {
        openNotificationWithIcon("error", supplierError);
    }
    return (
        <>
            <h1>Supplier Page</h1>
            {contextNotif}
            <Skeleton
                loading={
                    isLoading ||
                    isLoadingDeleteSupplier ||
                    isLoadingCreateSupplier ||
                    isLoadingUpdateSupplier
                }
            >
                <InvTableEditComponent
                    columns={columns}
                    items={SupplierData?.data}
                    addButtonLabel="+ Add Supplier"
                />
            </Skeleton>
        </>
    );
};

export default SupplierPage;
