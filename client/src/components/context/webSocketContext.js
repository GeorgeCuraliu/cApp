import { createContext, useState} from "react";
import websocket from "../modules/websocket";

const websocketContext = createContext();

const ContextProviderWebSocket = ({children}) => {
    const [newUserMessage, setNewUserMessage] = useState({});
    const [newServerMessage, setNewServerMessage] = useState({});
    const [newFriendRequest, setNewFriendRequest] = useState([]);
    const [newFriend, setNewFriend] = useState({});
    const [newServerJoinRequest, setNewServerJoinRequest] = useState({});

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
        else if(dataj.type === "receivedFriendRequest"){
            setNewFriendRequest(dataj.data);
        }
        else if(dataj.type === "newFriend"){
            setNewFriend(dataj.data);
        }
        else if(dataj.type === "newServerJoinRequest"){
            setNewServerJoinRequest(dataj.data);
        }
    }

    const contextValues = {
        newUserMessage,
        newServerMessage,
        newFriendRequest,
        newFriend,
        newServerJoinRequest,
        setNewServerJoinRequest
    }

    return <websocketContext.Provider value={contextValues}>{children}</websocketContext.Provider>
}

export {websocketContext, ContextProviderWebSocket};