import React from "react";
import { useContext } from "react";
import { Context } from "../context/context";

const FriendCard = (props) => {

    const {activeUserChatData, setUserChatOpen, setActiveUserChatData, serverChatOpen, setServerChatOpen, userChatOpen} = useContext(Context);// props.name----props.data = [userCode, dateOfFriendRequest, chatCode]

    const handleFriendClick= () => {
        setUserChatOpen(true);
        setActiveUserChatData({name : props.name, code: props.data[0], friendsSince: props.data[1], chatCode: props.data[2]})
        if(serverChatOpen){setServerChatOpen(false)}//in case that the server chat is open, it turns it off
    }

    let styleOBJ = {};
    if(userChatOpen && activeUserChatData.name === props.name){
        styleOBJ = {backgroundColor: "#5C8374"};
    }

    return(
        <div style={styleOBJ} className="friendCard" onClick={handleFriendClick}>
            <img alt="friendProfilePicture" />
            <p>{props.name}</p>
        </div>
    )

}

export default FriendCard;