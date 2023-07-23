/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect } from "react";
import { Button, Table } from "antd";
import InvEditableRow from "./InvRowEdit";
import InvEditableCell from "./InvCellEdit";
import type { FormInstance } from "antd/es/form";
import { ColumnTypes, DataType } from "./InvTableEdit.interface";
import useHandleEditTable from "./useHandleTableEdit";
import { GlobalStateType } from "../../store";

export const EditableContext = React.createContext<FormInstance<any> | null>(
    null
);

const InvTableEditComponent: React.FC<{
    columns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[];
    items: unknown;
    globalKey: string;
    addButtonLabel: string;
}> = ({ columns, items, addButtonLabel, globalKey }) => {
    const { dataSource, handleAdd, handleSave, setDataSource } =
        useHandleEditTable(globalKey as keyof GlobalStateType);

    useEffect(() => {
        if (items) {
            setDataSource({ ...dataSource, [globalKey]: items });
        }
    }, []);

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
                dataSource={dataSource[globalKey as keyof GlobalStateType]}
                columns={columnsComponent as ColumnTypes}
            />
        </div>
    );
};

export default InvTableEditComponent;
