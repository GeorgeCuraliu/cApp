import React, { useContext, useState } from "react";
import "../styles/user-container.css";
import AddUserLogo from "../img/add-user.png";
import SettingsLogog from "../img/settings.png"
import { Context } from "../context/context";
import axios from "axios";
import FriendCard from "./friend-card";

const UserContainer = (props) => {

    const {name, code} = useContext(Context);
    let [friends, setFriends] = useState({});
    let [loadedFriends, setLoadedFriends] = useState(false);//this will make sure that the element is not getting info to many times

    if(code && name && !loadedFriends){

        async function fetchFriendsData() {
        try {
              console.log(`accessing the friends data with code ${code}`);
              const response = await axios.post("http://localhost:3091/getFriends", { code: code });
              console.log(response.data);
              setFriends(response.data);
              setLoadedFriends(true);
            } catch (error) {
              console.log(error);
            }
          }
          
          fetchFriendsData();

    }

    
    console.log(name)

    return(
        <div className="userContainer">
            <div className="user-showcase">
                <img alt="notanimage"/>
                <p>{name}</p>
            </div>

            <div className="users">
                {Object.entries(friends).map(([name, data]) => {
                    return <FriendCard key={name} name={name} data={data}/>
                })}
            </div>
            

            <div className="buttonContainer">
                <div onClick={props.handleFriendPage} className="friendRequests">{/**this will add the div that will trigger the friend request manager window*/}
                    <img src={AddUserLogo} alt="AddUserLogo"/>
                </div>
                <div className="settingsDiv">{/**will load a completely new page, based on a new url, for server, user, app settings*/}
                    <img src={SettingsLogog} alt="AddUserLogo"/>
                </div>
            </div>

            
        </div>
    )
}

export default UserContainer;