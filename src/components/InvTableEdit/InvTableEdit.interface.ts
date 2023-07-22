import { Table } from "antd";

export interface DataType {
    key?: React.Key;
    username?: string;
    name?: string;
    password?: string;
    role?: string;
    newData?: boolean;
    edited?: boolean;
    SKU?: string;
    qty?: string;
    unit?: string;
}

export interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof DataType;
    record: DataType;
    handleSave: (record: DataType) => void;
}

export type EditableTableProps = Parameters<typeof Table>[0];

export type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;
