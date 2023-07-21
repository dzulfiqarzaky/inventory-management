import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/client";

export interface UserApiInterface {
    user_id: string;
    options: {};
}

const fetchUsers = async ({ query = {} }) =>
    api(`/user`, {
        params: {
            search: "",
            limit: 10,
            page: 1,
            sortBy: "created_at",
            sortOrder: "desc",
            ...query,
        },
    }).then((data) => data);

const useUsers = ({ query = {}, options = {} } = {}) =>
    useQuery(["users", query], () => fetchUsers({ query }), {
        keepPreviousData: true,
        ...options,
    });

const fetchUser = async ({ user_id }: { user_id: string }) =>
    api(`/user/${user_id}`).then((data) => data);

const useUser = ({ user_id, options = {} }: UserApiInterface) =>
    useQuery(["user", user_id], () => fetchUser({ user_id }), {
        ...options,
    });

const useCreateUser = ({ options = {} }: UserApiInterface) => {
    return useMutation(
        (newData) =>
            api("/user", {
                method: "POST",
                data: newData,
            }),
        { ...options }
    );
};

const useUpdateUser = ({ user_id, options = {} }: UserApiInterface) => {
    return useMutation(
        (updates) =>
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
