import { createContext, useState} from "react";
import websocket from "../modules/websocket";

const websocketContext = createContext();

const ContextProviderWebSocket = ({children}) => {
    const [newUserMessage, setNewUserMessage] = useState({});
    const [newServerMessage, setNewServerMessage] = useState({});

    websocket.onmessage = data => {
        const dataj = JSON.parse(data.data);
        console.log("received data from server trought ws");
        console.log(dataj);
        if(dataj.type === "newUserMessage"){
            setNewUserMessage(dataj.data);
        }
        else if(dataj.type === "newServerMessage"){
            setNewServerMessage(dataj.data);
        }
    }

    const contextValues = {
        newUserMessage,
        newServerMessage
    }

    return <websocketContext.Provider value={contextValues}>{children}</websocketContext.Provider>
}

export {websocketContext, ContextProviderWebSocket};