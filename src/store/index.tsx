import { createContext, useContext, useState } from "react";
import { DataType } from "../components/InvTableEdit/InvTableEdit.interface";

export interface GlobalStateType {
    // Define your global state variables here
    // For example:
    // isLoggedIn: boolean;
    // user: User | null;
    // cart: CartItem[];
    // userEditContext: DataType[];
    [key: string]: any;
    sideBarContext: boolean;
}

// Create a new context for the global state
const GlobalStateContext = createContext<{
    globalState: GlobalStateType;
    setGlobalState: React.Dispatch<React.SetStateAction<GlobalStateType>>;
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

export const GlobalStateProvider = ({ children }: any) => {
    const [globalState, setGlobalState] = useState<GlobalStateType>({
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
