import { createContext, useState, useEffect } from "react";

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

    useEffect(() => {

        console.log("Context loaded");

        const savedContextValues = sessionStorage.getItem("contextValues");
        if (savedContextValues) {
            const parsedValues = JSON.parse(savedContextValues);
            setName(parsedValues.name);
            setPassword(parsedValues.password);
            setCode(parsedValues.code);
            setUserChatOpen(parsedValues.userChatOpen);
            setServerChatOpen(parsedValues.serverChatOpen);
            setActiveUserChatData(parsedValues.activeUserChatData);
        }
    }, [])

    useEffect(() => {
        
        console.log(`Saving data for sessionStorage for user ${code}`);

        const contextValues = JSON.stringify({
            name,
            password,
            code,
            userChatOpen,
            serverChatOpen,
            activeUserChatData,
          });
        sessionStorage.setItem("contextValues", contextValues);

      }, [name, password, code, userChatOpen, serverChatOpen, activeUserChatData]);

    return <Context.Provider value={contextValues}>{children}</Context.Provider>

}

export {Context, ContextProvider}