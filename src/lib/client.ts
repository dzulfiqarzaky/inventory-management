import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";

export interface AccessToken {
    access_token: string | null;
}

export interface ApiResponse<T> {
    data: T;
}

export interface ApiError {
    message: string;
}

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/", // Replace with your API base URL
});

// Add request interceptor to include the access token in every request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
        const accessToken: AccessToken = {
            access_token: localStorage.getItem("access_token"), // Replace with the actual access token (e.g., from localStorage or a state variable)
        };

        if (accessToken.access_token) {
            config.headers[
                "access_token"
            ] = `Bearer ${accessToken.access_token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error.response);
    }
);

export default api;
