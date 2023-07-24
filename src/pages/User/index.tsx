/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AnyObject } from "antd/es/_util/type";
import InvTableEditComponent from "../../components/InvTableEdit";
import {
    ColumnTypes,
    DataType,
} from "../../components/InvTableEdit/InvTableEdit.interface";
import {
    useCreateUser,
    useDeleteUser,
    useUpdateUser,
    useUsers,
} from "../../hooks/user/useUser";
import useHandleEditTable from "../../components/InvTableEdit/useHandleTableEdit";
import { Button, Popconfirm, Skeleton, Space } from "antd";
import { queryClient } from "../../main";
import { useState } from "react";
import InvNotif from "../../components/InvNotif";
import { CustomError } from "../Login";

export interface UserInterface {
    key: string;
    username: string;
    password: string;
    role: string;
}

export interface UserApiInterface {
    _id: string;
    username: string;
    password: string;
    role: string;
}

export interface UserDataInterface {
    data: UserApiInterface[];
}

const UserPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const { handleDelete, handleSaveGlobal } = useHandleEditTable();
    const [userError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState<string>("");
    const { data, isLoading, isError } = useUsers({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: UserDataInterface) => {
                const mappedData: UserInterface[] = data.data.map(
                    (user: UserApiInterface) => {
                        return {
                            key: user._id,
                            username: user.username,
                            password: "xxxxxx",
                            role: user.role,
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

    const userData: UserDataInterface = data;

    const {
        mutate: createUser,
        isLoading: isLoadingCreateUser,
        isError: isErrorCreateUser,
    } = useCreateUser({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["users"]);
            },
        },
    });

    const {
        mutate: updateUser,
        isLoading: isLoadingUpdateUser,
        isError: isErrorUpdateUser,
    } = useUpdateUser({
        user_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["users"]);
            },
        },
    });

    const {
        mutate: deleteUser,
        isLoading: isLoadingDeleteUser,
        isError: isErrorDeleteUser,
    } = useDeleteUser({
        user_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["users"]);
            },
        },
    });

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
                                key={record.key}
                                title="Save into database?"
                                onConfirm={() => {
                                    if (record.newData) {
                                        createUser({
                                            username: record.username,
                                            password: record.password,
                                            role: record.role,
                                        });
                                    } else {
                                        const updatedUser: DataType = {
                                            username: record.username,
                                            role: record.role,
                                        };
                                        record.password !== "xxxxxx"
                                            ? (updatedUser.password =
                                                  record.password)
                                            : null;
                                        updateUser(updatedUser);
                                    }
                                    handleSaveGlobal(record);
                                }}
                            >
                                <Button
                                    key={record.key}
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
                                key={record.key}
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
                            key={record.key}
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
                                key={record.key}
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

    if (
        isError ||
        isErrorCreateUser ||
        isErrorDeleteUser ||
        isErrorUpdateUser
    ) {
        openNotificationWithIcon("error", userError);
    }
    return (
        <>
            {contextNotif}
            <Skeleton
                loading={
                    isLoading ||
                    isLoadingDeleteUser ||
                    isLoadingCreateUser ||
                    isLoadingUpdateUser
                }
            >
                <InvTableEditComponent
                    columns={columns}
                    items={userData?.data}
                    addButtonLabel="+ Add User"
                />
            </Skeleton>
        </>
    );
};

export default UserPage;
