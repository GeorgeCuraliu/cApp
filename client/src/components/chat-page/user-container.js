import React, { useContext, useEffect, useState } from "react";
import "../styles/user-container.css";
import AddUserLogo from "../img/add-user.png";
import SettingsLogog from "../img/settings.png"
import { Context } from "../context/context";
import axios from "axios";
import FriendCard from "./friend-card";
import { useNavigate } from "react-router-dom";

const UserContainer = (props) => {

    const navigate = useNavigate();

    const {name, code } = useContext(Context);
    let [friends, setFriends] = useState({});

    useEffect(() => {
        if(code && name){

            const fetchFriendsData = async () => {
                try {
                    console.log(`accessing the friends data with code ${code}`);
                    const response = await axios.post("http://localhost:3009/getFriends", { code: code });
                    console.log(response.data);
                    setFriends(response.data.friends);
                } catch (error) {
                    console.log("some critical expected error happened :(")
                    console.log(error);
                }
            }
              
              fetchFriendsData();
    
        }else{
            console.log("no credentials found, why?")
        }
    }, [name, code])

    const activateFriendRequests = () => {
        console.log("loading user chat")
        props.handleFriendPage();
    }


    const loadSettings = () => {
        navigate("/settings")
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
                <div onClick={activateFriendRequests} className="friendRequests">{/**this will add the div that will trigger the friend request manager window*/}
                    <img src={AddUserLogo} alt="AddUserLogo"/>
                </div>
                <div onClick={loadSettings} className="settingsDiv">{/**will load a completely new page, based on a new url, for server, user, app settings*/}
                    <img src={SettingsLogog} alt="AddUserLogo"/>
                </div>
            </div>

            
        </div>
    )
}

export default UserContainer;