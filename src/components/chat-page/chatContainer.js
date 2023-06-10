import React from "react";
import "../styles/chatContainer.css"
import FriendChatHeader from "./friendsChatHeader";
import { Context } from "../context/context";
import { useContext } from "react";
import { useState } from "react";
import axios from "axios";

const ChatContainer = () => {

    let {activeUserChatData, name, code} = useContext(Context)
    let [message, setMessage] = useState("")

    const sendMessage = () => {
        console.log("sending message")
        if(activeUserChatData.name){
            
            axios.post("http://localhost:3091/sendMessage", {sender : [name, code], receiver: [activeUserChatData.name, activeUserChatData.code], message:{message:message}, chatNumber: activeUserChatData.chatCode})
            .then(response => {
                console.log(response)
            })
            .catch(error => {
              console.error(error);
            });
            
        }
    }

    return(
        <div className="chatContainer">
            <header>
                <FriendChatHeader />
            </header>
            <div>
                {/* {there will be imported an element for the messages} */}
            </div>
            <footer>
                <div>
                    <input 
                        placeholder="Type your messaeg here" 
                        type={"text"}
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={sendMessage}>Send</button>
                    <div>Add image</div>
                </div>
            </footer>
        </div>
    )

}

export default ChatContainer;