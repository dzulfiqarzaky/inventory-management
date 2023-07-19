import React, { createContext, useContext, useState } from "react";

// Create a new context for the global state
const GlobalStateContext: null | any = createContext(null);

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
    const [globalState, setGlobalState] = useState({
        // Add your global state variables here
        // For example:
        // isLoggedIn: false,
        // user: null,
        // cart: [],
        sideBarContext: false,
    });

    return (
        <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
            {children}
        </GlobalStateContext.Provider>
    );
};
