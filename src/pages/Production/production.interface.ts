export interface Product {
    _id: string;
    name: string;
}

export interface ProductItem {
    _id: string;
    product: Product;
    qty: string;
    uom: string;
}

export interface ProductionBaseInterface {
    note: string;
    productionDate: string;
    productItems: ProductItem[];
}

export interface ProductionInterface extends ProductionBaseInterface {
    product: string;
    key: string;
}

export interface ProductionApiInterface extends ProductionBaseInterface {
    _id: string;
}

export interface ProductionDataInterface {
    data: ProductionInterface[];
}

export interface ProductionDataApiInterface {
    data: ProductionApiInterface[];
}
