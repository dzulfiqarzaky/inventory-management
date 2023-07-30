/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Button, Drawer, Skeleton, Space, Table, TableProps } from "antd";
import {
    useCreateProduction,
    useDeleteProduction,
    useProductions,
    useUpdateProduction,
} from "../../hooks/production/useProduction";
import { CustomError } from "../Login";
import { useState } from "react";
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

const ProductionPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const [userError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState<string>("");
    const [openCreate, setOpenCreate] = useState(false);
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
                        return production.productItems.map((item) => ({
                            key: production._id,
                            productionDate: moment(
                                production.productionDate
                            ).format("YYYY-MM-DD HH:mm:ss"),
                            note: production.note,
                            ...item,
                            product: item.product.name,
                        }));
                    }
                );
                return { data: [...mappedData], initialData };
            },
        },
        query: {
            search: "asd",
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
                        label: product.name,
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
    const initialProductData: ProductInitialData[] = data?.initialData;

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
        dataSource,
        deleteProduction,
        setTableRowId,
        isLoadingDeleteProduction,
        setOpenEdit,
        initialProductData,
    });

    const onChange: TableProps<ProductMapped>["onChange"] = (
        newPagination,
        filters,
        sorter,
        extra
    ) => {
        console.log("params", newPagination, filters, sorter, extra);
    };

    return (
        <>
            {contextNotif}
            <Space
                direction="vertical"
                size="large"
                style={{ display: "flex" }}
            >
                <Skeleton loading={loadingAll}>
                    <h1>Production Page</h1>
                    <Button
                        type="primary"
                        onClick={() => setOpenCreate(true)}
                        icon={<PlusOutlined />}
                    >
                        {"Add New Production"}
                    </Button>
                    {!isLoading && columns && (
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            onChange={onChange}
                        />
                    )}
                </Skeleton>
            </Space>
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
