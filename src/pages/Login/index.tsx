// LoginPage.jsx
import InvForm from "../../components/InvForm/InvForm";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import { Alert, Space } from "antd";
import { useLogin } from "../../hooks/user/useLogin";

export interface LoginFormData {
    label: string;
    name: string;
    type: string;
    validation: { required: boolean };
}
export interface User {
    data: {
        access_token: string;
        username: string;
        role: string;
    };
}

export interface CustomError {
    response: {
        data: {
            error: {
                message: string;
            };
        };
    };
}

const loginFormData: LoginFormData[] = [
    {
        label: "Username",
        name: "username",
        type: "text",
        validation: { required: true },
    },
    {
        label: "Password",
        name: "password",
        type: "password",
        validation: { required: true },
    },
];

const LoginPage = () => {
    const [user, setUser] = useState("");
    const [loginError, setError] = useState<CustomError | null>(null);
    const {
        mutate: loginUser,
        isLoading,
        isError,
    } = useLogin({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: ({ data }: User) => {
                console.log(data.access_token, 1112);
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("role", data.role);
                setUser(data.username);
            },
        },
    });

    const onSubmit = (values: { username: string; password: string }) => {
        setError(null);
        loginUser({
            username: values.username,
            password: values.password,
        });
    };

    return (
        <CenteredContainer>
            <div>
                <Space direction="vertical" style={{ width: "100%" }}>
                    {isError && loginError ? (
                        <Alert
                            message={loginError.response.data.error.message}
                            type="error"
                            showIcon
                            closable
                        />
                    ) : null}
                    {user && <Navigate to="/" replace={true} />}
                    <InvForm
                        formData={loginFormData}
                        onSubmit={onSubmit}
                        isLoading={isLoading}
                        btnLabel={"login"}
                    />
                </Space>
            </div>
        </CenteredContainer>
    );
};

const CenteredContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Set the container height to fill the viewport */
`;

export default LoginPage;
