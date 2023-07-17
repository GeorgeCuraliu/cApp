import { Context } from "../context/context";
import { useContext, useEffect, useState, useRef } from "react";
import "../styles/chatPage/serverChat.css";
import ServerMessageContainer from "./serverMessageContainer";
import axios from "axios";

const ServerChatInput = () => {

    const {activeServerChatData, code} = useContext(Context);
    const [displayInput, setDisplayInput] = useState(false)
    const [messages, setMessages] = useState({});
    const [messagesLoaded, setMessagesLoaded] = useState(false)

    const message = useRef();
    const lastIndex = useRef();

    useEffect(() => {
        if(activeServerChatData.activeChannel && activeServerChatData.channels[activeServerChatData.activeChannel].messageAcces === "public"){
            setDisplayInput(true)
        }else{
            setDisplayInput(false)
        }
    }, [activeServerChatData.activeChannel])


    useEffect(() => {
        if(activeServerChatData.activeChannel){
            axios.post("http://localhost:3009/getMessagesServer", {serverCode: activeServerChatData.code, channel: activeServerChatData.activeChannel})
            .then(response => {
                console.log(response)
                setMessages(response.data.messages)
                lastIndex.current = response.data.lastIndex;
                setMessagesLoaded(true)
            }) 
        }
    }, [activeServerChatData.activeChannel]);


    const requestMessages = () => {
        console.log(lastIndex)
    }


    const sendMessage = () => {
        console.log(message.current.value)

        axios.post("http://localhost:3009/sendMessageServer", {serverCode: activeServerChatData.code, by: code, message: message.current.value, channel: activeServerChatData.activeChannel})
        .then(response => {
            console.log(response)
        })

    }

    return(
        <div className="serverChat">
            <ServerMessageContainer requestMessages={requestMessages} messages = {messages} messagesLoaded={messagesLoaded}/>
                <div className="inputContainer"> 
                    {displayInput? 
                    <div>
                        <input ref={message} />
                        <button onClick={sendMessage} className="sendButton"></button>
                    </div>
                    : "no write"}
                </div>
        </div>
    )

}

export default ServerChatInput;