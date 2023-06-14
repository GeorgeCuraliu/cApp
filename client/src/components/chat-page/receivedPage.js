import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import ReceivedRequestCard from "./receivedRequestCard";

const ReceivedPage = () => {

    let [requests, setRequests] = useState({});

    useEffect(() => {
        const currUserName = document.cookie.split("=")[1].split(" ")[0];
        axios.post("http://localhost:3009/userReceivedRequests", { userName: currUserName })//will retrieve a object with friend request for this account
        .then(response => {
            setRequests(response.data);
            console.log(response.data);
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