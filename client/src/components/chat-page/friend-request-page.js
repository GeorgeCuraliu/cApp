import React from "react";
import "../styles/friend-request.css"
import { useState } from "react";
import SendPage from "./sendPage";
import ReceivedPage from "./receivedPage";

const FriendRequestPage = (props) => {
    let [page, setPage] =useState("sent")//will decide if sent requests or received request should be displayed

    const handleWindowClick = (event) => {//should stop closing the element if the window-container is pressed
        event.stopPropagation();
    };
    
    console.log(`${page}  page laoded`);

    return(
        <div className="friendRequestsContainer"   onClick={props.handleFriendPage}>
            <div className="windowContainer" onClick={handleWindowClick}>
                <header>
                    <section>
                        <div onClick={() => {setPage("sent")}}>Send a friend request</div>
                        <div onClick={() => {setPage("received")}}>Received friend requests</div>
                    </section>
                    <div onClick={props.handleFriendPage}>Close the window</div>
                </header>
                {page === "sent" && <SendPage />}
                {page === "received" && <ReceivedPage />}
            </div>
        </div>
    )
}

export default FriendRequestPage;