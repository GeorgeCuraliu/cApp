import React from "react";
import UserContainer from "./user-container";
import { useState } from "react";
import FriendRequestPage from "./friend-request-page";

const ChatPage = () => {
    //create a a style object that will just set the flex-direction
    const styleContainer = {
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        height: "100vh"
    }

    let [friendPageDisplay, setFriendPageDisplay] = useState(false);

    const handleFriendPage = () => {//this will cahnge the viibilit of friend page
        setFriendPageDisplay((value) => !value)
    }

    return(
        <div style={styleContainer}>
            <UserContainer  handleFriendPage = {handleFriendPage}/>
            {friendPageDisplay && <FriendRequestPage  handleFriendPage = {handleFriendPage}/>}
        </div>
    )
}

export default ChatPage;