import { useAuthUser } from "@/hooks/useAuthUser";
import { AppContextType } from "@/types";
import { createContext } from "react";
export const AppContext = createContext<AppContextType | null>(null);

function AppContextProvider({children}:{children:React.ReactNode}){

    const {isLoading,loggedInUser,setLoggedInUser} = useAuthUser();

    return (
        <>
            <AppContext.Provider value={{
                isLoading:isLoading,
                loggedInUser:loggedInUser,
                setLoggedInUser:setLoggedInUser,
            }}>
                {children}
            </AppContext.Provider>
        </>
    )

}

export default AppContextProvider;
