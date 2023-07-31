import moment from "moment";

// TYPES FOR API RESPONSE
export type ProductApiItem = {
    product: ProductApi;
    qty: string;
    uom: string;
    _id: string;
};

export type ProductApi = {
    _id: string;
    name: string;
    SKU: string;
};

export type ProductApiResponse = {
    _id: string;
    productionDate: Date;
    note: string;
    productItems: ProductApiItem[];
    createdAt: Date;
    updatedAt: Date;
    v: number;
};

export type ProductsDataApiResponse = {
    data: ProductApiResponse[];
};

// TYPES FOR COLUMN AND TABLE
export type ProductInitial = {
    product: string;
    qty: string;
    uom: string;
};

export type ProductInitialData = {
    id: string;
    productionDate: moment.Moment | string;
    note: string;
    products: ProductInitial[];
};

export type ProductMapped = {
    product: string;
    qty: string;
    uom: string;
    _id: string;
    key: string;
    productionDate: string;
    note: string;
};

export type DataResponseProduct = {
    data: ProductMapped[];
    initialData: ProductInitialData[];
};

export type ProductionColumns = {
    dataSource: ProductMapped[];
    initialProductData: ProductInitialData[];
    deleteProduction: () => void;
    setTableRowId: (key: string) => void;
    setOpenEdit: (state: { edit: boolean; data: ProductInitialData }) => void;
    isLoadingDeleteProduction: boolean;
};

// TYPE FOR FORM
export type ProductsList = {
    label: string;
    value: string;
    uom: string;
};

export type Submit =
    | (() => void)
    | ((data: Partial<ProductInitialData>) => void);

export type ProductsListType = {
    data: ProductsList[];
};
export type PropsProductForm = {
    isLoading: boolean;
    product: ProductsListType;
    onSubmit: Submit;
    initialVal?: ProductInitialData;
};
