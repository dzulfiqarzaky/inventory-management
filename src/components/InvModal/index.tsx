import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";

const { confirm } = Modal;

const showConfirm = () => {
    confirm({
        title: "Do you Want to delete these items?",
        icon: <ExclamationCircleFilled />,
        content: "Some descriptions",
        onOk() {
            console.log("OK");
        },
        onCancel() {
            console.log("Cancel");
        },
    });
};

const showPromiseConfirm = (props: any) => {
    confirm({
        title: "Do you want to delete these items?",
        icon: <ExclamationCircleFilled />,
        content:
            "When clicked the OK button, this dialog will be closed after 1 second",
        async onOk() {
            try {
                return await new Promise((resolve, reject) => {
                    props();
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                });
            } catch {
                return console.log("Oops errors!");
            }
        },
        onCancel() {},
    });
};

const showDeleteConfirm = () => {
    confirm({
        title: "Are you sure delete this task?",
        icon: <ExclamationCircleFilled />,
        content: "Some descriptions",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
            console.log("OK");
        },
        onCancel() {
            console.log("Cancel");
        },
    });
};

const showPropsConfirm = () => {
    confirm({
        title: "Are you sure delete this task?",
        icon: <ExclamationCircleFilled />,
        content: "Some descriptions",
        okText: "Yes",
        okType: "danger",
        okButtonProps: {
            disabled: true,
        },
        cancelText: "No",
        onOk() {
            console.log("OK");
        },
        onCancel() {
            console.log("Cancel");
        },
    });
};

export { showConfirm, showPromiseConfirm, showDeleteConfirm, showPropsConfirm };
