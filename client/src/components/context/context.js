import { createContext, useState, useEffect } from "react";

const Context = createContext();

const ContextProvider = ({children}) => {

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [code, setCode] = useState(NaN);
    const [userChatOpen, setUserChatOpen] = useState(false);
    const [serverChatOpen, setServerChatOpen] = useState(false);
    const [activeUserChatData, setActiveUserChatData] = useState({});
    const [activeServerChatData, setActiveServerChatData] = useState()

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
        setActiveUserChatData,
        activeServerChatData,
        setActiveServerChatData
    }

    useEffect(() => {

        console.log(`Context loaded with the code of ${code} and username ${name}`);

        const savedContextValues = sessionStorage.getItem("contextValues");

        if (savedContextValues) {
            const parsedValues = JSON.parse(savedContextValues);
            setName(parsedValues.name);
            setPassword(parsedValues.password);
            setCode(parsedValues.code);
            setUserChatOpen(parsedValues.userChatOpen);
            setServerChatOpen(parsedValues.serverChatOpen);
            setActiveUserChatData(parsedValues.activeUserChatData);
            setActiveServerChatData(parsedValues.activeServerChatData);
        }else{
            console.log("No local storage found")
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
            activeServerChatData
          });
        sessionStorage.setItem("contextValues", contextValues);

      }, [name, password, code, userChatOpen, serverChatOpen, activeUserChatData, activeServerChatData]);

    return <Context.Provider value={contextValues}>{children}</Context.Provider>

}

export {Context, ContextProvider}