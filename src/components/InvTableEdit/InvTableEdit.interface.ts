import { Table } from "antd";
import { UserInterface } from "../../pages/User/user.interface";
import { SupplierInterface } from "../../pages/Supplier/supplier.interface";
import { RawMaterialInterface } from "../../pages/RawMaterial";
import { ProductInterface } from "../../pages/Product";
import { CustomerInterface } from "../../pages/Customer";

type CommonDataType = {
    newData?: boolean;
    edited?: boolean;
};

type UserDataType = UserInterface;
type SupplierDataType = SupplierInterface;
type RawMaterialDataType = RawMaterialInterface;
type ProductDataType = ProductInterface;
type CustomerDataType = CustomerInterface;

export type DataType = CommonDataType &
    (
        | UserDataType
        | SupplierDataType
        | RawMaterialDataType
        | ProductDataType
        | CustomerDataType
    );

export interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof DataType;
    record: DataType;
    handleSave: (record: DataType) => void;
}

export type EditableTableProps = Parameters<typeof Table>[0];

export type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;
