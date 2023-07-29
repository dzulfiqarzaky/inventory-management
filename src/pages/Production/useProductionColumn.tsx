/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ColumnsType } from "antd/es/table";
import { ProductionInterface } from "./production.interface";
import { AnyObject } from "antd/es/_util/type";
import { Button, Popconfirm, Space } from "antd";

const useProductionColumn = (convertedData: any[]) => {
    const keyCounts = new Map();
    if (convertedData.length === 0) return;
    convertedData.forEach((data) => {
        const key = data.key;
        if (keyCounts.has(key)) {
            keyCounts.set(key, keyCounts.get(key) + 1);
        } else {
            keyCounts.set(key, 1);
        }
    });

    const calculateRender = (
        text: string,
        record: ProductionInterface,
        index: number
    ) => {
        const key = record.key;
        if (index === 0) {
            const count = keyCounts.get(key) || 1;
            return { children: text, props: { rowSpan: count } };
        }
        if (convertedData[index - 1].key !== key) {
            const count = keyCounts.get(key) || 1;
            return { children: text, props: { rowSpan: count } };
        }
        return null;
    };

    const calculateOnCell = (_: ProductionInterface, index?: number) => {
        if (index) {
            const key = convertedData[index].key;
            if (index > 0 && convertedData[index - 1].key === key) {
                return { rowSpan: 0 };
            }
        }
        return { rowSpan: 1 };
    };

    const columns: ColumnsType<ProductionInterface> = [
        {
            title: "Production Date",
            dataIndex: "productionDate",
            render: calculateRender,
            onCell: calculateOnCell,
        },
        {
            title: "Products",
            dataIndex: "productItems",
            width: "50%",
            children: [
                {
                    title: "Amount",
                    dataIndex: "qty",
                    key: "amount",
                },
                {
                    title: "Product",
                    dataIndex: "product",
                    key: "product",
                },
                {
                    title: "Uom",
                    dataIndex: "uom",
                    key: "uom",
                },
            ],
        },
        {
            title: "Notes",
            dataIndex: "note",
            width: "30%",
            render: calculateRender,
            onCell: calculateOnCell,
        },
        {
            title: "Action",
            dataIndex: "Action",
            width: "20%",
            render: (_, record: AnyObject) => (
                <>
                    <Space>
                        {
                            <Button type="primary" loading={false}>
                                <a>Edit</a>
                            </Button>
                        }
                        <Popconfirm
                            key={record.key as string}
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            cancelText="No"
                            onConfirm={() => {
                                // handleDelete(record.key as string);
                                // if (!record.newData) {
                                //     deleteUser();
                                // }
                            }}
                        >
                            <Button
                                type="primary"
                                danger
                                onClick={
                                    () => console.log("click")
                                    // setTableRowId(record.key as string)
                                }
                                // loading={isLoadingDeleteUser}
                            >
                                <a>Delete</a>
                            </Button>
                        </Popconfirm>
                    </Space>
                </>
            ),
        },
    ];

    return columns;
};

export default useProductionColumn;
