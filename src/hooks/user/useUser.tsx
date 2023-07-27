import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";
import {
    UserBaseInterface,
    UserDataApiInterface,
} from "../../pages/User/user.interface";

export interface UserHooksApiInterface {
    options?: object;
    query?: {
        search?: string;
    };
}

export interface UserApiWithIdInterface extends UserHooksApiInterface {
    user_id: string;
}

const fetchUsers = async ({ query = {} }: UserHooksApiInterface) =>
    api(`/user`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((res: UserDataApiInterface) => res.data);

const useUsers = ({ query = {}, options = {} }: UserHooksApiInterface) =>
    useQuery(["users", query], () => fetchUsers({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchUser = async ({ user_id }: UserApiWithIdInterface) =>
    api(`/user/${user_id}`).then((data) => data);

const useUser = ({ user_id, options = {} }: UserApiWithIdInterface) =>
    useQuery(["user", user_id], () => fetchUser({ user_id }), {
        ...options,
    });

const useCreateUser = ({ options = {} }: UserHooksApiInterface) => {
    return useMutation(
        (newData: UserBaseInterface) =>
            api("/user", {
                method: "POST",
                data: newData,
            }),
        { ...options }
    );
};

const useUpdateUser = ({ user_id, options = {} }: UserApiWithIdInterface) => {
    return useMutation(
        (updates: Partial<UserBaseInterface>) =>
            api(`/user/${user_id}`, {
                method: "PUT",
                data: updates,
            }),
        { ...options }
    );
};

const useDeleteUser = ({ user_id, options = {} }: UserApiWithIdInterface) => {
    return useMutation(
        () =>
            api(`/user/${user_id}`, {
                method: "Delete",
            }),
        { ...options }
    );
};

export { useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser };
