/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ColumnsType } from "antd/es/table";
import { ProductItem, ProductionInterface } from "./production.interface";
import { AnyObject } from "antd/es/_util/type";
import { Button, Popconfirm, Space, Tag } from "antd";
import { convertToISODate } from "../../lib/useDateSorter";

const useProductionColumn = () => {
    const columns: ColumnsType<ProductionInterface> = [
        {
            title: "Production Date",
            dataIndex: "productionDate",
            sorter: (a, b) => {
                const isoDate1 = convertToISODate(a.productionDate);
                const isoDate2 = convertToISODate(b.productionDate);
                return isoDate1.localeCompare(isoDate2);
            },
            filterSearch: true,
        },
        {
            title: "Total",
            dataIndex: "total",
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: "Products",
            dataIndex: "productItems",
            width: "30%",
            sorter: (a, b) => a.total - b.total,
            filters: [
                {
                    text: "keripik pedas",
                    value: "keripik pedas",
                },
                {
                    text: "keripik asin",
                    value: "keripik asin",
                },
                {
                    text: "keripik manis",
                    value: "keripik manis",
                },
                {
                    text: "keripik udang",
                    value: "keripik udang",
                },
            ],
            onFilter: (value: string | number | boolean, record) => {
                if (typeof value === "string") {
                    const found = record.productItems.find(
                        (product) => product.product === value
                    );
                    console.log(found, 9999);
                    if (found) return true;
                }
                return false;
            },
            render: (_, record: AnyObject) => {
                const onPreventMouseDown = (
                    event: React.MouseEvent<HTMLSpanElement>
                ) => {
                    event.preventDefault();
                    event.stopPropagation();
                };
                const color = {
                    "keripik pedas": "red",
                    "keripik asin": "gold",
                    "keripik manis": "pink",
                    "keripik udang": "orange",
                };
                type colorKey = keyof typeof color;

                return (
                    <>
                        {record.productItems.map((product: ProductItem) => (
                            <Tag
                                color={color[product.product as colorKey]}
                                onMouseDown={onPreventMouseDown}
                                // style={{ marginRight: 3 }}
                            >
                                {`${product.product}: ${product.qty}`}
                            </Tag>
                        ))}
                    </>
                );
            },
        },
        {
            title: "Notes",
            dataIndex: "note",
            width: "40%",
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
