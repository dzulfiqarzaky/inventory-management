// InvTable/EditableRow.tsx
import React from "react";
import { Form } from "antd";
import { EditableContext } from ".";

interface EditableRowProps {
    index: number;
}

const InvEditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

export default InvEditableRow;
