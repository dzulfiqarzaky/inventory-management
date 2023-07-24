import { createContext, useContext, useState } from "react";

export interface GlobalStateType {
    sideBarContext: boolean;
}

interface GlobalStateProviderProps {
    children: React.ReactNode;
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

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
    children,
}) => {
    const [globalState, setGlobalState] = useState<GlobalStateType>({
        sideBarContext: false,
    });

    return (
        <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
            {children}
        </GlobalStateContext.Provider>
    );
};
