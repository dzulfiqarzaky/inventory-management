import React, { useEffect } from "react";
import { Button, Popconfirm, Space, Table } from "antd";
import InvEditableRow from "./InvRowEdit";
import InvEditableCell from "./InvCellEdit";
import type { FormInstance } from "antd/es/form";
import { ColumnTypes, DataType } from "./InvTableEdit.interface";
import useHandleEditTable from "./useHandleTableEdit";

export const EditableContext = React.createContext<FormInstance<any> | null>(
    null
);

const InvTableEditComponent: React.FC<{
    columns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[];
    items: any;
    globalKey: string;
    addButtonLabel: string;
}> = ({ columns, items, addButtonLabel, globalKey }) => {
    const { dataSource, handleAdd, handleSave, setDataSource } =
        useHandleEditTable(globalKey);

    useEffect(() => {
        if (items) {
            setDataSource({ ...dataSource, [globalKey]: items });
        }
    }, [items]);

    const columnsComponent = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const components = {
        body: {
            row: InvEditableRow,
            cell: InvEditableCell,
        },
    };

    return (
        <div>
            <Button
                onClick={handleAdd}
                type="primary"
                style={{ marginBottom: 16 }}
            >
                {addButtonLabel}
            </Button>
            <Table
                components={components}
                rowClassName={(record) =>
                    record?.newData ? "editable-row" : "editable-row new-row"
                }
                bordered
                dataSource={dataSource[globalKey]}
                columns={columnsComponent as ColumnTypes}
            />
        </div>
    );
};

export default InvTableEditComponent;
