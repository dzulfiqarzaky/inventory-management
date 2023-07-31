/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
    Button,
    Col,
    Drawer,
    Pagination,
    Row,
    Skeleton,
    Space,
    Table,
} from "antd";
import {
    useCreateProduction,
    useDeleteProduction,
    useProductions,
    useUpdateProduction,
} from "../../hooks/production/useProduction";
import { CustomError } from "../Login";
import { useEffect, useState } from "react";
import useProductionColumn from "./useProductionColumn";
import InvNotif from "../../components/InvNotif";
import { queryClient } from "../../main";
import ProductionForm from "./ProductionForm";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import { useProducts } from "../../hooks/product/useProduct";
import { ProductDataApiInterface } from "../Product/product.interface";
import {
    ProductInitialData,
    ProductMapped,
    ProductsDataApiResponse,
    ProductsList,
    ProductsListType,
} from "./production.interface";
import Search from "antd/es/input/Search";

const ProductionPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const [userError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState<string>("");
    const [openCreate, setOpenCreate] = useState(false);
    const [currentPage, setCurrentPage] = useState<{
        current: number | null;
        pageSize: number;
        totalPage: number;
    }>({
        current: null,
        pageSize: 15,
        totalPage: 2,
    });
    const [tableKey, setTableKey] = useState(0);

    const [search, setSearch] = useState("");
    const [openEdit, setOpenEdit] = useState<{
        edit: boolean;
        data: null | ProductInitialData;
    }>({
        edit: false,
        data: null,
    });

    const { data, isLoading, isError } = useProductions({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: (data: {
                data: ProductMapped[];
                initialData: ProductInitialData[];
                groupedData: Record<number, ProductMapped[]>;
            }) => {
                const groupedData = data.groupedData;
                setCurrentPage({
                    current: 1,
                    pageSize: groupedData[1]?.length,
                    totalPage: Object.keys(groupedData)?.length || 0,
                });
            },
            select: (data: ProductsDataApiResponse) => {
                const initialData: ProductInitialData[] = data.data.map(
                    (production) => ({
                        id: production._id,
                        productionDate: moment(production.productionDate),
                        note: production.note,
                        products: production.productItems.map((prodItem) => ({
                            product: prodItem.product._id,
                            qty: prodItem.qty,
                            uom: prodItem.uom,
                        })),
                    })
                );
                const mappedData: ProductMapped[] = data.data.flatMap(
                    (production) => {
                        return production.productItems.map((item, index) => ({
                            index: index,
                            key: production._id,
                            productionDate: moment(
                                production.productionDate
                            ).format("YYYY-MM-DD HH:mm:ss"),
                            note: production.note,
                            ...item,
                            product:
                                item.product.SKU + " - " + item.product.name,
                        }));
                    }
                );
                const groupedData: Record<number, ProductMapped[]> = {};
                let currentGroup: ProductMapped[] = [];
                let count = 1;
                for (let index = 0; index < mappedData.length; index++) {
                    const item = mappedData[index];
                    if (mappedData.length - 1 === index) {
                        currentGroup.push(item);
                        groupedData[count] = [...currentGroup];
                        currentGroup = [];
                        break;
                    }
                    if (mappedData[index + 1].key === item.key) {
                        currentGroup.push(item);
                    } else if (mappedData[index + 1].key !== item.key) {
                        currentGroup.push(item);
                        if (currentGroup.length >= 7) {
                            groupedData[count] = [...currentGroup];
                            currentGroup = [];
                            count++;
                        }
                    }
                }

                return { data: [...mappedData], initialData, groupedData };
            },
        },
        query: {
            search,
        },
    });

    const {
        data: dataProduct,
        isLoading: isLoadingProduct,
        isError: isErrorProduct,
    } = useProducts({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: ProductDataApiInterface) => {
                const mappedData: ProductsList[] = data.data.map((product) => {
                    return {
                        label: product.SKU + " - " + product.name,
                        value: product._id,
                        uom: product.unit,
                    };
                });
                return { data: mappedData };
            },
        },
        query: {
            search: "asd",
        },
    });

    const {
        mutate: createProduction,
        isLoading: isLoadingCreateProduction,
        isError: isErrorCreateProduction,
    } = useCreateProduction({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                setOpenCreate(false);
                await queryClient.invalidateQueries(["productions"]);
            },
        },
    });

    const {
        mutate: updateProduction,
        isLoading: isLoadingUpdateProduction,
        isError: isErrorUpdateProduction,
    } = useUpdateProduction({
        production_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                setOpenEdit((prev) => ({ ...prev, edit: false }));
                await queryClient.invalidateQueries(["productions"]);
            },
        },
    });

    const {
        mutate: deleteProduction,
        isLoading: isLoadingDeleteProduction,
        isError: isErrorDeleteProduction,
    } = useDeleteProduction({
        production_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["productions"]);
            },
        },
    });

    const dataSource: ProductMapped[] = data?.data;

    const initialProductData: ProductInitialData[] = isLoading
        ? []
        : (data?.initialData as unknown as ProductInitialData[]);

    const dataSourceGrouped = isLoading ? {} : data?.groupedData;

    const loadingAll =
        isLoading ||
        isLoadingDeleteProduction ||
        isLoadingCreateProduction ||
        isLoadingUpdateProduction;
    if (
        isError ||
        isErrorProduct ||
        isErrorCreateProduction ||
        isErrorDeleteProduction ||
        isErrorUpdateProduction
    ) {
        openNotificationWithIcon("error", userError);
    }

    const columns = useProductionColumn({
        dataSource: dataSourceGrouped[currentPage?.current as number] || [],
        deleteProduction,
        setTableRowId,
        isLoadingDeleteProduction,
        setOpenEdit,
        initialProductData,
    });

    useEffect(() => {
        setTableKey((prevKey) => prevKey + 1);
    }, [currentPage.pageSize, search]);

    const onChange = (current: number) => {
        setCurrentPage({
            current: current,
            pageSize: dataSourceGrouped[current]?.length || 0,
            totalPage:
                Object.keys(
                    dataSourceGrouped as Record<number, ProductMapped[]>
                )?.length || 0,
        });
    };

    const onSearch = (val: string) => {
        setSearch(val);
    };

    return (
        <>
            {contextNotif}
            <Skeleton loading={loadingAll}>
                <Space
                    direction="vertical"
                    size="large"
                    style={{ display: "flex" }}
                >
                    <h1>Production Page</h1>

                    <Row>
                        <Col span={18}>
                            <Button
                                type="primary"
                                onClick={() => setOpenCreate(true)}
                                icon={<PlusOutlined />}
                            >
                                {"Add New Production"}
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Search
                                placeholder="input search text"
                                onSearch={onSearch}
                                enterButton
                            />
                        </Col>
                    </Row>
                    {!isLoading && columns && currentPage.current && (
                        <>
                            <Table
                                key={tableKey}
                                columns={columns}
                                dataSource={
                                    dataSourceGrouped[currentPage.current]
                                }
                                pagination={false}
                                loading={isLoading}
                            />
                            <Pagination
                                simple
                                defaultCurrent={currentPage.current}
                                total={dataSource.length}
                                onChange={onChange}
                            />
                        </>
                    )}
                </Space>
            </Skeleton>
            <Drawer
                title={"Add New Product"}
                width={720}
                destroyOnClose
                onClose={() => setOpenCreate(false)}
                open={openCreate}
                bodyStyle={{ paddingBottom: 80 }}
            >
                {dataProduct && (
                    <ProductionForm
                        onSubmit={createProduction}
                        isLoading={isLoadingProduct}
                        product={dataProduct as never as ProductsListType}
                    />
                )}
            </Drawer>
            <Drawer
                title={"Edit Product"}
                width={720}
                destroyOnClose
                onClose={() =>
                    setOpenEdit((prev) => ({ ...prev, edit: false }))
                }
                open={openEdit.edit}
                bodyStyle={{ paddingBottom: 80 }}
            >
                {dataProduct && openEdit.data && (
                    <ProductionForm
                        isLoading={isLoadingProduct}
                        product={dataProduct as never as ProductsListType}
                        initialVal={openEdit.data}
                        onSubmit={updateProduction}
                    />
                )}
            </Drawer>
        </>
    );
};

export default ProductionPage;
