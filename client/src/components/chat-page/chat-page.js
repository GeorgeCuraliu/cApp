import React from "react";
import UserContainer from "./user-container";
import { useState } from "react";
import FriendRequestPage from "./friend-request-page";
import { Context } from "../context/context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ChatContainer from "./chatContainer";
import ServerContainer from "./serverContainer";


const ChatPage = () => {    

    const navigate = useNavigate();
    let { userChatOpen, activeUserChatData} = useContext(Context);
    let [friendPageDisplay, setFriendPageDisplay] = useState(false);//will handle the display of friend requests page

    //create a a style object that will just set the flex-direction
    const styleContainer = {
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        height: "100vh"
    }

    const handleFriendPage = () => {//this will cahnge the viibilit of friend page
      console.log("loaded the chat")
        setFriendPageDisplay((value) => !value)
    }


    return(
        <div style={styleContainer}>
            <UserContainer  />
            <ServerContainer />
            {friendPageDisplay && <FriendRequestPage  handleFriendPage = {handleFriendPage}/>}
            {userChatOpen && <ChatContainer key={activeUserChatData.name} />}
        </div>
    )
}

export default ChatPage;