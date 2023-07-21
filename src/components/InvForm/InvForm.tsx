import { Button, Form, Input } from "antd";
import styled from "styled-components";

// Generic interface for the 'formData' prop
interface FormDataProps<T> {
    formData: T[];
    onSubmit: (values: any) => void;
    isLoading: boolean;
    btnLabel: string;
}

// Generic 'InvForm' component
const InvForm = <
    T extends {
        label: string;
        name: string;
        type: string;
        validation: { required: boolean };
    }
>({
    formData,
    onSubmit,
    isLoading,
    btnLabel = "Submit",
}: FormDataProps<T>) => (
    <StyledForm
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onSubmit}
        autoComplete="off"
    >
        {formData.map((item) => (
            <StyledFormItem
                key={item.name}
                label={item.label}
                name={item.name}
                rules={[
                    {
                        required: item.validation.required,
                        message: `Please input your ${item.label}!`,
                    },
                ]}
            >
                {item.type === "password" ? <Input.Password /> : <Input />}
            </StyledFormItem>
        ))}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={isLoading}>
                {btnLabel}
            </Button>
        </Form.Item>
    </StyledForm>
);

const StyledForm = styled(Form)`
    max-width: 600px;
`;

const StyledFormItem = styled(Form.Item)`
    label {
        text-align: left;
    }
`;
export default InvForm;
