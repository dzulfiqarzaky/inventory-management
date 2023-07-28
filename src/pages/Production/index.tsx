/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Skeleton, Space } from "antd";
import InvDrawer from "../../components/InvDrawer";
import InvTable, { DataType } from "../../components/InvTable";
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
import useLocalTime from "../../lib/useLocalTime";

const ProductionPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const [userError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState<string>("");

    const dataColDum: DataType[] = [
        {
            key: "64bd14c3e2a081f547225c56",
            productionDate: useLocalTime("2023-06-15T00:00:00.000Z"),
            note: "This is a note",
            productItems: [
                {
                    product: "keripik pedas",
                    qty: "1000",
                    _id: "64bd14c3e2a081f547225c57",
                },
                {
                    product: "keripik asin",
                    qty: "1000",
                    _id: "64bd14c3e2a081f547225c58",
                },
            ],
            total: 2000,
        },
        {
            key: "64bd14c3e2a081f547225c561",
            productionDate: useLocalTime("2023-05-15T00:00:00.000Z"),
            note: "This is a note 1",
            productItems: [
                {
                    product: "keripik pedas",
                    qty: "2000",
                    _id: "64bd14c3e2a081f547225c571",
                },
                {
                    product: "keripik asin",
                    qty: "1000",
                    _id: "64bd14c3e2a081f547225c582",
                },
            ],
            total: 3000,
        },
        {
            key: "64bd14c3e2a081f547225c562",
            productionDate: useLocalTime("2023-07-15T00:00:00.000Z"),
            note: "This is a note 2",
            productItems: [
                {
                    product: "keripik pedas",
                    qty: "2000",
                    _id: "64bd14c3e2a081f547225c572",
                },
                {
                    product: "keripik asin",
                    qty: "3000",
                    _id: "64bd14c3e2a081f547225c582",
                },
            ],
            total: 5000,
        },
        {
            key: "64bd14c3e2a081f547225c563",
            productionDate: useLocalTime("2023-07-15T00:00:00.000Z"),
            note: "This is a note 3",
            productItems: [
                {
                    product: "keripik manis",
                    qty: "3000",
                    _id: "64bd14c3e2a081f547225c573",
                },
                {
                    product: "keripik udang",
                    qty: "3000",
                    _id: "64bd14c3e2a081f547225c583",
                },
            ],
            total: 6000,
        },
    ];

    const { data, isLoading, isError } = useProductions({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: ProductionDataApiInterface) => {
                const mappedData: ProductionInterface[] = data.data.map(
                    (production: ProductionApiInterface) => {
                        return {
                            key: production._id,
                            productionDate: production.productionDate,
                            note: production.note,
                            productItems: [...production.productItems],
                            total: production.productItems.reduce(
                                (accumulator, product) =>
                                    accumulator + +product.qty,
                                0
                            ),
                        };
                    }
                );
                return { data: [...mappedData] };
            },
        },
        query: {
            search: "asd",
        },
    });

    console.log(data, "<<<<");

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

    const columns = useProductionColumn();
    if (
        isError ||
        isErrorCreateProduction ||
        isErrorDeleteProduction ||
        isErrorUpdateProduction
    ) {
        openNotificationWithIcon("error", userError);
    }
    return (
        <>
            {contextNotif}
            <Space
                direction="vertical"
                size="large"
                style={{ display: "flex" }}
            >
                <Skeleton
                    loading={
                        isLoading ||
                        isLoadingDeleteProduction ||
                        isLoadingCreateProduction ||
                        isLoadingUpdateProduction
                    }
                >
                    <h1>Production Page</h1>
                    <InvDrawer />
                    <InvTable data={dataColDum} columns={columns} />
                </Skeleton>
            </Space>
        </>
    );
};

export default ProductionPage;
