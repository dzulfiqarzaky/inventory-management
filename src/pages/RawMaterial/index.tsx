/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AnyObject } from "antd/es/_util/type";
import InvTableEditComponent from "../../components/InvTableEdit";
import {
    ColumnTypes,
    DataType,
} from "../../components/InvTableEdit/InvTableEdit.interface";
import {
    useCreateRawMaterial,
    useDeleteRawMaterial,
    useUpdateRawMaterial,
    useRawMaterials,
} from "../../hooks/rawMaterial/useRawMaterial";
import useHandleEditTable from "../../components/InvTableEdit/useHandleTableEdit";
import { Button, Popconfirm, Skeleton, Space } from "antd";
import { queryClient } from "../../main";
import { useState } from "react";
import InvNotif from "../../components/InvNotif";
import { CustomError } from "../Login";

export interface RawMaterialInterface {
    key: string;
    name: string;
    SKU: string;
    unit: string;
    qty: string;
}
export interface RawMaterialApiInterface {
    _id: string;
    name: string;
    SKU: string;
    unit: string;
    qty: string;
}
export interface RawMaterialDataInterface {
    data: RawMaterialApiInterface[];
}

const RawMaterialPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const { dataSource, handleDelete, handleSave } = useHandleEditTable(
        "rawMaterialEditContext"
    );
    const [rawMaterialError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState("");

    const { data, isLoading, isError } = useRawMaterials({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: RawMaterialDataInterface) => {
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

    const RawMaterialData: RawMaterialDataInterface | undefined = data;

    const {
        mutate: createRawMaterial,
        isLoading: isLoadingCreateRawMaterial,
        isError: isErrorCreateRawMaterial,
    } = useCreateRawMaterial({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: () => {
                void queryClient.invalidateQueries(["raw-materials"]);
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
            onSuccess: () => {
                void queryClient.invalidateQueries(["raw-materials"]);
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
            onSuccess: () => {
                void queryClient.invalidateQueries(["raw-materials"]);
            },
        },
    });

    const columns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[] = [
        {
            title: "SKU",
            dataIndex: "SKU",
            editable: true,
        },
        {
            title: "name",
            dataIndex: "name",
            width: "30%",
            editable: true,
        },
        {
            title: "unit",
            dataIndex: "unit",
            editable: true,
        },
        {
            title: "qty",
            dataIndex: "qty",
            editable: true,
        },
        {
            title: "Action",
            dataIndex: "Action",
            width: "20%",
            render: (_, record: AnyObject) =>
                dataSource.rawMaterialEditContext.length >= 1 ? (
                    <>
                        <Space>
                            {record.edited ? (
                                <Popconfirm
                                    key={record.key}
                                    title="Save into database?"
                                    onConfirm={() => {
                                        handleSave(record);
                                        if (record.newData) {
                                            createRawMaterial({
                                                name: record.name,
                                                SKU: record.SKU,
                                                qty: record.qty,
                                                unit: record.unit,
                                            });
                                        } else {
                                            const updatedRawMaterial: DataType =
                                                {
                                                    name: record.name,
                                                    SKU: record.SKU,
                                                    qty: record.qty,
                                                    unit: record.unit,
                                                };
                                            updateRawMaterial(
                                                updatedRawMaterial
                                            );
                                        }
                                    }}
                                >
                                    <Button
                                        key={record.key}
                                        type="primary"
                                        onClick={() =>
                                            setTableRowId(record.key as string)
                                        }
                                        loading={
                                            isLoadingCreateRawMaterial ||
                                            isLoadingUpdateRawMaterial
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
                                        isLoadingCreateRawMaterial ||
                                        isLoadingUpdateRawMaterial
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
                                    handleDelete(record.key as string);
                                    if (!record.newData) {
                                        deleteRawMaterial();
                                    }
                                }}
                            >
                                <Button
                                    key={record.key}
                                    type="primary"
                                    danger
                                    onClick={() =>
                                        setTableRowId(record.key as string)
                                    }
                                    loading={isLoadingDeleteRawMaterial}
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
                    globalKey="rawMaterialEditContext"
                    columns={columns}
                    items={RawMaterialData?.data}
                    addButtonLabel="+ Add Raw Material"
                />
            </Skeleton>
        </>
    );
};

export default RawMaterialPage;
