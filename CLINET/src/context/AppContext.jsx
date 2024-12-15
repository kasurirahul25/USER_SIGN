import axios from "axios";
import { useState, createContext, useEffect } from "react";
import { toast } from "react-toastify";

axios.defaults.withCredentials=true;

export const AppContext = createContext(); // Renamed for clarity

export const AppContextProvider = (props) => {
    const backendurl = import.meta.env.VITE_BACKENDURL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false); // Use `null` for better semantics if no data


        const getAuthState = async ()=>{
            try{
                const {data} = await axios.get(backendurl+'/api/auth/is-auth')

            if(data.success){

                setIsLoggedin(true)
                getUserData()

        }

            }catch(error){
                toast.error(error.message)
            }
        }

    const getUserData = async()=>{
        try{
                const{data} = await axios.get(backendurl+'/api/user/data')
                data.success ? setUserData(data.userData) : toast.error(data.message)
        }catch(error){
            toast.error(error.message)
        }
    }


    useEffect(()=>{
        getAuthState();
    },[])



    const value = {
        backendurl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData
    };

    return (
        <AppContext.Provider value={value}> {/* Use AppContext.Provider */}
            {props.children}
        </AppContext.Provider>
    );
};
