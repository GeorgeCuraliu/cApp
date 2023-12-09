import React, { useContext } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import ReceivedRequestCard from "./receivedRequestCard";
import { Context } from "../context/context";
import { websocketContext } from "../context/webSocketContext";

const ReceivedPage = () => {

    const {newFriendRequest} = useContext(websocketContext);
    let {code} = useContext(Context);

    let [requests, setRequests] = useState({});

    useEffect(() => {
        const currUserName = document.cookie.split("=")[1].split(" ")[0];
        axios.post("http://localhost:3009/userReceivedRequests", { userName: currUserName, usercode: code })//will retrieve a object with friend request for this account
        .then(response => {
            setRequests(response.data.friendRequests);
            console.log(response.data.friendRequests);
        })
        .catch(error => {
          console.error(error);
        });

    }, []);

    useEffect(() => {
        console.log("adding new request");
        let temp = {...requests};
        if(newFriendRequest){
            console.log(newFriendRequest);
            temp[newFriendRequest[0]] = newFriendRequest[1];
        }
        setRequests(temp);
    }, [newFriendRequest]);

    const deleteRequest = (username) => {
        console.log("deleting request");
        let temp = {...requests};
        delete temp[username];
        setRequests(temp);
    }

    return(
        <div className="receivedPageContainer">
            <div className="receivedRequests">
                { Object.entries(requests).map(([user, value]) => {
                    return <ReceivedRequestCard user = {user} code = {value} key={value} deleteRequest = {deleteRequest}/>
                })}
            </div>
        </div>
    )
}

export default ReceivedPage;