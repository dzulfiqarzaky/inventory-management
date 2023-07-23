/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AnyObject } from "antd/es/_util/type";
import InvTableEditComponent from "../../components/InvTableEdit";
import {
    ColumnTypes,
    DataType,
} from "../../components/InvTableEdit/InvTableEdit.interface";
import {
    useCreateSupplier,
    useDeleteSupplier,
    useUpdateSupplier,
    useSuppliers,
} from "../../hooks/supplier/useSupplier";
import useHandleEditTable from "../../components/InvTableEdit/useHandleTableEdit";
import { Button, Popconfirm, Skeleton, Space } from "antd";
import { queryClient } from "../../main";
import { useState } from "react";
import InvNotif from "../../components/InvNotif";
import { CustomError } from "../Login";

export interface SupplierInterface {
    key: string;
    name: string;
}
export interface SupplierApiInterface {
    _id: string;
    name: string;
}
export interface SupplierDataInterface {
    data: SupplierApiInterface[];
}
const SupplierPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const { dataSource, handleDelete, handleSave } = useHandleEditTable(
        "supplierEditContext"
    );
    const [supplierError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState("");

    const { data, isLoading, isError } = useSuppliers({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: SupplierDataInterface) => {
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

    const SupplierData: SupplierDataInterface | undefined = data;

    const {
        mutate: createSupplier,
        isLoading: isLoadingCreateSupplier,
        isError: isErrorCreateSupplier,
    } = useCreateSupplier({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: () => {
                void queryClient.invalidateQueries(["suppliers"]);
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
            onSuccess: () => {
                void queryClient.invalidateQueries(["suppliers"]);
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
            onSuccess: () => {
                void queryClient.invalidateQueries(["suppliers"]);
            },
        },
    });

    const columns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[] = [
        {
            title: "name",
            dataIndex: "name",
            // width: "80%",
            editable: true,
        },
        {
            title: "Action",
            dataIndex: "Action",
            width: "20%",
            render: (_, record: AnyObject) =>
                dataSource.supplierEditContext.length >= 1 ? (
                    <>
                        <Space>
                            {record.edited ? (
                                <Popconfirm
                                    key={record.key as string}
                                    title="Save into database?"
                                    onConfirm={() => {
                                        handleSave(record);
                                        if (record.newData) {
                                            createSupplier({
                                                name: record.name as string,
                                            });
                                        } else {
                                            const updatedSupplier: DataType = {
                                                name: record.name as string,
                                            };
                                            updateSupplier(updatedSupplier);
                                        }
                                    }}
                                >
                                    <Button
                                        key={record.key as string}
                                        type="primary"
                                        onClick={() =>
                                            setTableRowId(record.key as string)
                                        }
                                        loading={
                                            isLoadingCreateSupplier ||
                                            isLoadingUpdateSupplier
                                        }
                                    >
                                        <a>Save</a>
                                    </Button>
                                </Popconfirm>
                            ) : (
                                <Button
                                    key={record.key as string}
                                    type="primary"
                                    disabled
                                    loading={
                                        isLoadingCreateSupplier ||
                                        isLoadingUpdateSupplier
                                    }
                                >
                                    <a>Save</a>
                                </Button>
                            )}
                            <Popconfirm
                                key={record.key as string}
                                title="Delete the task"
                                description="Are you sure to delete this task?"
                                cancelText="No"
                                onConfirm={() => {
                                    handleDelete(record.key as string);
                                    if (!record.newData) {
                                        deleteSupplier();
                                    }
                                }}
                            >
                                <Button
                                    key={record.key as string}
                                    type="primary"
                                    danger
                                    onClick={() =>
                                        setTableRowId(record.key as string)
                                    }
                                    loading={isLoadingDeleteSupplier}
                                >
                                    <a>Delete</a>
                                </Button>
                            </Popconfirm>
                        </Space>
                    </>
                ) : null,
        },
    ];
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
                    globalKey="supplierEditContext"
                    columns={columns}
                    items={SupplierData?.data}
                    addButtonLabel="+ Add Supplier"
                />
            </Skeleton>
        </>
    );
};

export default SupplierPage;
