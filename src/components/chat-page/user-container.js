import React from "react";
import "../styles/user-container.css";
import AddUserLogo from "../img/add-user.png";
import SettingsLogog from "../img/settings.png"

const UserContainer = (props) => {
    return(
        <div className="userContainer">
            <div className="users"></div>
            {/**there i will add the friends, propb i shoudl use another component*/}

            <div className="buttonContainer">
                <div onClick={props.handleFriendPage} className="friendRequests">{/**this will add the div that will trigger the friend request manager window*/}
                    <img src={AddUserLogo} alt="AddUserLogo"/>
                </div>
                <div className="settingsDiv">{/**will load a completely new page, based pn a new url, for server, user, app settings*/}
                    <img src={SettingsLogog} alt="AddUserLogo"/>
                </div>
            </div>

            
        </div>
    )
}

export default UserContainer;