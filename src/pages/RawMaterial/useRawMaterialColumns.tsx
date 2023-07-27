import { Button, Popconfirm, Space } from "antd";
import { AnyObject } from "antd/es/_util/type";
import {
    ColumnTypes,
    DataType,
} from "../../components/InvTableEdit/InvTableEdit.interface";
import { RawMaterialColumnInterface } from "./rawMaterial.interface";

const useRawMaterialColumns = ({
    createRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
    handleSaveGlobal,
    handleDelete,
    setTableRowId,
    isLoadingUpdateRawMaterial,
    isLoadingCreateRawMaterial,
    isLoadingDeleteRawMaterial,
}: RawMaterialColumnInterface) => {
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
            render: (_, record: AnyObject) => (
                // dataSource.rawMaterialEditContext.length >= 1 ? (
                <>
                    <Space>
                        {record.edited ? (
                            <Popconfirm
                                key={record.key as string}
                                title="Save into database?"
                                onConfirm={() => {
                                    handleSaveGlobal(record as DataType);
                                    if (record.newData) {
                                        createRawMaterial({
                                            name: record.name as string,
                                            SKU: record.SKU as string,
                                            qty: record.qty as string,
                                            unit: record.unit as string,
                                        });
                                    } else {
                                        const updatedRawMaterial = {
                                            name: record.name as string,
                                            SKU: record.SKU as string,
                                            qty: record.qty as string,
                                            unit: record.unit as string,
                                        };
                                        updateRawMaterial(updatedRawMaterial);
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
                                        isLoadingCreateRawMaterial ||
                                        isLoadingUpdateRawMaterial
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
                                    isLoadingCreateRawMaterial ||
                                    isLoadingUpdateRawMaterial
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
                                    deleteRawMaterial();
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
                                loading={isLoadingDeleteRawMaterial}
                            >
                                <a>Delete</a>
                            </Button>
                        </Popconfirm>
                    </Space>
                </>
            ),
        },
    ];
    return columns;
};

export default useRawMaterialColumns;
