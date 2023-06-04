import React from "react";
import { useEffect } from "react";
import axios from "axios";

const ReceivedPage = () => {

    useEffect(() => {
        const currUserName = document.cookie.split("=")[1].split(" ")[0];
        axios.post("http://localhost:3002/userReceivedRequests", { userName: currUserName })//will retrieve a object with friend request for this account
        .then(response => {
            
            console.log(response.data)
        })
        .catch(error => {
          console.error(error);
        });

    }, [])

    return(
        <div className="receivedPageContainer">
            <div className="receivedRequests">

            </div>
        </div>
    )
}

export default ReceivedPage;