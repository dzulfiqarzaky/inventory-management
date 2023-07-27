import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export default interface BaseCustomerInterface {
    name: string;
    address: string;
    subCustomer: string[];
}

export interface CustomerInterface extends BaseCustomerInterface {
    key: string;
}
export interface CustomerApiInterface extends BaseCustomerInterface {
    _id: string;
}
export interface CustomerDataInterface {
    data: CustomerInterface[];
}
export interface CustomerDataApiInterface {
    data: CustomerApiInterface[];
}

export interface CustomerColumnInterface {
    createCustomer: (obj: BaseCustomerInterface) => void;
    updateCustomer: (obj: Partial<BaseCustomerInterface>) => void;
    deleteCustomer: () => void;
    handleSaveGlobal: (record: DataType) => void;
    handleDelete: (key: string) => void;
    setTableRowId: (key: string) => void;
    isLoadingUpdateCustomer: boolean;
    isLoadingCreateCustomer: boolean;
    isLoadingDeleteCustomer: boolean;
}
