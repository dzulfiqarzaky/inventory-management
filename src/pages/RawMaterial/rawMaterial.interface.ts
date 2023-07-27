import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export interface RawMaterialBaseInterface {
    name: string;
    SKU: string;
    unit: string;
    qty: string;
}

export interface RawMaterialInterface extends RawMaterialBaseInterface {
    key: string;
}

export interface RawMaterialApiInterface extends RawMaterialBaseInterface {
    _id: string;
}

export interface RawMaterialDataInterface {
    data: RawMaterialInterface[];
}

export interface RawMaterialApiDataInterface {
    data: RawMaterialApiInterface[];
}

export interface RawMaterialColumnInterface {
    createRawMaterial: (obj: RawMaterialBaseInterface) => void;
    updateRawMaterial: (obj: Partial<RawMaterialBaseInterface>) => void;
    deleteRawMaterial: () => void;
    handleSaveGlobal: (record: DataType) => void;
    handleDelete: (key: string) => void;
    setTableRowId: (key: string) => void;
    isLoadingUpdateRawMaterial: boolean;
    isLoadingCreateRawMaterial: boolean;
    isLoadingDeleteRawMaterial: boolean;
}
