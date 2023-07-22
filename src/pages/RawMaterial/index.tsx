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
    _id: string;
    name: string;
    password: string;
    role: string;
}
export interface RawMaterialDataInterface {
    data: RawMaterialInterface[];
}
const RawMaterialPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const { dataSource, handleDelete, handleSave } = useHandleEditTable();
    const [rawMaterialError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState("");

    const { data, isLoading, isError } = useRawMaterials({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: RawMaterialDataInterface) => {
                const mappedData = data.data.map(
                    (rawMaterial: RawMaterialInterface) => {
                        return {
                            key: rawMaterial._id,
                            name: rawMaterial.name,
                            password: "xxxxxx",
                            role: rawMaterial.role,
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
        mutate: createRawMaterial,
        isLoading: isLoadingCreateRawMaterial,
        isError: isErrorCreateRawMaterial,
    } = useCreateRawMaterial({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: () => {
                queryClient.invalidateQueries(["rawMaterials"]);
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
                queryClient.invalidateQueries(["rawMaterials"]);
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
                queryClient.invalidateQueries(["rawMaterials"]);
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
                                            createRawMaterial({
                                                name: record.name,
                                                password: record.password,
                                                role: record.role,
                                            });
                                        } else {
                                            const updatedRawMaterial: DataType =
                                                {
                                                    name: record.name,
                                                    role: record.role,
                                                };
                                            record.password !== "xxxxxx"
                                                ? (updatedRawMaterial.password =
                                                      record.password)
                                                : null;
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
                                            setTableRowId(record.key)
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
                                    handleDelete(record.key);
                                    if (!record.newData) {
                                        deleteRawMaterial();
                                    }
                                }}
                            >
                                <Button
                                    key={record.key}
                                    type="primary"
                                    danger
                                    onClick={() => setTableRowId(record.key)}
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
            <h1>RawMaterial Page</h1>
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
                    items={data?.data}
                    addButtonLabel="+ Add RawMaterial"
                />
            </Skeleton>
        </>
    );
};

export default RawMaterialPage;
