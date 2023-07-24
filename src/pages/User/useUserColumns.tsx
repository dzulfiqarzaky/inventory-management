import { AnyObject } from "antd/es/_util/type";
import {
    ColumnTypes,
    DataType,
} from "../../components/InvTableEdit/InvTableEdit.interface";
import { Button, Popconfirm, Space } from "antd";
import { UserColumnInterface } from "./user.interface";

const useUserColumns = ({
    createUser,
    updateUser,
    deleteUser,
    handleSaveGlobal,
    handleDelete,
    setTableRowId,
    isLoadingUpdateUser,
    isLoadingCreateUser,
    isLoadingDeleteUser,
}: UserColumnInterface) => {
    const columns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[] = [
        {
            title: "username",
            dataIndex: "username",
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
            width: "20%",
            render: (_, record: AnyObject) => (
                <>
                    <Space>
                        {record.edited ? (
                            <Popconfirm
                                key={record.key as string}
                                title="Save into database?"
                                onConfirm={() => {
                                    if (record.newData) {
                                        createUser({
                                            username: record.username as string,
                                            password: record.password as string,
                                            role: record.role as string,
                                        });
                                    } else {
                                        const updatedUser: Partial<DataType> = {
                                            username: record.username as string,
                                            role: record.role as string,
                                        };
                                        record.password !== "xxxxxx"
                                            ? (updatedUser.password =
                                                  record.password as string)
                                            : null;
                                        updateUser(updatedUser);
                                    }
                                    handleSaveGlobal(record as DataType);
                                }}
                            >
                                <Button
                                    key={record.key as string}
                                    type="primary"
                                    onClick={() =>
                                        setTableRowId(record.key as string)
                                    }
                                    loading={
                                        isLoadingCreateUser ||
                                        isLoadingUpdateUser
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
                                    isLoadingCreateUser || isLoadingUpdateUser
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
                                    deleteUser();
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
                                loading={isLoadingDeleteUser}
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

export default useUserColumns;
