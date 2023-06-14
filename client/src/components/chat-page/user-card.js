import React, { useContext } from "react";
import axios from "axios";
import { Context } from "../context/context";

const UserCard = (props) => {

    let {name, code} = useContext(Context);

    const sendFriendRequest = () => {
        
        //retrieve the name and code of the user who is sendig the invite from context
        console.log(`sending friend request to -- ${props.code} -- from -- ${name} `)

        axios.post("http://localhost:3009/send", { sender: [name, code], receiver: [props.userName, props.code] })//route to send a request
        .then(response => {
            console.log(response)
        })
        .catch(error => {
          console.error(error);
        });
    }

    return (
        <div className="userCard" onClick={sendFriendRequest}>
            <img alt="22"/>
            <p>{props.userName}</p>
        </div>
    )
}

export default UserCard;