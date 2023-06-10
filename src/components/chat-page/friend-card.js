import React from "react";
import { useContext } from "react";
import { Context } from "../context/context";

const FriendCard = (props) => {

    const {setUserChatOpen, setActiveUserChatData} = useContext(Context);// props.name----props.data = [userCode, dateOfFriendRequest, chatCode]

    const handleFriendClick= () => {
        setUserChatOpen(true);
        setActiveUserChatData({name : props.name, code: props.data[0], friendsSince: props.data[1], chatCode: props.data[2]})
    }

    return(
        <div className="friendCard" onClick={handleFriendClick}>
            <img alt="friendProfilePicture" />
            <p>{props.name}</p>
        </div>
    )

}

export default FriendCard;