import { AnyObject } from "antd/es/_util/type";
import InvTableEditComponent from "../../components/InvTableEdit";
import {
    ColumnTypes,
    DataType,
} from "../../components/InvTableEdit/InvTableEdit.interface";
import {
    useCreateProduct,
    useDeleteProduct,
    useUpdateProduct,
    useProducts,
} from "../../hooks/product/useProduct";
import useHandleEditTable from "../../components/InvTableEdit/useHandleTableEdit";
import { Button, Popconfirm, Skeleton, Space } from "antd";
import { queryClient } from "../../main";
import { useState } from "react";
import InvNotif from "../../components/InvNotif";
import { CustomError } from "../Login";

export interface ProductInterface {
    _id: string;
    name: string;
    password: string;
    role: string;
}
export interface ProductDataInterface {
    data: ProductInterface[];
}
const ProductPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const { dataSource, handleDelete, handleSave } = useHandleEditTable();
    const [productError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState("");

    const { data, isLoading, isError } = useProducts({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: ProductDataInterface) => {
                const mappedData = data.data.map(
                    (product: ProductInterface) => {
                        return {
                            key: product._id,
                            name: product.name,
                            password: "xxxxxx",
                            role: product.role,
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
        mutate: createProduct,
        isLoading: isLoadingCreateProduct,
        isError: isErrorCreateProduct,
    } = useCreateProduct({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: () => {
                queryClient.invalidateQueries(["products"]);
            },
        },
    });

    const {
        mutate: updateProduct,
        isLoading: isLoadingUpdateProduct,
        isError: isErrorUpdateProduct,
    } = useUpdateProduct({
        product_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: () => {
                queryClient.invalidateQueries(["products"]);
            },
        },
    });

    const {
        mutate: deleteProduct,
        isLoading: isLoadingDeleteProduct,
        isError: isErrorDeleteProduct,
    } = useDeleteProduct({
        product_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: () => {
                queryClient.invalidateQueries(["products"]);
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
                                            createProduct({
                                                name: record.name,
                                                password: record.password,
                                                role: record.role,
                                            });
                                        } else {
                                            const updatedProduct: DataType = {
                                                name: record.name,
                                                role: record.role,
                                            };
                                            record.password !== "xxxxxx"
                                                ? (updatedProduct.password =
                                                      record.password)
                                                : null;
                                            updateProduct(updatedProduct);
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
                                            isLoadingCreateProduct ||
                                            isLoadingUpdateProduct
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
                                        isLoadingCreateProduct ||
                                        isLoadingUpdateProduct
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
                                        deleteProduct();
                                    }
                                }}
                            >
                                <Button
                                    key={record.key}
                                    type="primary"
                                    danger
                                    onClick={() => setTableRowId(record.key)}
                                    loading={isLoadingDeleteProduct}
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
        isErrorCreateProduct ||
        isErrorDeleteProduct ||
        isErrorUpdateProduct
    ) {
        openNotificationWithIcon("error", productError);
    }
    return (
        <>
            <h1>Product Page</h1>
            {contextNotif}
            <Skeleton
                loading={
                    isLoading ||
                    isLoadingDeleteProduct ||
                    isLoadingCreateProduct ||
                    isLoadingUpdateProduct
                }
            >
                <InvTableEditComponent
                    columns={columns}
                    items={data?.data}
                    addButtonLabel="+ Add Product"
                />
            </Skeleton>
        </>
    );
};

export default ProductPage;
