import { ColumnsType } from "antd/es/table";
import { ProductionInterface } from "./production.interface";
import { AnyObject } from "antd/es/_util/type";
import { Button, Popconfirm, Space } from "antd";

const useProductionColumn = (
    convertedData: any[],
    deleteProduction,
    setTableRowId,
    isLoadingDeleteProduction,
    setOpenEdit,
    initialData
) => {
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
            onCell: calculateOnCell,
            render: (_, record: AnyObject, index) => {
                const actionComp = (
                    <>
                        <Space>
                            {
                                <Button
                                    type="primary"
                                    loading={false}
                                    onClick={() => {
                                        setTableRowId(record.key as string);
                                        setOpenEdit({
                                            edit: true,
                                            data: initialData.filter(
                                                (production) =>
                                                    production.id === record.key
                                            )[0],
                                        });
                                    }}
                                >
                                    <a>Edit</a>
                                </Button>
                            }
                            <Popconfirm
                                key={record.key as string}
                                title="Delete the task"
                                description="Are you sure to delete this task?"
                                cancelText="No"
                                onConfirm={deleteProduction}
                            >
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() =>
                                        setTableRowId(record.key as string)
                                    }
                                    loading={isLoadingDeleteProduction}
                                >
                                    <a>Delete</a>
                                </Button>
                            </Popconfirm>
                        </Space>
                    </>
                );
                const key = record.key;
                if (index === 0) {
                    const count = keyCounts.get(key) || 1;
                    return { children: actionComp, props: { rowSpan: count } };
                }
                if (convertedData[index - 1].key !== key) {
                    const count = keyCounts.get(key) || 1;
                    return { children: actionComp, props: { rowSpan: count } };
                }
                return null;
            },
        },
    ];

    return columns;
};

export default useProductionColumn;
