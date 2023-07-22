import React from "react";
import { Button, notification, Space } from "antd";
import { CustomError } from "../../pages/Login";

type NotificationType = "success" | "info" | "warning" | "error";

const InvNotif = () => {
    const [api, contextNotif] = notification.useNotification();

    const openNotificationWithIcon = (
        type: NotificationType,
        errorMessage: CustomError | null
    ) => {
        api[type]({
            message: "Error",
            description: errorMessage?.response.data.error.message,
        });
    };

    return {
        openNotificationWithIcon,
        contextNotif,
    };
};

export default InvNotif;
