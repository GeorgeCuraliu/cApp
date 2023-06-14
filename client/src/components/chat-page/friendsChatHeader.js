import React from "react";
import { Context } from "../context/context";
import { useContext } from "react";

const FriendChatHeader = () => {

    let {activeUserChatData} = useContext(Context)

    return(
        <div>
            <img className="friendPicture" alt="friendProfilePicture"/>
            <p>{activeUserChatData.name}</p>
            <img className="friendOptions" alt="friendOptions"/>
        </div>
    )
}

export default FriendChatHeader;