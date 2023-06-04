import React from "react";
import axios from "axios";

const UserCard = (props) => {

    const sendFriendRequest = () => {
        
        //retrieve the name of the user who is sendig the invite from cookie
        const currUserName = document.cookie.split("=")[1].split(" ")[0];
        console.log(`sending friend request to -- ${props.code} -- from -- ${currUserName} `)

        axios.post("http://localhost:3002/send", { sender: currUserName, receiver: [props.userName, props.code] })//route to send a request
        .then(response => {
            console.log(response)
        })
        .catch(error => {
          console.error(error);
        });
    }

    return (
        <div className="userCard" onClick={sendFriendRequest}>
            <img />
            <p>{props.userName}</p>
        </div>
    )
}

export default UserCard;