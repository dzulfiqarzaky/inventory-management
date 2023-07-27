/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import InvTableEditComponent from "../../components/InvTableEdit";
import {
    useCreateCustomer,
    useDeleteCustomer,
    useUpdateCustomer,
    useCustomers,
} from "../../hooks/customer/useCustomer";
import useHandleEditTable from "../../components/InvTableEdit/useHandleTableEdit";
import { Skeleton } from "antd";
import { queryClient } from "../../main";
import { useState } from "react";
import InvNotif from "../../components/InvNotif";
import { CustomError } from "../Login";
import useCustomerColumn from "./useCustomerColumn";
import {
    CustomerApiInterface,
    CustomerDataApiInterface,
    CustomerDataInterface,
    CustomerInterface,
} from "./customer.interface";

const CustomerPage = () => {
    const { openNotificationWithIcon, contextNotif } = InvNotif();
    const { handleDelete, handleSaveGlobal } = useHandleEditTable();
    const [customerError, setError] = useState<CustomError | null>(null);
    const [tableRowId, setTableRowId] = useState("");

    const { data, isLoading, isError } = useCustomers({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            select: (data: CustomerDataApiInterface) => {
                const mappedData: CustomerInterface[] = data.data.map(
                    (customer: CustomerApiInterface) => {
                        return {
                            key: customer._id,
                            name: customer.name,
                            address: customer.address,
                            subCustomer: customer.subCustomer,
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
    const customerData: CustomerDataInterface =
        data as unknown as CustomerDataInterface;

    const {
        mutate: createCustomer,
        isLoading: isLoadingCreateCustomer,
        isError: isErrorCreateCustomer,
    } = useCreateCustomer({
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["customers"]);
            },
        },
    });

    const {
        mutate: updateCustomer,
        isLoading: isLoadingUpdateCustomer,
        isError: isErrorUpdateCustomer,
    } = useUpdateCustomer({
        customer_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["customers"]);
            },
        },
    });

    const {
        mutate: deleteCustomer,
        isLoading: isLoadingDeleteCustomer,
        isError: isErrorDeleteCustomer,
    } = useDeleteCustomer({
        customer_id: tableRowId,
        options: {
            onError: (err: CustomError) => {
                setError(err);
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries(["customers"]);
            },
        },
    });

    const columns = useCustomerColumn({
        createCustomer,
        updateCustomer,
        deleteCustomer,
        handleSaveGlobal,
        handleDelete,
        setTableRowId,
        isLoadingUpdateCustomer,
        isLoadingCreateCustomer,
        isLoadingDeleteCustomer,
    });
    if (
        isError ||
        isErrorCreateCustomer ||
        isErrorDeleteCustomer ||
        isErrorUpdateCustomer
    ) {
        openNotificationWithIcon("error", customerError);
    }
    return (
        <>
            <h1>Customer Page</h1>
            {contextNotif}
            <Skeleton
                loading={
                    isLoading ||
                    isLoadingDeleteCustomer ||
                    isLoadingCreateCustomer ||
                    isLoadingUpdateCustomer
                }
            >
                <InvTableEditComponent
                    columns={columns}
                    items={customerData?.data}
                    addButtonLabel="+ Add Customer"
                />
            </Skeleton>
        </>
    );
};

export default CustomerPage;
