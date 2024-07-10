import { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {

    const [isLogged, setIsLogged] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selected, setSelected] = useState(0)

    useEffect(() => {

            }, [])

    return (
        <GlobalContext.Provider
         value={{
            isLogged,
            setIsLogged,
            user,
            setUser,
            isLoading,
            setIsLoading,
            selected,
            setSelected,
         }}>
            {children}
        </GlobalContext.Provider>
    )}

export default GlobalProvider