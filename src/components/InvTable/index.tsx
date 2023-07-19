import React from "react";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";

export interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: "Name",
        dataIndex: "name",
        filters: [
            {
                text: "Joe",
                value: "Joe",
            },
            {
                text: "Category 1",
                value: "Category 1",
            },
            {
                text: "Category 2",
                value: "Category 2",
            },
        ],
        filterMode: "tree",
        filterSearch: true,
        onFilter: (value: string | number | boolean, record) => {
            if (typeof value === "string") {
                return record.name.startsWith(value);
            }
            return false;
        },
        width: "30%",
    },
    {
        title: "Age",
        dataIndex: "age",
        sorter: (a, b) => a.age - b.age,
    },
    {
        title: "Address",
        dataIndex: "address",
        filters: [
            {
                text: "London",
                value: "London",
            },
            {
                text: "New York",
                value: "New York",
            },
        ],
        onFilter: (value: string | number | boolean, record) => {
            if (typeof value === "string") {
                return record.name.startsWith(value);
            }
            return false;
        },
        filterSearch: true,
        width: "40%",
    },
];

const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
) => {
    console.log("params", pagination, filters, sorter, extra);
};

const InvTable: React.FC<{ data: DataType[] }> = ({
    data,
}: {
    data: DataType[];
}) => <Table columns={columns} dataSource={data} onChange={onChange} />;

export default InvTable;
