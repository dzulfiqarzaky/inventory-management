/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Button, Drawer, Skeleton, Space, Table } from "antd";
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
import {
    ProductionApiInterface,
    ProductionDataApiInterface,
    ProductionDataInterface,
} from "./production.interface";
import { queryClient } from "../../main";
import ProductionForm from "./ProductionForm";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import { useProducts } from "../../hooks/product/useProduct";
import {
    ProductApiInterface,
    ProductDataApiInterface,
} from "../Product/product.interface";

const ProductionPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const [userError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState<string>("");
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState({
        edit: false,
        data: {},
    });

    const { data, isLoading, isError } = useProductions({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: ProductionDataApiInterface) => {
                const initialData = data.data.map((production) => ({
                    id: production._id,
                    productionDate: moment(production.productionDate),
                    note: production.note,
                    products: production.productItems.map((prodItem) => ({
                        product: prodItem.product._id,
                        qty: prodItem.qty,
                        uom: prodItem.uom,
                    })),
                }));
                const mappedData = data.data.flatMap(
                    (production: ProductionApiInterface) => {
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
                const mappedData = data.data.map(
                    (product: ProductApiInterface) => {
                        return {
                            label: product.name,
                            value: product._id,
                            uom: product.unit,
                        };
                    }
                );
                return { data: mappedData };
            },
        },
        query: {
            search: "asd",
        },
    });

    const productionData: ProductionDataInterface =
        data?.data as unknown as ProductionDataInterface;

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

    const columns = useProductionColumn(
        productionData || [],
        deleteProduction,
        setTableRowId,
        isLoadingDeleteProduction,
        setOpenEdit,
        data?.initialData || []
    );

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
                            dataSource={productionData}
                            // onChange={onChange}
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
                <ProductionForm
                    onSubmit={createProduction}
                    isLoading={isLoadingProduct}
                    product={dataProduct}
                />
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
                <ProductionForm
                    isLoading={isLoadingProduct}
                    product={dataProduct}
                    initialVal={openEdit.data}
                    onSubmit={updateProduction}
                />
            </Drawer>
        </>
    );
};

export default ProductionPage;
