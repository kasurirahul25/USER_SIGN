import { useState, createContext } from "react";

export const AppContext = createContext(); // Renamed for clarity

export const AppContextProvider = (props) => {
    const backendurl = import.meta.env.VITE_BACKENDURL; // Ensure VITE_BACKENDURL is in .env
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null); // Use `null` for better semantics if no data

    const value = {
        backendurl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData
    };

    return (
        <AppContext.Provider value={value}> {/* Use AppContext.Provider */}
            {props.children}
        </AppContext.Provider>
    );
};
