import { Button, Popconfirm, Space } from "antd";
import { AnyObject } from "antd/es/_util/type";
import {
    ColumnTypes,
    DataType,
} from "../../components/InvTableEdit/InvTableEdit.interface";
import { SupplierColumnInterface } from "./supplier.interface";

const useSupplierColumn = ({
    createSupplier,
    updateSupplier,
    deleteSupplier,
    handleSaveGlobal,
    handleDelete,
    setTableRowId,
    isLoadingUpdateSupplier,
    isLoadingCreateSupplier,
    isLoadingDeleteSupplier,
}: SupplierColumnInterface) => {
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
            render: (_, record: AnyObject) => (
                // dataSource.supplierEditContext.length >= 1 ? (
                <>
                    <Space>
                        {record.edited ? (
                            <Popconfirm
                                key={record.key as string}
                                title="Save into database?"
                                onConfirm={() => {
                                    handleSaveGlobal(record as DataType);
                                    if (record.newData) {
                                        createSupplier({
                                            name: record.name as string,
                                        });
                                    } else {
                                        const updatedSupplier = {
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
            ),
        },
    ];
    return columns;
};

export default useSupplierColumn;
