import { ColumnsType } from "antd/es/table";
import { ProductMapped, ProductionColumns } from "./production.interface";
import { AnyObject } from "antd/es/_util/type";
import { Button, Popconfirm, Space } from "antd";

const useProductionColumn = ({
    dataSource = [],
    initialProductData = [],
    deleteProduction,
    setTableRowId,
    setOpenEdit,
    isLoadingDeleteProduction,
}: ProductionColumns) => {
    const keyCounts: Map<string, number> = new Map();

    if (dataSource.length === 0 || initialProductData.length === 0) return;

    dataSource.forEach((data) => {
        const key = data.key;
        if (typeof key != null) {
            const stringKey = key.toString();
            const count = keyCounts.get(stringKey) || 0;
            keyCounts.set(stringKey, count + 1);
        }
    });

    const calculateRender = (
        text: string,
        record: ProductMapped,
        index: number
    ) => {
        const key = record.key;
        const count: number = (keyCounts.get(key) as number) || 1;
        if (index === 0) {
            return { children: text, props: { rowSpan: count } };
        }
        if (dataSource[index - 1].key !== key) {
            return { children: text, props: { rowSpan: count } };
        }
        return null;
    };

    const calculateOnCell = (_: ProductMapped, index?: number) => {
        if (index) {
            const key = dataSource[index].key;
            if (index > 0 && dataSource[index - 1].key === key) {
                return { rowSpan: 0 };
            }
        }
        return { rowSpan: 1 };
    };

    const columns: ColumnsType<ProductMapped> = [
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
                        <Space key={index}>
                            <Button
                                type="primary"
                                loading={false}
                                onClick={() => {
                                    setTableRowId(record.key as string);
                                    const foundData = initialProductData.find(
                                        (production) =>
                                            production.id === record.key
                                    );
                                    if (foundData) {
                                        setOpenEdit({
                                            edit: true,
                                            data: foundData,
                                        });
                                    }
                                }}
                            >
                                <a>Edit</a>
                            </Button>
                            <Popconfirm
                                title="Delete the task"
                                description="Are you sure to delete this task?"
                                cancelText="No"
                                onConfirm={() => deleteProduction()}
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
                const key: string = record.key as string;
                const count: number = (keyCounts.get(key) as number) || 1;
                if (index === 0) {
                    return { children: actionComp, props: { rowSpan: count } };
                }
                if (dataSource[index - 1].key !== key) {
                    return { children: actionComp, props: { rowSpan: count } };
                }
                return null;
            },
        },
    ];

    return columns;
};

export default useProductionColumn;
