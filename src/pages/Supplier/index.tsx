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
    _id: string;
    name: string;
    password: string;
    role: string;
}
export interface SupplierDataInterface {
    data: SupplierInterface[];
}
const SupplierPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const { dataSource, handleDelete, handleSave } = useHandleEditTable();
    const [supplierError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState("");

    const { data, isLoading, isError } = useSuppliers({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: SupplierDataInterface) => {
                const mappedData = data.data.map(
                    (supplier: SupplierInterface) => {
                        return {
                            key: supplier._id,
                            name: supplier.name,
                            password: "xxxxxx",
                            role: supplier.role,
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
                queryClient.invalidateQueries(["suppliers"]);
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
                queryClient.invalidateQueries(["suppliers"]);
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
                queryClient.invalidateQueries(["suppliers"]);
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
            width: "30%",
            editable: true,
        },
        {
            title: "password",
            dataIndex: "password",
            editable: true,
        },
        {
            title: "role",
            dataIndex: "role",
            editable: true,
        },
        {
            title: "Action",
            dataIndex: "Action",
            render: (_, record: AnyObject) =>
                dataSource.tableEditContext.length >= 1 ? (
                    <>
                        <Space>
                            {record.edited ? (
                                <Popconfirm
                                    key={record.key}
                                    title="Save into database?"
                                    onConfirm={() => {
                                        handleSave(record);
                                        if (record.newData) {
                                            createSupplier({
                                                name: record.name,
                                                password: record.password,
                                                role: record.role,
                                            });
                                        } else {
                                            const updatedSupplier: DataType = {
                                                name: record.name,
                                                role: record.role,
                                            };
                                            record.password !== "xxxxxx"
                                                ? (updatedSupplier.password =
                                                      record.password)
                                                : null;
                                            updateSupplier(updatedSupplier);
                                        }
                                    }}
                                >
                                    <Button
                                        key={record.key}
                                        type="primary"
                                        onClick={() =>
                                            setTableRowId(record.key)
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
                                    key={record.key}
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
                                key={record.key}
                                title="Delete the task"
                                description="Are you sure to delete this task?"
                                cancelText="No"
                                onConfirm={() => {
                                    handleDelete(record.key);
                                    if (!record.newData) {
                                        deleteSupplier();
                                    }
                                }}
                            >
                                <Button
                                    key={record.key}
                                    type="primary"
                                    danger
                                    onClick={() => setTableRowId(record.key)}
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
                    columns={columns}
                    items={data?.data}
                    addButtonLabel="+ Add Supplier"
                />
            </Skeleton>
        </>
    );
};

export default SupplierPage;
