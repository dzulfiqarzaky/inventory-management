import { AnyObject } from "antd/es/_util/type";
import InvTableEditComponent from "../../components/InvTableEdit";
import {
    ColumnTypes,
    DataType,
} from "../../components/InvTableEdit/InvTableEdit.interface";
import {
    useCreateCustomer,
    useDeleteCustomer,
    useUpdateCustomer,
    useCustomers,
} from "../../hooks/customer/useCustomer";
import useHandleEditTable from "../../components/InvTableEdit/useHandleTableEdit";
import { Button, Popconfirm, Skeleton, Space } from "antd";
import { queryClient } from "../../main";
import { useState } from "react";
import InvNotif from "../../components/InvNotif";
import { CustomError } from "../Login";

export interface CustomerInterface {
    _id: string;
    name: string;
    address: string;
    subCustomer: string[];
}
export interface CustomerDataInterface {
    data: CustomerInterface[];
}
const CustomerPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const { dataSource, handleDelete, handleSave } = useHandleEditTable(
        "customerEditContext"
    );
    const [customerError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState("");

    const { data, isLoading, isError } = useCustomers({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: CustomerDataInterface) => {
                const mappedData = data.data.map(
                    (customer: CustomerInterface) => {
                        return {
                            key: customer._id,
                            name: customer.name,
                            address: customer.address,
                            subCustomer: customer.subCustomer,
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
        mutate: createCustomer,
        isLoading: isLoadingCreateCustomer,
        isError: isErrorCreateCustomer,
    } = useCreateCustomer({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: () => {
                queryClient.invalidateQueries(["customers"]);
            },
        },
    });

    const {
        mutate: updateCustomer,
        isLoading: isLoadingUpdateCustomer,
        isError: isErrorUpdateCustomer,
    } = useUpdateCustomer({
        customer_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: () => {
                queryClient.invalidateQueries(["customers"]);
            },
        },
    });

    const {
        mutate: deleteCustomer,
        isLoading: isLoadingDeleteCustomer,
        isError: isErrorDeleteCustomer,
    } = useDeleteCustomer({
        customer_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: () => {
                queryClient.invalidateQueries(["customers"]);
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
            title: "address",
            dataIndex: "address",
            editable: true,
        },
        {
            title: "sub customer",
            dataIndex: "subCustomer",
            editable: true,
        },
        {
            title: "Action",
            dataIndex: "Action",
            width: "20%",
            render: (_, record: AnyObject) =>
                dataSource.customerEditContext.length >= 1 ? (
                    <>
                        <Space>
                            {record.edited ? (
                                <Popconfirm
                                    key={record.key}
                                    title="Save into database?"
                                    onConfirm={() => {
                                        handleSave(record);
                                        if (record.newData) {
                                            createCustomer({
                                                name: record.name,
                                                address: record.address,
                                                // subCustomer: record.subCustomer,
                                            });
                                        } else {
                                            const updatedCustomer: DataType = {
                                                name: record.name,
                                                address: record.address,
                                                // subCustomer: record.subCustomer,
                                            };
                                            updateCustomer(updatedCustomer);
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
                                            isLoadingCreateCustomer ||
                                            isLoadingUpdateCustomer
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
                                        isLoadingCreateCustomer ||
                                        isLoadingUpdateCustomer
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
                                        deleteCustomer();
                                    }
                                }}
                            >
                                <Button
                                    key={record.key}
                                    type="primary"
                                    danger
                                    onClick={() => setTableRowId(record.key)}
                                    loading={isLoadingDeleteCustomer}
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
        isErrorCreateCustomer ||
        isErrorDeleteCustomer ||
        isErrorUpdateCustomer
    ) {
        openNotificationWithIcon("error", customerError);
    }
    return (
        <>
            <h1>Customer Page</h1>
            {contextNotif}
            <Skeleton
                loading={
                    isLoading ||
                    isLoadingDeleteCustomer ||
                    isLoadingCreateCustomer ||
                    isLoadingUpdateCustomer
                }
            >
                <InvTableEditComponent
                    globalKey="customerEditContext"
                    columns={columns}
                    items={data?.data}
                    addButtonLabel="+ Add Customer"
                />
            </Skeleton>
        </>
    );
};

export default CustomerPage;
