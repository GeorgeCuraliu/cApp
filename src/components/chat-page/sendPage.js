import React from "react";
import UserCard from "./user-card";

const SendPage = () => {
    return(
        <div className="requestContainer">
            <div className="requestContainer2">
                <form>
                    <input
                    placeholder="Type the name here"/>
                    <button>Search</button>
                </form>
                <div className="foundUsersContainer">
                    
                </div>    
            </div>
        </div>
    )
}

export default SendPage;