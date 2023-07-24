/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export interface UserApiInterface {
    user_id?: string;
    options?: object;
    query?: {
        search?: string;
    };
}

const fetchUsers = async ({ query = {} }: UserApiInterface) =>
    api(`/user`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((data) => data.data);

const useUsers = ({ query = {}, options = {} }: UserApiInterface) =>
    useQuery(["users", query], () => fetchUsers({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchUser = async ({ user_id }: UserApiInterface) =>
    api(`/user/${user_id}`).then((data) => data);

const useUser = ({ user_id, options = {} }: UserApiInterface) =>
    useQuery(["user", user_id], () => fetchUser({ user_id }), {
        ...options,
    });

const useCreateUser = ({ options = {} }: UserApiInterface) => {
    return useMutation(
        (newData: Partial<DataType>) =>
            api("/user", {
                method: "POST",
                data: newData,
            }),
        { ...options }
    );
};

const useUpdateUser = ({ user_id, options = {} }: UserApiInterface) => {
    return useMutation(
        (updates: Partial<DataType>) =>
            api(`/user/${user_id}`, {
                method: "PUT",
                data: updates,
            }),
        { ...options }
    );
};

const useDeleteUser = ({ user_id, options = {} }: UserApiInterface) => {
    return useMutation(
        () =>
            api(`/user/${user_id}`, {
                method: "Delete",
            }),
        { ...options }
    );
};

export { useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser };
