import { Button, Popconfirm, Space } from "antd";
import { AnyObject } from "antd/es/_util/type";
import {
    ColumnTypes,
    DataType,
} from "../../components/InvTableEdit/InvTableEdit.interface";
import { ProductColumnInterface } from "./product.interface";

const useProductColumns = ({
    createProduct,
    updateProduct,
    deleteProduct,
    handleSaveGlobal,
    handleDelete,
    setTableRowId,
    isLoadingUpdateProduct,
    isLoadingCreateProduct,
    isLoadingDeleteProduct,
}: ProductColumnInterface) => {
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
            render: (_, record: AnyObject) => (
                <>
                    <Space>
                        {record.edited ? (
                            <Popconfirm
                                key={record.key as string}
                                title="Save into database?"
                                onConfirm={() => {
                                    handleSaveGlobal(record as DataType);
                                    if (record.newData) {
                                        createProduct({
                                            name: record.name as string,
                                            SKU: record.SKU as string,
                                            qty: record.qty as string,
                                            unit: record.unit as string,
                                        });
                                    } else {
                                        const updatedProduct = {
                                            name: record.name as string,
                                            SKU: record.SKU as string,
                                            qty: record.qty as string,
                                            unit: record.unit as string,
                                        };
                                        updateProduct(updatedProduct);
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
                                        isLoadingCreateProduct ||
                                        isLoadingUpdateProduct
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
                                    isLoadingCreateProduct ||
                                    isLoadingUpdateProduct
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
                                    deleteProduct();
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
                                loading={isLoadingDeleteProduct}
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

export default useProductColumns;
