import { Children, createContext, useState} from "react";
import websocket from "../modules/websocket";

const websocketContext = createContext();

const ContextProviderWebSocket = ({children}) => {
    const [newUserMessage, setNewUserMessage] = useState();

    websocket.onmessage = data => {
        const dataj = JSON.parse(data.data);
        setNewUserMessage(dataj);
    }

    const contextValues = {
        newUserMessage
    }

    return <websocketContext.Provider value={contextValues}>{children}</websocketContext.Provider>
}

export {websocketContext, ContextProviderWebSocket};