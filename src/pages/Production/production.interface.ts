export interface ProductItem {
    _id: string;
    product: string;
    qty: string;
}
export interface ProductionBaseInterface {
    note: string;
    productionDate: string;
    productItems: ProductItem[];
}
export interface ProductionInterface extends ProductionBaseInterface {
    key: string;
    total: number;
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
