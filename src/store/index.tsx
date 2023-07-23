import { createContext, useContext, useState } from "react";
import { UserInterface } from "../pages/User";
import { SupplierInterface } from "../pages/Supplier";
import { RawMaterialInterface } from "../pages/RawMaterial";
import { ProductInterface } from "../pages/Product";
import { CustomerInterface } from "../pages/Customer";
// import { DataType } from "../components/InvTableEdit/InvTableEdit.interface";

export interface GlobalStateType {
    userEditContext: UserInterface[];
    supplierEditContext: SupplierInterface[];
    rawMaterialEditContext: RawMaterialInterface[];
    productEditContext: ProductInterface[];
    customerEditContext: CustomerInterface[];
}

export interface GlobalStateCombination extends GlobalStateType {
    sideBarContext: boolean;
}
interface GlobalStateProviderProps {
    children: React.ReactNode;
}
// Create a new context for the global state
const GlobalStateContext = createContext<{
    globalState: GlobalStateCombination;
    setGlobalState: React.Dispatch<
        React.SetStateAction<GlobalStateCombination>
    >;
} | null>(null);

// Custom hook to access the global state
export const useGlobalState = () => {
    const state = useContext(GlobalStateContext);
    if (!state) {
        throw new Error(
            "useGlobalState must be used within a GlobalStateProvider"
        );
    }
    return state;
};

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
    children,
}) => {
    const [globalState, setGlobalState] = useState<GlobalStateCombination>({
        sideBarContext: false,
        userEditContext: [],
        supplierEditContext: [],
        rawMaterialEditContext: [],
        productEditContext: [],
        customerEditContext: [],
    });

    return (
        <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
            {children}
        </GlobalStateContext.Provider>
    );
};
