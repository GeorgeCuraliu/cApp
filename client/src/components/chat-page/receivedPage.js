import React, { useContext } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import ReceivedRequestCard from "./receivedRequestCard";
import { Context } from "../context/context";

const ReceivedPage = () => {

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

    }, [])

    return(
        <div className="receivedPageContainer">
            <div className="receivedRequests">
                { Object.entries(requests).map(([user, value]) => {
                    return <ReceivedRequestCard user = {user} code = {value} key={value}/>
                })}
            </div>
        </div>
    )
}

export default ReceivedPage;