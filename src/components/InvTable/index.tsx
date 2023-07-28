import React from "react";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { ProductionInterface } from "../../pages/Production/production.interface";

export type DataType = ProductionInterface;

const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
) => {
    console.log("params", pagination, filters, sorter, extra);
};

const InvTable: React.FC<{
    data: DataType[];
    columns: ColumnsType<DataType>;
}> = ({
    data,
    columns,
}: {
    data: DataType[];
    columns: ColumnsType<DataType>;
}) => <Table columns={columns} dataSource={data} onChange={onChange} />;

export default InvTable;
