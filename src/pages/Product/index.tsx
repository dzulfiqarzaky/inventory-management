/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import InvTableEditComponent from "../../components/InvTableEdit";
import {
    useCreateProduct,
    useDeleteProduct,
    useUpdateProduct,
    useProducts,
} from "../../hooks/product/useProduct";
import useHandleEditTable from "../../components/InvTableEdit/useHandleTableEdit";
import { Skeleton } from "antd";
import { queryClient } from "../../main";
import { useState } from "react";
import InvNotif from "../../components/InvNotif";
import { CustomError } from "../Login";
import {
    ProductApiInterface,
    ProductDataApiInterface,
    ProductDataInterface,
    ProductInterface,
} from "./product.interface";
import useProductColumns from "./useProductColumns";

const ProductPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const { handleDelete, handleSaveGlobal } = useHandleEditTable();
    const [productError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState("");

    const { data, isLoading, isError } = useProducts({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: ProductDataApiInterface) => {
                const mappedData: ProductInterface[] = data.data.map(
                    (product: ProductApiInterface) => {
                        return {
                            key: product._id,
                            name: product.name,
                            SKU: product.SKU,
                            unit: product.unit,
                            qty: product.qty,
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

    const productData: ProductDataInterface =
        data as unknown as ProductDataInterface;

    const {
        mutate: createProduct,
        isLoading: isLoadingCreateProduct,
        isError: isErrorCreateProduct,
    } = useCreateProduct({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["products"]);
            },
        },
    });

    const {
        mutate: updateProduct,
        isLoading: isLoadingUpdateProduct,
        isError: isErrorUpdateProduct,
    } = useUpdateProduct({
        product_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["products"]);
            },
        },
    });

    const {
        mutate: deleteProduct,
        isLoading: isLoadingDeleteProduct,
        isError: isErrorDeleteProduct,
    } = useDeleteProduct({
        product_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["products"]);
            },
        },
    });

    const columns = useProductColumns({
        createProduct,
        updateProduct,
        deleteProduct,
        handleSaveGlobal,
        handleDelete,
        setTableRowId,
        isLoadingUpdateProduct,
        isLoadingCreateProduct,
        isLoadingDeleteProduct,
    });
    if (
        isError ||
        isErrorCreateProduct ||
        isErrorDeleteProduct ||
        isErrorUpdateProduct
    ) {
        openNotificationWithIcon("error", productError);
    }
    return (
        <>
            <h1>Product Page</h1>
            {contextNotif}
            <Skeleton
                loading={
                    isLoading ||
                    isLoadingDeleteProduct ||
                    isLoadingCreateProduct ||
                    isLoadingUpdateProduct
                }
            >
                <InvTableEditComponent
                    columns={columns}
                    items={productData?.data}
                    addButtonLabel="+ Add Product"
                />
            </Skeleton>
        </>
    );
};

export default ProductPage;
