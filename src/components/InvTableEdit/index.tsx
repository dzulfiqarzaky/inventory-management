import React, { useEffect } from "react";
import { Button, Popconfirm, Space, Table } from "antd";
import InvEditableRow from "./InvRowEdit";
import InvEditableCell from "./InvCellEdit";
import type { FormInstance } from "antd/es/form";
import { ColumnTypes, DataType } from "./InvTableEdit.interface";
import useHandleEditTable from "./useHandleTableEdit";
import { AnyObject } from "antd/es/_util/type";

export const EditableContext = React.createContext<FormInstance<any> | null>(
    null
);

const InvTableEditComponent: React.FC<{
    addButtonLabel: string;
}> = ({ addButtonLabel }: { addButtonLabel: string }) => {
    const {
        dataSource,
        handleAdd,
        handleSave,
        handleDelete,
        setDataSource,
        handleDatabaseSave,
    } = useHandleEditTable();

    useEffect(() => {
        setDataSource([
            {
                key: "0",
                name: "Edward King 0",
                age: "32",
                supplier: "johny",
                address: "London, Park Lane no. 0",
            },
            {
                key: "1",
                name: "Edward King 1",
                supplier: "johny",
                age: "32",
                address: "London, Park Lane no. 1",
            },
        ]);
    }, []);
    const defaultColumns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[] = [
        {
            title: "name",
            dataIndex: "name",
            width: "30%",
            editable: true,
        },
        {
            title: "supplier",
            dataIndex: "supplier",
            editable: true,
        },
        {
            title: "age",
            dataIndex: "age",
            editable: true,
        },
        {
            title: "address",
            dataIndex: "address",
            editable: true,
        },
        {
            title: "Action",
            dataIndex: "Action",
            render: (_, record: AnyObject) =>
                dataSource.length >= 1 ? (
                    <>
                        <Space>
                            {record.edited ? (
                                <Popconfirm
                                    title="Save into database?"
                                    onConfirm={() => handleDatabaseSave(record)}
                                >
                                    <Button type="primary">
                                        <a>Save</a>
                                    </Button>
                                </Popconfirm>
                            ) : (
                                <Button type="primary" disabled>
                                    <a>Save</a>
                                </Button>
                            )}
                            <Popconfirm
                                title="Sure to delete?"
                                onConfirm={() => handleDelete(record.key)}
                            >
                                <Button type="primary" danger>
                                    <a>Delete</a>
                                </Button>
                            </Popconfirm>
                        </Space>
                    </>
                ) : null,
        },
    ];

    const columns = defaultColumns.map((col) => {
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
                dataSource={dataSource}
                columns={columns as ColumnTypes}
            />
        </div>
    );
};

export default InvTableEditComponent;
