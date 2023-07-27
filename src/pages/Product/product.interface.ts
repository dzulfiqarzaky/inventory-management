import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export interface ProductBaseInterface {
    name: string;
    SKU: string;
    unit: string;
    qty: string;
}

export interface ProductInterface extends ProductBaseInterface {
    key: string;
}

export interface ProductApiInterface extends ProductBaseInterface {
    _id: string;
}

export interface ProductDataInterface {
    data: ProductInterface[];
}

export interface ProductDataApiInterface {
    data: ProductApiInterface[];
}

export interface ProductColumnInterface {
    createProduct: (obj: ProductBaseInterface) => void;
    updateProduct: (obj: Partial<ProductBaseInterface>) => void;
    deleteProduct: () => void;
    handleSaveGlobal: (record: DataType) => void;
    handleDelete: (key: string) => void;
    setTableRowId: (key: string) => void;
    isLoadingUpdateProduct: boolean;
    isLoadingCreateProduct: boolean;
    isLoadingDeleteProduct: boolean;
}
