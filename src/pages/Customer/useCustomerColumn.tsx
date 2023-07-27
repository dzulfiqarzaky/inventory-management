import {
    ColumnTypes,
    DataType,
} from "../../components/InvTableEdit/InvTableEdit.interface";
import { Button, Popconfirm, Space } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { CustomerColumnInterface } from "./customer.interface";

const useCustomerColumn = ({
    createCustomer,
    updateCustomer,
    deleteCustomer,
    handleSaveGlobal,
    handleDelete,
    setTableRowId,
    isLoadingUpdateCustomer,
    isLoadingCreateCustomer,
    isLoadingDeleteCustomer,
}: CustomerColumnInterface) => {
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
                                        createCustomer({
                                            name: record.name as string,
                                            address: record.address as string,
                                            subCustomer:
                                                record.subCustomer as string[],
                                        });
                                    } else {
                                        const updatedCustomer = {
                                            name: record.name as string,
                                            address: record.address as string,
                                            subCustomer:
                                                record.subCustomer as string[],
                                        };
                                        updateCustomer(updatedCustomer);
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
                                        isLoadingCreateCustomer ||
                                        isLoadingUpdateCustomer
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
                                    isLoadingCreateCustomer ||
                                    isLoadingUpdateCustomer
                                }
                            >
                                <a>Save</a>
                            </Button>
                        )}
                        <Popconfirm
                            key={record.key as string}
                            title="Delete the Customer"
                            description="Are you sure to delete this Customer?"
                            cancelText="No"
                            onConfirm={() => {
                                handleDelete(record.key as string);
                                if (!record.newData) {
                                    deleteCustomer();
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
                                loading={isLoadingDeleteCustomer}
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

export default useCustomerColumn;
