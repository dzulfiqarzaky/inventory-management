import { useMutation } from "@tanstack/react-query";
import api from "../../lib/client";

const useLogin = ({ options = {} }) => {
    return useMutation(
        async (updates: { username: string; password: string }) => {
            console.log(updates);
            return api("/login", {
                method: "POST",
                data: updates,
            }).then((data) => data.data);
        },
        {
            ...options,
        }
    );
};

export { useLogin };
