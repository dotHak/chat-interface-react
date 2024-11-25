import { createContext, useContext, useState } from "react";

export type GlobalContextState = {
    prompt?: string;
    setPrompt: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const GlobalContext = createContext<GlobalContextState>({
    setPrompt: () => {
        throw new Error("setPrompt must be overridden");
    },
});

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error(
            "useGlobalContext must be used within a GlobalContextProvider",
        );
    }

    return context;
};

export const GlobalContextProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [prompt, setPrompt] = useState<string | undefined>(undefined);

    return (
        <GlobalContext.Provider value={{ prompt, setPrompt }}>
            {children}
        </GlobalContext.Provider>
    );
};
