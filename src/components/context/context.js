import { createContext, useState } from "react";

const Context = createContext();

const ContextProvider = ({children}) => {

    let [name, setName] = useState("")
    let [password, setPassword] = useState("")
    let [code, setCode] = useState(NaN);
    let [userChatOpen, setUserChatOpen] = useState(false);
    let [serverChatOpen, setServerChatOpen] = useState(false);
    let [activeUserChatData, setActiveUserChatData] = useState({});

    const contextValues = {
        name,
        setName,
        password,
        setPassword,
        code, 
        setCode,
        userChatOpen,
        setUserChatOpen,
        serverChatOpen,
        setServerChatOpen,
        activeUserChatData,
        setActiveUserChatData
    }

    return <Context.Provider value={contextValues}>{children}</Context.Provider>

}

export {Context, ContextProvider}