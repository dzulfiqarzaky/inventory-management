/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// InvTable/EditableCell.tsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { Input, Form } from "antd";
import type { InputRef } from "antd";
import type { FormInstance } from "antd/es/form";
import styled from "styled-components";
import { EditableCellProps } from "./InvTableEdit.interface";
import { EditableContext } from ".";

const InvEditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext<FormInstance<any> | null>(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return (
        <EditableCellWrapper {...restProps} newData={record?.newData}>
            {childNode}
        </EditableCellWrapper>
    );
};

const EditableCellWrapper = styled.td<{ newData?: boolean }>`
    background: ${(props) => (props.newData ? "#ffd591" : "")};
    padding: 8px;
`;

export default InvEditableCell;
