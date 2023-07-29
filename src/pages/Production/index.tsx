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
    ProductionInterface,
} from "./production.interface";
import { queryClient } from "../../main";
import ProductionForm from "./ProductionForm";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import { useProducts } from "../../hooks/product/useProduct";
import {
    ProductApiInterface,
    ProductDataApiInterface,
    ProductInterface,
} from "../Product/product.interface";

const ProductionPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const [userError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState<string>("");
    const [open, setOpen] = useState({
        add: false,
        edit: false,
    });

    const { data, isLoading, isError } = useProductions({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: ProductionDataApiInterface) => {
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
                return { data: [...mappedData] };
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

    console.log(data?.data, "<<<<");

    const productionData: ProductionDataInterface =
        data as unknown as ProductionDataInterface;

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
    const columns = useProductionColumn(data?.data || []);

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
                        onClick={() =>
                            setOpen((prev) => ({ ...prev, add: true }))
                        }
                        icon={<PlusOutlined />}
                    >
                        {"Add New Production"}
                    </Button>

                    {!isLoading && columns && (
                        <Table
                            columns={columns}
                            dataSource={data?.data}
                            // onChange={onChange}
                        />
                    )}
                </Skeleton>
            </Space>
            <Drawer
                title={"Add New Product"}
                width={720}
                onClose={() => setOpen((prev) => ({ ...prev, open: false }))}
                open={open.add}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <ProductionForm
                    onSubmit={createProduction}
                    isLoading={isLoadingProduct}
                    data={dataProduct}
                />
            </Drawer>
            <Drawer
                title={"Edit Product"}
                width={720}
                onClose={() => setOpen((prev) => ({ ...prev, edit: false }))}
                open={open.edit}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <ProductionForm onSubmit={updateProduction} />
            </Drawer>
        </>
    );
};

export default ProductionPage;
