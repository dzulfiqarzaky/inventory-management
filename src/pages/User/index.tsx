/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import InvTableEditComponent from "../../components/InvTableEdit";
import {
    useCreateUser,
    useDeleteUser,
    useUpdateUser,
    useUsers,
} from "../../hooks/user/useUser";
import useHandleEditTable from "../../components/InvTableEdit/useHandleTableEdit";
import { Skeleton } from "antd";
import { queryClient } from "../../main";
import { useState } from "react";
import InvNotif from "../../components/InvNotif";
import { CustomError } from "../Login";
import useUserColumns from "./useUserColumns";
import {
    UserApiInterface,
    UserDataInterface,
    UserInterface,
} from "./user.interface";

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

    const userData: { data: UserInterface[] } = data;

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

    const columns = useUserColumns({
        createUser,
        updateUser,
        deleteUser,
        handleSaveGlobal,
        handleDelete,
        setTableRowId,
        isLoadingCreateUser,
        isLoadingUpdateUser,
        isLoadingDeleteUser,
    });

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
