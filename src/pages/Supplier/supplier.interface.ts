import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export interface BaseSuplierInterface {
    name: string;
}
export interface SupplierInterface extends BaseSuplierInterface {
    key: string;
}
export interface SupplierApiInterface extends BaseSuplierInterface {
    _id: string;
}
export interface SupplierDataApiInterface {
    data: SupplierApiInterface[];
}
export interface SupplierDataInterface {
    data: SupplierInterface[];
}

export interface SupplierColumnInterface {
    createSupplier: (obj: BaseSuplierInterface) => void;
    updateSupplier: (obj: Partial<BaseSuplierInterface>) => void;
    deleteSupplier: () => void;
    handleSaveGlobal: (record: DataType) => void;
    handleDelete: (key: string) => void;
    setTableRowId: (key: string) => void;
    isLoadingUpdateSupplier: boolean;
    isLoadingCreateSupplier: boolean;
    isLoadingDeleteSupplier: boolean;
}
